const mongoose = require('mongoose');
    const Ordinateur=mongoose.model('Ordinateur',{
        numserie:{type:String},
        mark:{type:String},
        prix:{type:Number},
        couleur:{type:String},
        type:{type:String}
    });
    module.exports=Ordinateur;