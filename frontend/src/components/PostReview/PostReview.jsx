
import { thunkCreateReview, thunkFetchReviewsForSpot } from '../../store/postReview';
import './PostReview.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

const PostReview = ({spotsId,onReviewPosted}) => { 
const [text,setText] = useState("")
const [error,setError] = useState(null)

const dispatch = useDispatch()

const isButtonDisabled = text.length < 10

//hoverRating keeps track of which star the user is currently hovering over.
// setHoverRating is the function to update hoverRating.
// currentRating keeps track of the selected rating (the number of stars clicked).
// setCurrentRating is the function to update currentRating.    
const [hoverRating, setHoverRating] = useState(0);
const [currentRating, setCurrentRating] = useState(0);


const {closeModal} = useModal()


// handleMouseOver: This function is called when the mouse pointer is over a star.
//  It sets the hoverRating to the value of the star being hovered over.
const handleMouseOver = (ratingValue) => {
    setHoverRating(ratingValue);
};


// handleMouseLeave: This function is called when the mouse pointer leaves a star. 
// It resets the hoverRating to 0, which means no stars are highlighted from hovering.
const handleMouseLeave = () => {
    setHoverRating(0);
};

// handleClick: This function is called when a star is clicked. It sets the currentRating to the value of the star that was clicked,
//  and it calls setRating (passed in as a prop) to update the parent component with the new rating.
const handleClick = (ratingValue) => {
    setCurrentRating(ratingValue);
    // setRating(ratingValue);
};
function Star({ filled, onMouseOver, onMouseLeave, onClick }) {
    return (
      <span
        className={`star ${filled ? 'filled' : ''}`}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {filled ? '★' : '☆'}
      </span>
    );
  }


  const submitYourReview = async () => { 
    const reviewForm = { 
      review: text,
      stars: currentRating
    }
   
   const reviewData = await dispatch(thunkCreateReview(spotsId,reviewForm))
   if (reviewData.errors) { 
      setError("Please try again");
   }
   if (reviewData.message) { 
    setError(reviewData.message)
   }

   onReviewPosted();
   closeModal()
   
   //todo: this is definitely working for everwhere i tried.After you deleted or updated or created dispatch your thunk for that data then you do not see page refresehed.
   dispatch(thunkFetchReviewsForSpot(spotsId))
  }


  return (
    <div>
       {error && <p>{error}</p>}
      <h1>How was your Stay</h1>
      {error && <p>{error}</p>}
      <textarea cols="30" rows="10" placeholder="Leave your review here..." value={text} onChange={e => setText(e.target.value)}></textarea>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            filled={star <= (hoverRating || currentRating)}
            onMouseOver={() => handleMouseOver(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
      <button disabled={isButtonDisabled} onClick={submitYourReview}>Submit Your Review</button>
    </div>
  );
}



export default PostReview