    const mongoose = require('mongoose');
    const role = require('../config/role');
    const User=mongoose.model('User',
    {
        
    cin:{type:Number,unique: true, required: true},
    name:{type:String},
    lastname:{type:String},
    age:{type:Number},
    addresse:{type:String},
    telephone:{type:Number,unique: true, required: true},
    email:{type:String,unique: true, required: true},
    motpasse:{type:String},
    image:{type:String},
    role: { type: String , enum: [role.ROLES.ADMIN, role.ROLES.USER, role.ROLES.SIMPLE_USER]}  

});

    
    module.exports=User;