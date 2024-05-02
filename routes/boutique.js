const express = require("express");
const router = express.Router();
const Boutique = require("../models/Boutique");
const { body, validationResult } = require("express-validator");

router.use(express.json());

// Validation des données pour la création d'une boutique
const createBoutiqueValidation = [
    body("name").notEmpty().withMessage("Le nom de la boutique est obligatoire"),
    body("adresse").notEmpty().withMessage("L'adresse de la boutique est obligatoire"),
    body("telephone").isNumeric().withMessage("Le numéro de téléphone doit être une valeur numérique")
];
module.exports= createBoutiqueValidation;

// Créer une nouvelle boutique
router.post("/create", createBoutiqueValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const boutiqueData = req.body;
        const newBoutique = new Boutique(boutiqueData);
        const savedBoutique = await newBoutique.save();
        res.status(201).send(savedBoutique);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir toutes les boutiques
router.get("/all", async (req, res) => {
    try {
        const boutiques = await Boutique.find();
        res.send(boutiques);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir une boutique par ID
router.get("/get/:id", async (req, res) => {
    try {
        const boutiqueId = req.params.id;
        const boutique = await Boutique.findById(boutiqueId);
        if (!boutique) {
            return res.status(404).send("Boutique not found");
        }
        res.status(200).send(boutique);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Supprimer une boutique par ID
router.delete("/del/:id", async (req, res) => {
    try {
        const boutiqueId = req.params.id;
        const deletedBoutique = await Boutique.findByIdAndDelete(boutiqueId);
        if (!deletedBoutique) {
            return res.status(404).send("Boutique not found");
        }
        res.send(deletedBoutique);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Mettre à jour une boutique par ID
router.put("/up/:id", createBoutiqueValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const boutiqueId = req.params.id;
        const newData = req.body;
        const updatedBoutique = await Boutique.findByIdAndUpdate(boutiqueId, newData, { new: true });
        if (!updatedBoutique) {
            return res.status(404).send("Boutique not found");
        }
        res.send(updatedBoutique);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
