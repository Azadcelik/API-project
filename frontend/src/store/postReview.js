

//todo: check if response has an error if it is not then dispatch the result with the action creator 
//todo: update your reducer that you will later have your data in your store 

import { csrfFetch } from "./csrf"

const FETCH_REVIEWS_FOR_SPOT = 'reviews/fetchForSpot';
const POST_REVIEW  = 'review/actionAddReview'
const DELETE_REVIEW = 'review/actionDeleteReview'




// Action Creator
export const fetchReviewsForSpot = (spotId, reviews) => ({
    type: FETCH_REVIEWS_FOR_SPOT,
    payload: { spotId, reviews },
  });

  // Thunk Function to Fetch Reviews
  export const thunkFetchReviewsForSpot = (spotId) => async dispatch => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data); // Log to check the structure
        dispatch(fetchReviewsForSpot(spotId, data.Reviews));
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };


//todo : create action creator for post review 
export const actionCreateReview = (reviewData) =>  { 

    return { 
        type : POST_REVIEW,
        payload: reviewData
    }
}


//todo: create thunk function to fetch data actually send data from /api/spots/:spotId/reviews 

export const thunkCreateReview = (spotId,reviewData) => async dispatch => { 
  
    try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, { 
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reviewData),
    })

    if (response.ok) { 
        const reviewRes = await response.json()
        dispatch(actionCreateReview(reviewRes))
        console.log('this is thunk create review',reviewRes)
        return reviewRes
    }
    else { 
        throw new Error('something went wrong')
    }

}
catch (error) { 
    return {error}
}
}



//todo: delete action 

export const deleteActionReview = (reviewId) => { 
  return {
    type: DELETE_REVIEW,
    payload: reviewId
  }
}

//todo: thunk delete 

export const thunkDeleteReview = (reviewId) => async dispatch => {
  try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
          dispatch(deleteActionReview(reviewId));
          return { success: true };  // Indicate success
      } else {
          const error = await response.json();
          return { error };
      }
  } catch (error) {
      return { error };
  }
};



const initialReview = {}
const reviewReducer = (state=initialReview,action) => {
    switch (action.type) {
      case FETCH_REVIEWS_FOR_SPOT: {
        const { spotId, reviews } = action.payload; // Assuming 'reviews' is an array
        let normalizedReviews = {};
      
        reviews.forEach(review => {
          normalizedReviews[review.id] = review;
        });
      
        return { ...state, [spotId]: normalizedReviews };
      }
        
        case POST_REVIEW : { 
         const newReviewData = action.payload
         const reviewId = newReviewData.id
         return {...state, [reviewId]: newReviewData}
        }
      
        case DELETE_REVIEW: {
        const newState = {...state}
        delete newState[action.payload]
        return newState
        }

        default : return state
    }
     
}



export default reviewReducer;