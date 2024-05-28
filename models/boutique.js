const mongoose = require('mongoose');
    const Boutique=mongoose.model('Boutique',{
        name:{type:String,unique: true, required: true},
        Adresse:{type:String},
        telephone:{type:Number}});
    module.exports=Boutique;