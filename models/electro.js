const mongoose = require('mongoose');
    const Elctro=mongoose.model('Elctro',{
        numserie:{type:Number},
        mark:{type:String},
        prix:{type:Number},
        couleur:{type:String},
        puissance:{type:Number},
        poids:{type:Number}
    });
    module.exports=Elctro;