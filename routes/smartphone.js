const express = require("express");
const router = express.Router();
const Smartphone = require("../models/smartphone");
const multer = require("multer");
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

// Validation des données pour la création d'un smartphone
const createSmartphoneValidation = [
    body("numserie").notEmpty().withMessage("Le numéro de série est obligatoire").isNumeric().withMessage("Le prix doit être une valeur numérique"),
    body("mark").notEmpty().withMessage("La marque est obligatoire"),
    body("prix").isNumeric().withMessage("Le prix doit être une valeur numérique").notEmpty().withMessage("Le numéro de série est obligatoire"),
    body("couleur").notEmpty().withMessage("La couleur est obligatoire"),
    body("modele").notEmpty().withMessage("Le modèle est obligatoire")
];
module.exports =createSmartphoneValidation;

// Créer un nouveau smartphone
router.post("/create",  upload.any('image'), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const smartphoneData = req.body;
        const newSmartphone = new Smartphone(smartphoneData);
        newSmartphone.image=filename;
        const savedSmartphone = await newSmartphone.save();
        filename='';
        res.status(201).send(savedSmartphone);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir tous les smartphones
router.get("/all", async (req, res) => {
    try {
        const smartphones = await Smartphone.find();
        res.send(smartphones);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir un smartphone par ID
router.get("/get/:id", async (req, res) => {
    try {
        const smartphoneId = req.params.id;
        const smartphone = await Smartphone.findById(smartphoneId);
        if (!smartphone) {
            return res.status(404).send("Smartphone not found");
        }
        res.status(200).send(smartphone);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Supprimer un smartphone par ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const smartphoneId = req.params.id;
        const deletedSmartphone = await Smartphone.findByIdAndDelete(smartphoneId);
        if (!deletedSmartphone) {
            return res.status(404).send("Smartphone not found");
        }
        res.send(deletedSmartphone);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Mettre à jour un smartphone par ID
router.put("/update/:id", createSmartphoneValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const smartphoneId = req.params.id;
        const newData = req.body;
        const updatedSmartphone = await Smartphone.findByIdAndUpdate(smartphoneId, newData, { new: true });
        if (!updatedSmartphone) {
            return res.status(404).send("Smartphone not found");
        }
        res.send(updatedSmartphone);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
