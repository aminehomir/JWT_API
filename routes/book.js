const express = require('express')
let Book = require('../models/book.model');
const router = express.Router();
const jwt=require('jsonwebtoken');




router.get('/', verifyToken,(req,res) =>{


  jwt.verify(req.token, 'hrKey', (err, authData) => {

    if(err) {
      res.sendStatus(403);
    } else {

      Book.find()
      .then((Book) => res.json(Book))
      .catch((err) => res.status(400).json("Error :" + err));
      
    }

  })





  


});




router.route("/add").post((req, res) => {
  
  
  
  const name = req.body.name;
  const author = req.body.author;
  const price = req.body.price;
 



   
    if(!name || !author || !price) {
      return res.status(400).send({
          message: "filde content can not be empty"
      });
  }

   
  
    const BookPush = new Book({
      
      name,
      author,
      price
     
    });
  
    BookPush
      .save()
      .then((data) => {
        res.send(data);
        res.json("Book successfully added")
        
      }).catch((err) =>  res.status(400).json("Error :" + err));
     
  });



router.route("/update/:id").put((req, res) => {


  const name = req.body.name;

  const auther = req.body.auther;
  
  const price = req.body.price;


  // Validate Request
  if(!name || !auther || !price) {
    return res.status(400).send({
        message: "filde content can not be empty"
    });
}

    // Find  and update it with the request body

    Book.findByIdAndUpdate(req.params.id,{
      name: req.body.name,
      auther: req.body.auther,
      price: req.body.price,

    },{new: true})

    .then(Book => {
      if(!Book) {

        return res.status(404).send({
          message: "Book not found with id " + req.params._id
      });

      }
      res.send(Book);
    }).catch(err => {

      if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Book not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating Book with id " + req.params.id
    });

    })


})



router.route("/delete/:id").delete((req, res) => {

Book.findByIdAndRemove(req.params.id)
.then(Book=> {
  if (!Book) {

    return res.status(404).send({
      message : "Book not found with id " + req.params.id
    });
    
  }
  res.send({
    message : "Book deleted successfully !" });
}).catch(err =>{
  if (err.kind === 'ObjectId' || err.name === 'NotFound') {

    return res.status(404).send({
      message : 'Book not found with id ' + req.params.id
    });
    
  }
  return res.status(404).send({
    message : 'Could not delete note with id ' + req.params.id
  });
})
    



  
 
})



// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    
    res.json({
      message : 'you are note allowed to ....'
    })
  }

}

  


module.exports = router;