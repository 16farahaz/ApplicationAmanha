const mongoose = require('mongoose');
    const Boutique=mongoose.model('Boutique',{
        name:{type:String},
        Adresse:{type:String},
        telephone:{type:Number}});
    module.exports=Boutique;