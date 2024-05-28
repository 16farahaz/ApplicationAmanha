const mongoose = require('mongoose');
    const Ordinateur=mongoose.model('Ordinateur',{
        numserie:{type:String,unique: true, required: true},
        mark:{type:String},
        prix:{type:Number},
        couleur:{type:String},
        type:{type:String},
        image:{type:String}
    });
    module.exports=Ordinateur;