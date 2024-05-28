const express = require('express');
const path = require('path'); // Import module mt3 l path
const app = express();
const userRoute = require('./routes/user');
const assuranceRoute = require('./routes/assurance');
const boutiqueRoute = require('./routes/boutique');
const electroRoute = require('./routes/electro');
const ordinateurRoute = require('./routes/ordinateur');
const smartphoneRoute = require('./routes/smartphone');
const achatRoute = require('./routes/achat');

require('./config/connect');

app.use(express.json());
app.use('/user', userRoute);
app.use('/assurance', assuranceRoute);
app.use('/boutique', boutiqueRoute);
app.use('/electro', electroRoute);
app.use('/ordinateur', ordinateurRoute);
app.use('/smartphone', smartphoneRoute);
app.use('/achat', achatRoute);





//bch nsta3ml path.join bch n7ather path ltswaer mt3
//localhost:3000/getimage/image.jpg
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/getimage', express.static(uploadsPath));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
