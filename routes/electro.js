const express = require("express");
const router = express.Router();
const Electro = require("../models/electro");
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

// Validation pour la création d'un Electro
const createElectroValidation = [
    body("numserie").notEmpty().isNumeric().withMessage("Le numéro de série est requis"),
    body("mark").notEmpty().withMessage("La marque est requise").isString().withMessage("eleminer les caractere speciaux et laisse les caractéres alphabetiques "),
    body("prix").isNumeric().withMessage("Le prix doit être numérique"),
    body("couleur").notEmpty().withMessage("La couleur est requise").isString().withMessage("juste des lettre alphabetique s'il vous plais "),
    body("puissance").isNumeric().withMessage("La puissance doit être numérique"),
    body("poids").isNumeric().withMessage("Le poids doit être numérique"),
  
];
module.exports=createElectroValidation;
// Créer un nouvel Electro
router.post("/create", verifyJWT,InRole(role.ROLES.ADMIN),upload.any('image'), createElectroValidation,async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const electroData = req.body;
        const newElectro = new Electro(electroData);
        newElectro.image=filename;
        const savedElectro = await newElectro.save();
        filename='';
        res.status(201).send(savedElectro);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir tous les Electros
router.get("/all", async (req, res) => {
    try {
        const electros = await Electro.find();
        res.send(electros);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Obtenir un Electro par son ID
router.get("/getbyid/:id", async (req, res) => {
    try {
        const electroId = req.params.id;
        const electro = await Electro.findById(electroId);
        if (!electro) {
            return res.status(404).send("Electro not found");
        }
        res.status(200).send(electro);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Supprimer un Electro par son ID
router.delete("/del/:id",verifyJWT,InRole(role.ROLES.ADMIN), async (req, res) => {
    try {
        const electroId = req.params.id;
        const deletedElectro = await Electro.findByIdAndDelete(electroId);
        if (!deletedElectro) {
            return res.status(404).send("Electro not found");
        }
        res.send(deletedElectro);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.put("/up/:id",verifyJWT,InRole(role.ROLES.ADMIN), createElectroValidation,async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const electroId = req.params.id;
        const newData = req.body;
        const updatedElectro = await Electro.findByIdAndUpdate(electroId, newData, { new: true });
        
        if (!updatedElectro) {
            return res.status(404).send("Electro not found");
        }
        
        res.send(updatedElectro);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
