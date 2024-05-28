
const express = require("express");
const router = express.Router();
const Assurance = require("../models/Assurance");
const { body, validationResult } = require("express-validator");
const role = require('../config/role');
const { InRole, ROLES } = require('../config/role');
const { verifyJWT } = require('../middelware/jwtmiddleware');

router.use(express.json());

// Validation pour la création d'une assurance
const createAssuranceValidation = [
    body("name").notEmpty().withMessage("Le nom est obligatoire"),
    body("adresse").notEmpty().withMessage("L'adresse est obligatoire"),
    body("telephone").isNumeric().withMessage("Le téléphone doit être une valeur numérique").isLength({ min: 8, max: 8 }).withMessage("Le téléphone doit contenir exactement 8 chiffres"),
    body("description").notEmpty().withMessage("La description est obligatoire")
];

// Exportation de la validation pour une réutilisation ultérieure
module.exports= createAssuranceValidation;

// Créer une nouvelle assurance
router.post("/create", verifyJWT,InRole(role.ROLES.ADMIN),createAssuranceValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const assuranceData = req.body;
        const newAssurance = new Assurance(assuranceData);
        const savedAssurance = await newAssurance.save();
        res.status(201).send(savedAssurance);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Récupérer toutes les assurances
router.get("/all", verifyJWT,InRole(role.ROLES.ADMIN),async (req, res) => {
    try {
        const assurances = await Assurance.find();
        res.send(assurances);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Récupérer une assurance par ID
router.get("/get/:id", verifyJWT,InRole(role.ROLES.ADMIN),async (req, res) => {
    try {
        const assuranceId = req.params.id;
        const assurance = await Assurance.findById(assuranceId);
        if (!assurance) {
            return res.status(404).send("Assurance not found");
        }
        res.status(200).send(assurance);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Supprimer une assurance par ID
router.delete("/del/:id",verifyJWT,InRole(role.ROLES.ADMIN), async (req, res) => {
    try {
        const assuranceId = req.params.id;
        const deletedAssurance = await Assurance.findByIdAndDelete(assuranceId);
        if (!deletedAssurance) {
            return res.status(404).send("Assurance not found");
        }
        res.send(deletedAssurance);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Mettre à jour une assurance par ID
router.put("/up/:id", verifyJWT,InRole(role.ROLES.ADMIN),createAssuranceValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const assuranceId = req.params.id;
        const newData = req.body;
        const updatedAssurance = await Assurance.findByIdAndUpdate(assuranceId, newData, { new: true });
        if (!updatedAssurance) {
            return res.status(404).send("Assurance not found");
        }
        res.send(updatedAssurance);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
