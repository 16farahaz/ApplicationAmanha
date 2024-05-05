const mongoose = require('mongoose');
    const Smartphone=mongoose.model('Smartphone',{
        numserie:{type:Number},
        mark:{type:String},
        prix:{type:Number},
        couleur:{type:String},
        modele:{type:String},
        image:{type:String}
    });
    module.exports=Smartphone;