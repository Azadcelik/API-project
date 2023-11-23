

//todo: check if response has an error if it is not then dispatch the result with the action creator 
//todo: update your reducer that you will later have your data in your store 

import { csrfFetch } from "./csrf"

const FETCH_REVIEWS_FOR_SPOT = 'reviews/fetchForSpot';
const POST_REVIEW  = 'review/actionAddReview'



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
        const reviews = await response.json();
        console.log('data from thunk fetch revieww',reviews)
        dispatch(fetchReviewsForSpot(spotId, reviews));
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

const initialReview = {}
const reviewReducer = (state=initialReview,action) => {
    switch (action.type) {
        case FETCH_REVIEWS_FOR_SPOT: {
          const { spotId, reviews } = action.payload;
          let normalizedReviews = {};
    
          reviews.Reviews.forEach(review => {
            normalizedReviews[review.id] = review;
          });
    
          return { ...state, [spotId]: normalizedReviews };
        }
        
        case POST_REVIEW : { 
         const newReviewData = action.payload
         const reviewId = newReviewData.id
         return {...state, [reviewId]: newReviewData}
        }

        default : return state
    }
     
}



export default reviewReducer;