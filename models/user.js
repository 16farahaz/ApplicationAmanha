    const mongoose = require('mongoose');
    const User=mongoose.model('User',
    {
        
    cin:{type:Number},
    name:{type:String},
    lastname:{type:String},
    age:{type:Number},
    addresse:{type:String},
    telephone:{type:Number},
    mail:{type:String},
    motpasse:{type:String},
    image:{type:String}
});

    
    module.exports=User;