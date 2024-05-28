const express = require("express");
const router = express.Router();
const User =require('../models/user');
const bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const role = require('../config/role');
const { InRole, ROLES } = require('../config/role');
const { verifyJWT } = require('../middelware/jwtmiddleware');



filename='';
const mystorage=multer.diskStorage({
    destination: "./uploads",
    filename:(res,file,redirect)=>{
        let date = Date.now();
        //image/png
        let fl = date+"."+file.mimetype.split('/')[1];
        redirect(null,fl);
        filename=fl;
    }

})

const upload= multer({storage:mystorage});

const { body, validationResult } = require("express-validator");


router.use(express.json());

// Vvalidation mt3 user <3


const createUserValidation = [
    body("cin").isInt().withMessage("Le CIN doit être une valeur numérique").isLength({ min: 8, max: 8 }).withMessage("Le CIN doit contenir exactement 8 chiffres"),
    body("name").matches(/^[a-zA-Z]+$/).withMessage("Le prénom ne doit contenir que des lettres").trim(),
    body("lastname").matches(/^[a-zA-Z]+$/).withMessage("Le nom de famille ne doit contenir que des lettres").trim(),
    body("age").isLength({ min: 2, max: 2 }).withMessage("L'âge doit contenir exactement 2 chiffres"),
    body("addresse").notEmpty().withMessage("L'adresse est obligatoire"),
    body("telephone").isNumeric().withMessage("Le téléphone doit être une valeur numérique").isLength({ min: 8, max: 8 }).withMessage("Le téléphone doit contenir exactement 8 chiffres"),
    body("email").isEmail().withMessage("Format d'email invalide"),
    body("motpasse").notEmpty().withMessage("Le mot de passe est obligatoire"),
    body("role").notEmpty().withMessage("champ obligatoire pour l'acces")
];

module.exports = createUserValidation;


//login ya nadouchty 

router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body);
        const user = await User.findOne({ email: data.email });
        console.log(user);
        if (!user) {
            return res.status(404).send("Email not found in the database");
        }
       console.log(data.motpasse);
       console.log(user.motpasse);
        const validPass = bcrypt.compare(data.motpasse, user.motpasse);
        console.log(validPass);
        if (!validPass) {
            return res.status(401).send("Email or password not valid");
        }
         //bch nsna3 token lena ba3d ma installit biblio jsonwebtokken
            //token mt3i chn7ot fih bch nodhmn li houa s7i7 w y5alik todkhel llapp: 
            //token fih secretkey ena bch n7otou w eli houa (123456789)
            //payload houa objet nsn3ou ena w n7ot fih data li bch nsta3mlha 

        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role  // zedna fazet role
        };
        console.log(payload);

        
        const token = jwt.sign(payload,'123456789');
        console.log(token);
        res.status(200).send({ mytoken: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



// Create a new user
router.post("/create",verifyJWT,InRole(role.ROLES.ADMIN),  upload.any('image'),createUserValidation,async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userData = req.body;
        const newUser = new User(userData);
        console.log(newUser);
        newUser.image=filename;
        
        cryptedPass=await bcrypt.hashSync(userData.motpasse,10);
        newUser.motpasse=cryptedPass;
        const savedUser = await newUser.save();
        filename='';
        console.log(savedUser);
        res.status(201).send(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get all users
router.get("/all",verifyJWT,InRole(role.ROLES.ADMIN), async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get a user by ID
router.get("/getbi/:id",verifyJWT,InRole(role.ROLES.ADMIN), async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a user by ID
router.delete("/del/:id",verifyJWT,InRole(role.ROLES.ADMIN), async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.send(deletedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Update a user by ID
router.put("/up/:id",verifyJWT,InRole(role.ROLES.ADMIN), createUserValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        const newData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



const checkEmailExists = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user !== null;
    } catch (error) {
        throw new Error('Erreur lors de la vérification de l\'email');
    }
};
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


module.exports = router;

