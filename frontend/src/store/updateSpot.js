import { csrfFetch } from "./csrf";


const UPDATE_SPOT = "updateSpot/actionUpdateSpot";


// todo: action Creator for creating spot
const actionUpdateSpot = (spotData) => {
  return {
    type: UPDATE_SPOT,
    payload: spotData,
  };
};





//todo : thunk update spot

// Thunk action creator for updating a spot
export const thunkUpdateSpot = (spotId, formData) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error occurred during form submission:', error);
        return { error };
      }
  
      const spotData = await response.json();
      dispatch(actionUpdateSpot(spotData));
      return spotData;
  
    } catch (error) {
      console.error('Error during update:', error);
      return { error };
    }
  };


// todo: reducer function

const initialState = {
  
};

const updateSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SPOT: {
        const newSpots = action.payload
      return {
        ...state,
        [newSpots.id]: newSpots
      };
    }
    default:
      return state;
  }
};


export default updateSpotReducer