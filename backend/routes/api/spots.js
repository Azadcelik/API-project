const express = require('express');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot,Review,ReviewImage,SpotImage, User, Booking } = require('../../db/models')

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateReview = [
   check('review')
   .exists({checkFalsy: true})
   .withMessage('Review text is required'),
   check('stars')
   .exists({checkFalsy: true})
   .withMessage('Stars must be an integer from 1 to 5'),
   handleValidationErrors,
]






// in your body just add review and stars when you send a request
//succesful response should include id userId and spotId as well
//so retrive id and spotid form endRoute 
//response status code should be 201 
//if there is validation error let it hit the validation errors
// if no spot found just res.json message that spot could not found
// if userId has already existed for the given spot then say user already exist for that id

router.post('/:spotId/reviews',requireAuth,validateReview, async (req,res) => {  
   const {review,stars} = req.body
   const usersId = req.user.id
   const spotsId = parseInt(req.params.spotId)
  
   const spots = await Spot.findByPk(spotsId)
   if (!spots) { 
     return res.status(404).json({
         message : "Spot couldn't be found"
      })
   }
   const reviews = await Review.findOne({ 
       
      where : { 
         userId: usersId,
         spotId : spotsId
      }
   })

   if (reviews) { 
    return  res.status(500).json({ 
         message : "User already has a review for this spot"
      })
   }

   const newReview = await Review.create({ 
      userId : usersId,
      spotId : spotsId,
      review,
      stars
   })
  
    res.json(newReview)
})



//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res) =>{ 
   
   const id  = req.params.spotId

   const Reviews = await Review.findAll({ 
       where : { 
           spotId : id
       },
       include : [{ 
           model : User,
           attributes : ['id','firstName','lastName']
       },
       {
           model : ReviewImage,
           attributes : ['id', 'url']
       }
   ]
   })

  
   if (!Reviews.length < 1) { 
     return res.status(404).json({ 
         message : "Spot couldn't be found"
      })
   }

   res.json({Reviews})


})


/*Create a Booking from a Spot based on the Spot's id
Create and return a new booking from a spot specified by id.

Require Authentication: true

Require proper authorization: Spot must NOT belong to the current user
*/


//first retrieve user from req 
//then retrive spotId with params 
//find spot from spotId by findByPk 
//basically if spot not found just return typical error 
//compare returned spot's ownerId does not match with the userId 
//if it matches then send your res.json error 



router.post('/:spotId/bookings', requireAuth, async (req,res) =>{ 

   const userId = req.user.id
   const spotId = parseInt(req.params.spotId)
   const {startDate,endDate} = req.body

   const spots = await Spot.findByPk(spotId)
   
   if (!spots) { 
   return   res.status(404).json({
         message: "Spot couldn't be found"
       })
   }
   

   if (spots.ownerId === userId) { 
       
       res.status(403).json({
         message: "Spot must not belong to the current user"
       })
   }


   const existingBookings = await Booking.findOne({
      where : { 
         spotId : spotId,

      [Op.or] : [
           {
            startDate : { 
               [Op.between] : [startDate,endDate]
            }
           },
           {
            endDate: { 
               [Op.between] : [startDate,endDate]
            }
           }

      ]
   },
   })

 if (existingBookings) { 
      res.status(403).json({
         message: "Sorry, this spot is already booked for the specified dates",
         errors: {
           startDate: "Start date conflicts with an existing booking",
           endDate: "End date conflicts with an existing booking"
         }
       })
   }




  const  createdBooking =  await Booking.create({ 
      
      spotId: spotId,
      userId: userId,
      startDate: startDate,
      endDate: endDate

   })
    res.json({createdBooking})



})








/*
Get all Bookings for a Spot based on the Spot's id
Return all the bookings for a spot specified by id.

Require Authentication: true

Request

Method: GET
URL: /api/spots/:spotId/bookings
Body: none
Successful Response: If you ARE NOT the owner of the spot.
*/

// first find user id from req
//second use findall method on booking specified but spotId
//i think when you include spot check if there is owner id match with user id
//if it matches then add user info with th bookings as well
//if not matches only include bookings sit spotid and startdata and enddate
//if could not find a spot with specidied id return spot could not find

router.get('/:spotId/bookings',requireAuth, async (req,res) => { 
     const userId = req.user.id
     const spotId = parseInt(req.params.spotId)

     const spots = await Spot.findByPk(spotId)
     if (!spots) { 
   return   res.status(404).json({
         message: "Spot couldn't be found"
      })
     }
   
    let bookings;
     if (spots.ownerId === userId) { 
       bookings = await Booking.findAll({
         where : { 
            spotId : spotId
         },
         attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'], // ask why not implicitly returning the id
         include : { 
            model : User,
            attributes : ['id', 'firstName', 'lastName']
         }
      })
     }
   else {  //ask how to test this with non user who is authenticated
      bookings = await Booking.findAll({
         where : {
            spotId : spotId
         },
         attributes : ['spotId', 'startDate', 'endDate']
      })
   }
   
 

res.json({Bookings : bookings})


})





//Get all Spots
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


//Get all Spots owned by the Current User

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

//Get details of a Spot from an id

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


//Create a Spot

router.post('/', async (req,res) => { 
    const {address,city,state,country,lat,lng,name,description,price} = req.body;

    try { const spots = await Spot.create({ 
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
   
    res.status(201).json({spots})
   } 
   catch(error) { 
       return res.status(400).json({message: "Bad Request"})
   }
})


//Add an Image to a Spot based on the Spot's id

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


//spot must belong to the current user remember you can find user id from req 
//put body in your request so later on you will be changing 
//include owner id with updated method
//you will later use validation error no need to set up now 
//if spot is not found which try to find out byId just return a message spot could not found 

//Edit a Spot

router.put('/:spotId', async (req,res) => { 
   const {spotId} = req.params
   const userId = req.user.id
   const {address,city,state,country,lat,lng,name,description,price} = req.body

   const spot = await Spot.findByPk(spotId)

  if (!spot) {
   return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
    //ask if you need this because you are alredt authenticating
//   if (spot.ownerId !== userId) { 
//    res.status(403).json({message: "No permission to update"})
//   }
 



  await spot.update({

   address,city,state,country,lat,lng,name,description,price
 })
  res.json(spot)
})


  
 //Delete a Spot

router.delete('/:spotId', async (req,res) => { 
   const {spotId} = req.params
   const spot = await Spot.findByPk(spotId)

   if (!spot) { 
      return res.status(404).json({
         message : "Spot couldn't be found"
       })
   }

   await spot.destroy()
   res.json({
      message: "Succesfully deleted"
   })
})


module.exports = router;