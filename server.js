const express =require ('express');
const app =express();
const userRoute=require('./routes/user');
const assuranceRoute=require('./routes/assurance');
const boutiqueRoute=require('./routes/boutique');
const electroRoute=require('./routes/electro');
const ordinateurRoute=require('./routes/ordinateur');
const smartphoneRoute=require('./routes/smartphone');



require('./config/connect');


app.use(express.json());
app.use('/user',userRoute);
app.use('/assurance',assuranceRoute);
app.use('/boutique',boutiqueRoute);
app.use('/electro',electroRoute);
app.use('/ordinateur',ordinateurRoute);
app.use('/smartphone',smartphoneRoute);







app.listen(3000,()=>{console.log('server working');});



