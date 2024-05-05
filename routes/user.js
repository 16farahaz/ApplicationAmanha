const express = require("express");
const router = express.Router();
const User = require("../models/user");
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

// Vvalidation mt3 user <3


const createUserValidation = [
    body("cin").isInt().withMessage("Le CIN doit être une valeur numérique").isLength({ min: 8, max: 8 }).withMessage("Le CIN doit contenir exactement 8 chiffres"),
    body("name").matches(/^[a-zA-Z]+$/).withMessage("Le prénom ne doit contenir que des lettres").trim(),
    body("lastname").matches(/^[a-zA-Z]+$/).withMessage("Le nom de famille ne doit contenir que des lettres").trim(),
    body("age").isLength({ min: 2, max: 2 }).withMessage("L'âge doit contenir exactement 2 chiffres"),
    body("addresse").notEmpty().withMessage("L'adresse est obligatoire"),
    body("telephone").isNumeric().withMessage("Le téléphone doit être une valeur numérique").isLength({ min: 8, max: 8 }).withMessage("Le téléphone doit contenir exactement 8 chiffres"),
    body("mail").isEmail().withMessage("Format d'email invalide"),
    body("motpasse").notEmpty().withMessage("Le mot de passe est obligatoire")
];

module.exports = createUserValidation;


// Create a new user
router.post("/create",  upload.any('image'), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userData = req.body;
        const newUser = new User(userData);
        newUser.image=filename;
        const savedUser = await newUser.save();
        filename='';
        res.status(201).send(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get a user by ID
router.get("/getbi/:id", async (req, res) => {
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
router.delete("/del/:id", async (req, res) => {
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
router.put("/up/:id", createUserValidation, async (req, res) => {
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

module.exports = router;

