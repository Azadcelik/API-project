const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot,Review,ReviewImage } = require('../../db/models')

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




router.get('/', async (req,res) => { 

 let spots = await Spot.findAll({ 
    include : [
       {
         model : Review,
         include : [

          { 
            model: ReviewImage
          }
         ]
      }
    ]
 })
  
 spots = spots.map(spot => { 
    const spotObj = spot.toJSON() // you need ot jsonize because of sending back need to be in json format not js object


     //think of combining avg and previewimage later to refactor your code
    if (spotObj.Reviews && spotObj.Reviews.length > 0) { 
      const total = spotObj.Reviews.reduce((acc,review) => acc + review.stars, 0)
      spotObj.avgRating = total / spotObj.Reviews.length
    }
    //think of combining avg and previewimage later to refactor your code
    if (spotObj.Reviews[0].ReviewImages && spotObj.Reviews[0].ReviewImages.length > 0) { 
       spotObj.previewImage = spotObj.Reviews[0].ReviewImages[0].url
    }
    
    //use delete method to delete unwanted Model in your response
    delete spotObj.Reviews
   //  delete spotObj.Reviews.ReviewImages

    return spotObj
    
 })
 
   
 res.json({ 
    Spots : spots
   
 })

})


router.get('/current', async (req,res) => { 
   const currentId = req.user.id
   
   let spots = await Spot.findAll({ 
      where: { 
         ownerId: currentId
      },
      include : { 
         model : Review,
         include : { 
            model : ReviewImage
         }
      }
   })

   
   spots = spots.map(spot => { 
      const spotObj = spot.toJSON() // you need ot jsonize because of sending back need to be in json format not js object
  
  
       //think of combining avg and previewimage later to refactor your code
      if (spotObj.Reviews && spotObj.Reviews.length > 0) { 
        const total = spotObj.Reviews.reduce((acc,review) => acc + review.stars, 0)
        spotObj.avgRating = total / spotObj.Reviews.length
      }
      //think of combining avg and previewimage later to refactor your code
      if (spotObj.Reviews[0].ReviewImages && spotObj.Reviews[0].ReviewImages.length > 0) { 
         spotObj.previewImage = spotObj.Reviews[0].ReviewImages[0].url
      }
      
      //use delete method to delete unwanted Model in your response
      delete spotObj.Reviews
     //  delete spotObj.Reviews.ReviewImages
  
      return spotObj
      
   })
   
  res.json({ 
      Spots : spots
  })

})









module.exports = router;