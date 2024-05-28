const mongoose = require('mongoose');
const { ROLES } = require('../config/role');
const Achat = mongoose.model('Achat', {
   
    email:{type:String,unique: true, required: true},
    idprod:{type:Number},
    contrat: { type: String },
    pj: { type: Number },
    prot: { type: Boolean, default: false },
    terme: { type: String },
    dated: { type: Date },
    datef: { type: Date },
    total:{type:Number},
});

module.exports = Achat;
