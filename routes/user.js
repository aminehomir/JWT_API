const express = require('express')
let User = require('../models/user.model');
const router = express.Router();

const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');





router.get('/', (req,res) =>{
  
  User.find()
  .then((User) => res.json(User))
  .catch((err) => res.status(400).json("Error :" + err));

});


// ---------------------login----------


router.route("/register").post((req, res) => {


 

  bcrypt.hash(req.body.password, 10, function(err, hashPassword) {

    if (err) {
      res.json({error : err})
      
    }

    const UserPush = new User({
      
      name : req.body.name,
      phone :  req.body.phone,
      password : hashPassword
     
    });
  
    UserPush
      .save()
      .then((data) => {
        res.send(data);
        res.json("User successfully added")
        
      }).catch((err) =>  res.status(400).json("Error :" + err));
    
});


  
  
     
});

router.route("/login").post((req, res) => {

  let phone = req.body.phone;
  let password = req.body.password;

  User.findOne({phone : phone})
  .then(user => {

    if (user) {

      bcrypt.compare(password, user.password , function(err, result){

        if (err) {
          res.json({
            error : err
          })
  
        }
        if (result) {
          let token = jwt.sign({phone : phone}, 'hrKey' , { expiresIn: '1h' }, (err, token) =>{
            res.json({
              token : token
            })
          })
        }else{
          res.json({
            message : 'phone or password err'
          })
        }

      })

      
    }else{
      res.json({
        message : 'user not found'
      })
    }


  }).catch((err) =>  res.status(400).json("Error :" + err));


  
  
     
  });













router.route("/update/:id").put((req, res) => {


  const name = req.body.name;

  const phone = req.body.phone;
  
  const password = req.body.password;


  // Validate Request
  if(!name || !phone || !password) {
    return res.status(400).send({
        message: "filde content can not be empty"
    });
}

 
    User.findByIdAndUpdate(req.params.id,{
      name: name,
      phone: phone,
      password: password,

    },{new: true})

    .then(User => {
      if(!User) {

        return res.status(404).send({
          message: "User not found with id " + req.params._id
      });

      }
      res.send(User);
    }).catch(err => {

      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "User not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating User with id " + req.params.id
    });

    })


})



router.route("/delete/:id").delete((req, res) => {

User.findByIdAndRemove(req.params.id)
.then(User=> {
  if (!User) {

    return res.status(404).send({
      message : "User not found with id " + req.params.id
    });
    
  }
  res.send({
    message : "User deleted successfully !" });
}).catch(err =>{
  if (err.kind === 'ObjectId' || err.name === 'NotFound') {

    return res.status(404).send({
      message : 'User not found with id ' + req.params.id
    });
    
  }
  return res.status(404).send({
    message : 'Could not delete note with id ' + req.params.id
  });
})
    



  
 
})



  


module.exports = router;