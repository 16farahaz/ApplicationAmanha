const mongoose = require('mongoose');
    const Assurance=mongoose.model('Assurance',{
        name:{type:String},
        Adresse:{type:String},
        telephone:{type:Number},
        description:{type:String}});
    module.exports=Assurance;