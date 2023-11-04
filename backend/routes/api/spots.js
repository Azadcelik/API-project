const express = require('express');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot,Review,ReviewImage,SpotImage, User, Booking } = require('../../db/models')

const router = express.Router();

const { check,query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateReview = [
   check('review')
     .exists({ checkFalsy: true })
     .withMessage('Review text is required'),
   check('stars')
     .exists({ checkFalsy: true })
     .isInt({ min: 1, max: 5 })
     .withMessage('Stars must be an integer from 1 to 5'),
   handleValidationErrors
 ];

const validateSpot = [
   check('address')
   .exists({checkFalsy : true})
   .withMessage( "Street address is required"),
   check('city')
   .exists({checkFalsy:true})
   .withMessage("City is required"),
   check('state')
   .exists({checkFalsy: true})
   .withMessage("State is required"),
   check('country')
   .exists({checkFalsy: true})
   .withMessage("Country is required"),
   check('lat')
   .exists({checkFalsy: true})
   .isFloat({ min: -90, max: 90 })
   .withMessage("Latitude is not valid"),
   check('lng')
   .exists({checkFalsy: true})
   .isFloat({ min: -180, max: 180 })
   .withMessage("Longitude is not valid"),
   check('name')
   .exists({ checkFalsy: true }).withMessage("Name is required")  // Checks that the name exists and is not falsy (e.g., not an empty string, not null, etc.)
   .isLength({ min: 1 }).withMessage("Name must be at least 1 character") // Checks that the name is at least 1 character long
   .isLength({ max: 50 }).withMessage("Name must be less than 50 characters"), // Checks that the name is no more than 50 characters long
   check('description')
   .exists({checkFalsy: true})
   .withMessage("Description is required"),
   check('price')
   .exists({checkFalsy: true})
   .isFloat({min : 0})
   .withMessage("Price per day is required"),
   handleValidationErrors
   
]

const validateQueryFilters = [ 
   query('page')
   .optional().isInt({min: 1})
   .withMessage("Page must be greater than or equal to 1"),
   query('size')
   .optional().isInt({min: 1})
   .withMessage("Size must be greater than or equal to 1"),
   query('maxLat')
   .optional().isFloat({ min: -90, max: 90 })
   .withMessage("Maximum latitude is invalid"),
   query('minLat')
   .optional().isFloat({ min: -90, max: 90 })
   .withMessage("Minimum latitude is invalid"),
   query('minLng')
   .optional().isFloat({ min: -180, max: 180 })
   .withMessage("Maximum longitude is invalid"),
   query('maxLng')
   .optional().isFloat({ min: -180, max: 180 })
   .withMessage("Minimum longitude is invalid"),
   query('minPrice')
   .optional().isFloat({min : 0})
   .withMessage("Minimum price must be greater than or equal to 0"),
   query('maxPrice')
   .optional().isFloat({min : 0})
   .withMessage("Maximum price must be greater than or equal to 0"),
   handleValidationErrors
]



// in your body just add review and stars when you send a request
//succesful response should include id userId and spotId as well
//so retrive id and spotid form endRoute 
//response status code should be 201 
//if there is validation error let it hit the validation errors
// if no spot found just res.json message that spot could not found
// if userId has already existed for the given spot then say user already exist for that id

router.post('/:spotId/reviews',requireAuth ,validateReview, async (req,res) => {  
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
  
    res.status(201).json(newReview)
})



//Get all Reviews by a Spot's id
router.get('/:spotId/reviews' , async (req,res) =>{ 
   
   const spotId  = parseInt(req.params.spotId)

   const spot = await Spot.findByPk(spotId);

   if (!spot) {
      return res.status(404).json({ 
          message: "Spot couldn't be found"
      });
   }
     

   const Reviews = await Review.findAll({ 
       where : { 
           spotId : spotId
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
 console.log(Reviews)
  
  // If no reviews are found, this should not be an error, simply return an empty array.

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
   let {startDate,endDate} = req.body
  
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
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    console.log(startDate,endDate)
   const existingBookings = await Booking.findOne({
      where : { 
         spotId : spotId,

    [Op.and]: [ // Both conditions in this array should be true
      {
        startDate: {
          [Op.lt]: endDate, // Existing bookings that start before the new booking ends
        },
      },
      {
        endDate: {
          [Op.gt]: startDate, // Existing bookings that end after the new booking starts
        },
      },
    ],
      [Op.and]: [
         {
           startDate: {
             [Op.lte]: endDate
           }
         },
         {
           endDate: {
             [Op.gte]: startDate
           }
         }
       ]
   },
   })
   
 if (existingBookings) { 
     return  res.status(403).json({
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
    res.json(createdBooking)



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
router.get('/', validateQueryFilters, async (req,res) => { 
   console.log('validations error', req.query);
let  {page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} =  req.query
// console.log(minLat)
   page = parseInt(page),
   size = parseInt(size)
 
   if (page < 1 || isNaN(page) || !page) page = 1
   if (page > 10) page = 10

   if (size < 1 || isNaN(size) || !size) size = 20
   if (size > 20) size = 20

    
   const whereObj = {}
  
   if (minLat) whereObj.lat = {[Op.gte] : parseFloat(minLat)}
   if (maxLat) whereObj.lat = {...whereObj.lat,[Op.lte] : parseFloat(maxLat)}
   if (minLng) whereObj.lng = {[Op.gte] : parseFloat(minLng)}
   if (maxLng) whereObj.lng = {...whereObj.lng, [Op.lte] : parseFloat(maxLng)}
   if (minPrice) whereObj.price = {[Op.gte] : parseFloat(minPrice)}
   if (maxPrice) whereObj.price = {...whereObj.price, [Op.lte] : parseFloat(maxPrice)}
   
//   console.log(whereObj)

 let spots = await Spot.findAll({ 
    where : whereObj,
    include : [
       {
         model : Review,
       },

       { 
            model: SpotImage,
            where : { 
               preview : true
            },
            limit : 1,
            required: false
       }
         ],

      limit : size,
      offset : (page - 1) * size
    
 })
  
 spots = spots.map(spot => { 
    const spotObj = spot.toJSON() // you need ot jsonize because of sending back need to be in json format not js object
    

     //think of combining avg and previewimage later to refactor your code
    if (spotObj.Reviews && spotObj.Reviews.length > 0) { 
      const total = spotObj.Reviews.reduce((acc,review) => acc + review.stars, 0)
      spotObj.avgRating = total / spotObj.Reviews.length
    }

    /*
    //think of combining avg and previewimage later to refactor your code
   //  if (spotObj.Reviews[0].ReviewImages && spotObj.Reviews[0].ReviewImages.length > 0) { 
      //  spotObj.previewImage = spotObj.Reviews[0].ReviewImages[0].url
   //  } 
   */

   
   spotObj.previewImage = spotObj.SpotImages.length > 0 ? spotObj.SpotImages[0].url : null;
   
   // if (spotObj.SpotImages.length > 0) { 
   //    spotObj.previewImage = spotObj.SpotImages[0].url
   //  }
  
    
    delete spotObj.Reviews
    delete spotObj.SpotImages
   //  delete spotObj.Reviews.ReviewImages
 
    return spotObj
    
 })
 
   
 res.json({ 
    Spots : spots,
    page : page,
    size : size
   
 })

})


//Get all Spots owned by the Current User

router.get('/current' ,requireAuth,  async (req,res) => { 
   const currentId = req.user.id
   
   let spots = await Spot.findAll({ 
      where: { 
         ownerId: currentId
      },
      include : [
       { 
         model : Review,
         
       },
       {
         model : SpotImage,
         where : { 
            preview : true
         },
         limit : 1,
         required: false
       }
   ]
   })

   
   spots = spots.map(spot => { 
      const spotObj = spot.toJSON() // you need ot jsonize because of sending back need to be in json format not js object
  
       console.log(spotObj)
       //think of combining avg and previewimage later to refactor your code
      if (spotObj.Reviews && spotObj.Reviews.length > 0) { 
        const total = spotObj.Reviews.reduce((acc,review) => acc + review.stars, 0)
        spotObj.avgRating = total / spotObj.Reviews.length
      }
      //think of combining avg and previewimage later to refactor your code
       // Set preview image if images are available, otherwise set to null
       spotObj.previewImage = spotObj.SpotImages && spotObj.SpotImages.length > 0 
       ? spotObj.SpotImages[0].url 
      : null;
      //use delete method to delete unwanted Model in your response
      delete spotObj.Reviews
      delete spotObj.SpotImages
  
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

router.post('/', requireAuth , validateSpot,   async (req,res) => { 
    let {address,city,state,country,lat,lng,name,description,price} = req.body;
   
    lat = parseFloat(lat)
    lng = parseFloat(lng)
    price = parseInt(price)

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
   
    res.status(201).json(spots)
   
})


/*
Add an Image to a Spot based on the Spot's id
Create and return a new image for a spot specified by id.

Require Authentication: true

Require proper authorization: Spot must belong to the current user

*/

router.post('/:spotId/images', requireAuth,  async (req,res) => { 
   const {url,preview} = req.body
   const userId = req.user.id
   const spotId = req.params.spotId
  
   const spots = await Spot.findByPk(spotId)

   if (!spots) {
     return res.status(404).json({message : "Spot couldn't be found"})
   }
   if (spots.ownerId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to add images to this spot."
      });
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

router.put('/:spotId', requireAuth, validateSpot, async (req,res) => { 
   const {spotId} = req.params
   const userId = req.user.id
   let {address,city,state,country,lat,lng,name,description,price} = req.body
   lat = parseInt(lat)
   lng = parseInt(lng)
   price = parseInt(price)

   const spot = await Spot.findByPk(spotId)

  if (!spot) {
   return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
    //ask if you need this because you are alredt authenticating
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "No permission to update this spot"
      });
    }




  await spot.update({

   address,city,state,country,lat,lng,name,description,price
 })
  res.json(spot)
})


  
 //Delete a Spot

router.delete('/:spotId', requireAuth, async (req,res) => { 
   const spotId = parseInt(req.params.spotId)
   const userId = req.user.id
   const spot = await Spot.findByPk(spotId)

   if (!spot) { 
      return res.status(404).json({
         message : "Spot couldn't be found"
       })
   }
   if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this spot."
      });
    }

   await spot.destroy()
   res.json({
      message: "Succesfully deleted"
   })
})


module.exports = router;