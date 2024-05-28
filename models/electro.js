const mongoose = require('mongoose');
    const Elctro=mongoose.model('Elctro',{
        numserie:{type:Number,unique: true, required: true},
        mark:{type:String},
        prix:{type:Number},
        couleur:{type:String},
        puissance:{type:Number},
        poids:{type:Number},
        image:{type:String}
    });
    module.exports=Elctro;