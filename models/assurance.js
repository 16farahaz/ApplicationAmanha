const mongoose = require('mongoose');
    const Assurance=mongoose.model('Assurance',{
        name:{type:String,unique: true, required: true},
        Adresse:{type:String},
        telephone:{type:Number},
        description:{type:String}});
    module.exports=Assurance;