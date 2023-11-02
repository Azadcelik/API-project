const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');


const validateBooking = [
    check('startDate')
    .exists({checkFalsy : true})
    .withMessage("Start date conflicts with an existing booking"),
    check('endDate')
    .exists({checkFalsy : true})
    .withMessage("End date conflicts with an existing booking"),
    handleValidationErrors
]


/*
BOOKINGS
Get all of the Current User's Bookings
Return all the bookings that the current user has made.

Require Authentication: true

*/

//first take userid from req 
//one user can have many bookings so use findAll method
//include spot and then user where user id matches 
//include spotImages and then check it is preview where it is true
//you will get url and add it to the previewImage


router.get('/current', requireAuth, handleValidationErrors, async(req,res) => { 
    const userId = req.user.id

    const bookings = await Booking.findAll({
        where : {
            userId: userId,
            
        },
        attributes :  ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'], // ask why not implicitly returning the id
        include:[
            { 
            model: Spot,
            attributes : {
                exclude : ['createdAt','updatedAt']
            },
            include: { 
                model: SpotImage,
                where : { 
                    preview : true
                },
                
            }
        }
    ]
    })
  const bookingObj = bookings.map(booking => { 
   const  bookingJsonObj = booking.toJSON()
    
 // come back and set logic for the case when preview is set to false
     
  for (let image of bookingJsonObj.Spot.SpotImages) { 
    // console.log(bookingJsonObj.Spot.SpotImages)
    bookingJsonObj.Spot.previewImage = image.url
  }
   
    delete bookingJsonObj.Spot.SpotImages
    return bookingJsonObj
    
  })

  res.json({ 
     bookingObj
  })
  
})







module.exports = router