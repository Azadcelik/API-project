const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {Review,User,Spot,ReviewImage,SpotImage} = require('../../db/models')

const router = express.Router()
const {check} = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');




//get reviewId because you are gonna associate images to reviewId even you are not gonna return reviewId
// do not forget parseInt id because it is always string
//if review does not exist then just return error.Do not forget error again because 
// your code will be keep working
// find the number of reviewImage by count aggregate function which is associated to the reviewId!!!!!
//if it is greater than 10 return another error.Do not forget return!!!!!!
//you are just gonna add image url and id  in your body 
//use findByPk if not found say return error review not found

//Add an Image to a Review based on the Review's id

router.post('/:reviewId/images',requireAuth, async (req,res) => { 
    const {url} = req.body
    const reviewId = parseInt(req.params.reviewId)
    const userId = req.user.id
//We need to check if review exist and also we need to check if it belongs to the current user
//read carefully what it asks for at the beginning it says must belong to the curret user


    const review = await Review.findOne({ 
        where : { 
            id : reviewId,
            userId: userId
        }
    })

    if (!review) { 
       return res.status(404).json({ 
            message: "Review couldn't be found"
        })
    }

  const reviewImageCount = await ReviewImage.count({
    where : { 
        reviewId : review.id
    }
  })

  if (reviewImageCount >= 10) { 
   return res.status(404).json({
    message: "Maximum number of images for this resource was reached"
   })
  }



 const reviewImages = await ReviewImage.create({
    reviewId,
    url: url
 })
   res.json({
     id : reviewImages.id,
     url : reviewImages.url
   })

})



//Get all Reviews of the Current User

router.get('/current', async (req,res) => { 
    const userId = req.user.id
  
    const reviews = await Review.findAll({ 
        where : { 
            userId : userId,
        
        },
        include : [
        {
            model : User,
            attributes :['id','firstName','lastName']
        },
        { 
            model : Spot,
            attributes : {
                exclude : ['description']
            },
            
            include : { 
               model : SpotImage,
               where : {
                preview: true
               }
            }
        },
        {
            model : ReviewImage,
            attributes : ['id','url']
        }
        
        ]
    })
    
  
   const Reviews =  reviews.map(review => { 
        const reviewJsonObj = review.toJSON()
    //    console.log(reviewJsonObj.Spot.SpotImages.length) //spotImage is an array
    // debugged why image SpotImage returned undefined 
    //   do not forget plural s. Sequelize autotically adding s if more than one data is inside.
        if (reviewJsonObj.Spot.SpotImages && reviewJsonObj.Spot.SpotImages.length > 0) { 
                
            // spotImages is an array you need to iterate to access its url
            for (let image of reviewJsonObj.Spot.SpotImages) { 
                console.log(image)
                reviewJsonObj.Spot.previewImage = image.url
            }
            
        }
    
        delete reviewJsonObj.Spot.SpotImages

        return reviewJsonObj
    })
      
   res.json({Reviews})
})








module.exports = router;