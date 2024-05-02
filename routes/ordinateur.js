const express = require("express");
const router = express.Router();
const Ordinateur = require("../models/ordinateur");
const { body, validationResult } = require("express-validator");

router.use(express.json());

// Validation des données pour la création d'un ordinateur
const createOrdinateurValidation = [
    body("numserie").notEmpty().withMessage("Le numéro de série est obligatoire"),
    body("mark").notEmpty().withMessage("La marque est obligatoire"),
    body("prix").isNumeric().withMessage("Le prix doit être une valeur numérique"),
    body("couleur").notEmpty().withMessage("La couleur est obligatoire"),
    body("type").notEmpty().withMessage("Le type est obligatoire")
];

module.exports=createOrdinateurValidation;
// Créer un nouvel ordinateur
router.post("/create", createOrdinateurValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ordinateurData = req.body;
        const newOrdinateur = new Ordinateur(ordinateurData);
        const savedOrdinateur = await newOrdinateur.save();
        res.status(201).send(savedOrdinateur);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir tous les ordinateurs
router.get("/all", async (req, res) => {
    try {
        const ordinateurs = await Ordinateur.find();
        res.send(ordinateurs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir un ordinateur par ID
router.get("/get/:id", async (req, res) => {
    try {
        const ordinateurId = req.params.id;
        const ordinateur = await Ordinateur.findById(ordinateurId);
        if (!ordinateur) {
            return res.status(404).send("Ordinateur not found");
        }
        res.status(200).send(ordinateur);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Supprimer un ordinateur par ID
router.delete("/del/:id", async (req, res) => {
    try {
        const ordinateurId = req.params.id;
        const deletedOrdinateur = await Ordinateur.findByIdAndDelete(ordinateurId);
        if (!deletedOrdinateur) {
            return res.status(404).send("Ordinateur not found");
        }
        res.send(deletedOrdinateur);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Mettre à jour un ordinateur par ID
router.put("/up/:id", createOrdinateurValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ordinateurId = req.params.id;
        const newData = req.body;
        const updatedOrdinateur = await Ordinateur.findByIdAndUpdate(ordinateurId, newData, { new: true });
        if (!updatedOrdinateur) {
            return res.status(404).send("Ordinateur not found");
        }
        res.send(updatedOrdinateur);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
