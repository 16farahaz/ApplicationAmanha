const mongoose =require('mongoose')


mongoose.connect('mongodb://localhost:27017/PFAbnedrafarah')
    .then(
           ()=>{console.log('Connexion à la base de données MySQL réussie');}
     )
    .catch (
      (err) => {
        
          console.error('Erreur de connexion :', err);
          
        }


     )



module.exports=mongoose;