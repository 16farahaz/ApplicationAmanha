const express = require('express');
const router = express.Router();
const Achat = require('../models/achat');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { checkEmailExists } = require('../middelware/verifymiddleware');
const { ROLES } = require('../config/role');

// Route pour vérifier si un email existe
router.post('/checkEmail', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'L\'email est requis' });
    }

    try {
        const emailExists = await checkEmailExists(email);
        res.json({ exists: emailExists });
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email :', error);
        res.status(500).json({ error: 'Erreur du serveur' });
    }
});

// Validation des données pour la création d'un achat
const createAchatValidation = [
   
    body('email').isEmail().withMessage('L\'email est obligatoire'),
    body('idprod').isNumeric().withMessage('L\'ID du produit est obligatoire'),
    body('contrat').isString().withMessage('champs contrat a seulement des alphabets').notEmpty().withMessage('champs contrat doit etre remplis'),
    body('pj').isNumeric().withMessage('champs pj a seulement chiffres').notEmpty().withMessage('champs prix/parjour doit etre remplis'),
    body('dated').isDate().withMessage('respect lecriture de date stp').notEmpty().withMessage('champs dated doit etre remplis'),
    body('datef').isDate().withMessage('respect lecriture de date stp').notEmpty().withMessage('champs datef doit etre remplis'),
    body('total').isNumeric().withMessage('just de chiffres').notEmpty().withMessage('champs total doit etre remplis'),


    // Ajoutez d'autres validations si nécessaire
];

router.post('/create', createAchatValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //5thyt les données mt3i ml front 

        const {  email, idprod, contrat, pj, prot, terme, dated, datef, total } = req.body;
//ntasty ken luser heka mawjoud ou non 
        const emailExists = await checkEmailExists(email);
//ken mch mch mawjoud bch na3mlou user jdid nzidouh ftable user  mnou nsta3mlouh fl achat 
        let user;
        if (!emailExists) {
            // Générer un mot de passe
            const motpasse = generatePassword();
            const hashedPassword = await bcrypt.hash(motpasse, 10);

            // Créer un nouvel utilisateur
            user = new User({email, motpasse: hashedPassword });
            await user.save();
        } else {
            // Retrieve the existing user bch nsta3ml l'id mt3ou 
            user = await User.findOne({ email });
        }

        // Créer un nouvel achat 
        const newAchat = new Achat({
        
            email,
            idprod,
            contrat,
            pj,
            prot,
            terme,
            dated,
            datef,
            total,
            user: user._id // Lien avec l'utilisateur créé
        });

        const savedAchat = await newAchat.save();
        res.status(201).json(savedAchat);

    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur Interne du Serveur');
    }
});

// Fonction pour générer un mot de passe ta3mlna motpasse wahdha hakek <3
function generatePassword() {
    return Math.random().toString(36).slice(-8); // Simple mot de passe de 8 caractères
}




// Route to get all Achats based on user role
router.get('/',verifyJWT,InRole(role.ROLES.ADMIN,ROLES.SIMPLE_USER,ROLES.USER), async (req, res) => {
    try {
        const user = req.user; // Assuming you have middleware to extract user information from the request

        if (user.role === 'ADMIN') {
            // Admin can see all Achats
            const achats = await Achat.find();
            res.json(achats);
        } else {
            // Regular user can only see their own Achats
            const achats = await Achat.find({ user: user._id });
            res.json(achats);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur Interne du Serveur');
    }
});

module.exports = router;




// Récupérer une achat par ID
router.get("/get/:id", verifyJWT,InRole(role.ROLES.ADMIN,ROLES.SIMPLE_USER,ROLES.USER),async (req, res) => {
    try {
        const achatId = req.params.id;
        const achat = await Achat.findById(achatId);
        if (!achat) {
            return res.status(404).send("order not found");
        }
        res.status(200).send(achat);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;
