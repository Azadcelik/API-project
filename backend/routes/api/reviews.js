const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {Review,User,Spot,ReviewImage,SpotImage} = require('../../db/models')

const router = express.Router()
const {check} = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');

//


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