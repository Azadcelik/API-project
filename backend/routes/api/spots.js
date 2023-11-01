const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot,Review,ReviewImage,SpotImage, User } = require('../../db/models')

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


//first get spot id from endpoint params 
//then find spots by spotid typically findbypk and include spotImages and owner 
// but you need to alias user as a owner 
//add your avgRating but with number of reviews this time.You probably need to just 
//the total of reviews by length of the review table.you need to add spotImages table
// and it is all columns as well. double check upperCase and s at the end 
//you need to add user as well But need to change user table to the owner and include
//just first and last name 


router.get('/:spotId', async (req,res) => { 
   const {spotId }= req.params
 
   const spots = await Spot.findByPk(spotId, { 
      include : [
         {
            model : SpotImage,
            attributes : { 
               exclude : [ "createdAt","updatedAt", 'spotId']
            }
         },
         {
            model : User,
            as : 'Owner',
            attributes : ['id', 'firstName', 'lastName']
         },
         {
            model : Review
         }
      ]
   })
   if (!spots) { 
    return  res.status(404).json({message: "Spot couldn't be found"})
   }
   
   const totalStars = spots.Reviews.reduce((acc,review) => acc + review.stars,0)
   const avgRating = totalStars / spots.Reviews.length
   
   const spotData = spots.toJSON()

   spotData.avgRating = avgRating
   spotData.numReviews = spots.Reviews.length

   delete spotData.Reviews

   res.json(spotData)
})



//require authentication before you create your data
//query from body and retreieve data you need 
//use create method with key and  value pairs 
// if any of required details missed return error with the message and errors objects 
// specify each error but ask where to specify to instructor later 



router.post('/', async (req,res) => { 
    const {address,city,state,country,lat,lng,name,description,price} = req.body;

    const spots = await Spot.create({ 
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
    if (!spots) { 
      res.status(400).json({message: "Bad Request"})
    }
    res.status(201).json({spots})

})




router.post('/:spotId/images', async (req,res) => { 
   const {url,preview} = req.body
   const {spotId} = req.params
  
   const spots = await Spot.findByPk(spotId)

   if (!spots) {
     return res.status(404).json({message : "Spot couldn't be found"})
   }
   
   const image = await SpotImage.create({ 
      spotId,
      url,
      preview
   })
  
   res.json(
    {
      id: image.id,
      url : image.url,
      preview : image.preview
    })
      
})




module.exports = router;