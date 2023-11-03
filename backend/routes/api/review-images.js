const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage,Review,ReviewImage } = require('../../db/models');
const {Op} = require('sequelize')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');






/*
Delete a Review Image
Delete an existing image for a Review.

Require Authentication: true

Require proper authorization: Review must belong to the current user

Request

Method: DELETE
URL: /api/review-images/:imageId
*/

router.delete('/:imageId', requireAuth, async (req,res) => { 
   const userId = req.user.id
   const imageId = req.params.imageId

   const reviewsImages = await ReviewImage.findByPk(imageId)

   if (!reviewsImages) { 
     res.status(404).json({
        message: "Review Image couldn't be found"
      })
   }

   const reviews = await Review.findByPk(reviewsImages.reviewId)
   if (reviews.userId !== userId) { 
    return res.status(403).json({ 
        message : "Review must belong to the current user"
    })
   }
  
   await reviewsImages.destroy()
   res.json({message: "Succesfully deleted"})

})













module.exports = router