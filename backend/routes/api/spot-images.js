const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




router.delete('/:imageId', requireAuth, async(req,res) => { 
    const imageId = req.params.imageId
    const userId = req.user.id

    const spotsImages = await SpotImage.findByPk(imageId)

    if (!spotsImages) {
        return res.status(404).json({ message: "Spot Image couldn't be found" });
      }
  
    const spots = await Spot.findByPk(spotsImages.spotId)
    if (!spots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
    if (spots.ownerId !== userId) { 
        res.status(403).json({message : 'Spot must belong to the current user'})
    }

    await spotsImages.destroy() 

    res.json({ message: "Successfully deleted" });
})







module.exports = router;