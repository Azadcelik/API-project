import { thunkDeleteReview, thunkFetchReviewsForSpot } from "../../store/postReview"
import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { getSpotDetails } from "../../store/spots"
    

const DeleteReview = ({reviewId,spotId}) => { 
const dispatch = useDispatch()
const {closeModal} = useModal()   
const [error,setError] = useState(null)

const handleReviewButton = async () => {
    const response = await dispatch(thunkDeleteReview(reviewId));

    if (response.success) {
        closeModal();
        dispatch(thunkFetchReviewsForSpot(spotId)); // Ensure this is the correct spotId
        await dispatch(getSpotDetails(spotId))
    }
    else if (response.error) {
        setError(response.error.message || 'Failed to delete the review.');
    }

};

const keepReviewButton = () => { 
    closeModal()
}
    return (

   <div>
       <h1>Confirm Delete</h1>
       <h2>Are you sure you want to delete this review?</h2>
       <button onClick={handleReviewButton}>Yes (Delete Review) </button>
       <button onClick={keepReviewButton}>No (Keep Review)</button>
    </div>
    )
}



export default DeleteReview; 