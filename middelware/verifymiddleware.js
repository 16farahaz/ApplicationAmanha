

const User = require('../models/user');

const checkEmailExists = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user !== null;
    } catch (error) {
        throw new Error('Erreur lors de la vérification de l\'email');
    }
};

module.exports = {
    checkEmailExists
};
