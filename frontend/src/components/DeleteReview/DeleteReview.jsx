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

    <div className="modal">
        <div className="modal-header">Confirm Delete</div>
        <div className="modal-body">Are you sure you want to delete this review?</div>
        <button className="modal-button delete" onClick={handleReviewButton}>Yes (Delete Spot)</button>
        <button className="modal-button cancel" onClick={keepReviewButton}>No (Keep Spot)</button>
    </div>
 
    )
}



export default DeleteReview; 