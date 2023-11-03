const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')
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
Edit a Booking
Update and return an existing booking.

Require Authentication: true

Require proper authorization: Booking must belong to the current user

Request

Method: PUT
URL: /api/bookings/:bookingId */


// first find req user id 
//then use find one to find existing booking with booking id 
//match if id of the user in the booking then return error if not 


router.put('/:bookingId', requireAuth, async (req,res) => { 
    const userId=  req.user.id
    const bookingId = parseInt(req.params.bookingId)
    let {startDate,endDate} = req.body
    
    const bookings = await Booking.findByPk(bookingId)
    
    if (!bookings) { 
       return res.status(404).json({
            message: "Booking couldn't be found"
          })
    }
    if (bookings.userId !== userId) {
        return res.status(403).json({ message: 'Booking must belong to the current user' });
      }
  
 

const date = new Date();
if (new Date(bookings.endDate) < date) {
return  res.status(403).json({
      message: "Past bookings can't be modified"
  });
  
}

startDate = new Date(startDate)
endDate = new Date(endDate)


const conflict = await Booking.findOne({
  where: {
    spotId: bookings.spotId,
    id: { [Op.ne]: bookingId }, // Exclude the current booking
    [Op.or]: [
      {
        startDate: {
          [Op.lte]: endDate,
          [Op.gt]: startDate,
        }
      },
      {
        endDate: {
          [Op.lt]: endDate,
          [Op.gte]: startDate,
        }
      }
    ]
  }
});

if (conflict) {
  return res.status(403).json({
    message: "Sorry, this spot is already booked for the specified dates",
    errors: {
      startDate: "Start date conflicts with an existing booking",
      endDate: "End date conflicts with an existing booking"
    }
  });
}

// If no conflicts, update the booking
const updatedBooking = await bookings.update({
  startDate: startDate,
  endDate: endDate
});

// Return the updated booking details
res.status(200).json(updatedBooking);
});

/*
Delete a Booking
Delete an existing booking.

Require Authentication: true

Require proper authorization: Booking must belong to the current user or the Spot must belong to the current user

Request

Method: DELETE
URL: /api/bookings/:bookingId
Body: none*/

router.delete('/:bookingId',requireAuth, async (req,res) => { 
    const userId = req.user.id
    const bookingId = parseInt(req.params.bookingId)

  // Find the booking with the spot included
  const booking = await Booking.findByPk(bookingId, { include: [Spot] });

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    });
  }



  // Now booking.Spot refers to the associated spot, without an alias
  if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
    return res.status(403).json({
      message: "You do not have permission to delete this booking"
    });
  }


  const today = new Date();
  if (new Date(booking.startDate) <= today) {
      return res.status(403).json({
          message: "Bookings that have been started can't be deleted"
      });
  }

     // If all checks pass, delete the booking
     await booking.destroy();

     res.status(200).json({
         message: "Successfully deleted"
     });
 });






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




 //  convert to date string first  
// const parsedStartDate = new Date(startDate).toDateString();
// const parsedEndDate = new Date(endDate).toDateString();

// // convert today you will change 
// const today = new Date().toDateString();

// // get tht 
// const timeOfParsedStartDate = new Date(parsedStartDate).getTime();
// const timeOfParsedEndDate = new Date(parsedEndDate).getTime();
// const timeOfToday = new Date(today).getTime();

// // Get the time value of the booking's end date
// const timeOfBookingsEndDate = new Date(bookings.endDate).toDateString();
// const timeOfBookingsEndDateAtMidnight = new Date(timeOfBookingsEndDate).getTime();
// console.log(timeOfBookingsEndDateAtMidnight,timeOfToday)





module.exports = router