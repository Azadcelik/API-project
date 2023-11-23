import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/actionGetSpots";
const DELETE_SPOT = "deletespot/actionDeleteSpot";
const GET_SPOT_DETAILS = "spotDetails/actionGetSpotDetails";
const UPDATE_SPOT = "updateSpot/actionUpdateSpot";
const CURRENT_SPOT = 'current/currentSpot'
const CREATE_SPOT = "createSpot/actionCreateSpot";

//todo action creator
export const actionGetSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots,
  };
};

//todo: thunk action creator
export const getAllSpots = () => async (dispatch) => {
  try {
    const response = await fetch("api/spots", { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      dispatch(actionGetSpots(data.Spots));
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
    return error.message; // Returning the error message
  }
};

// todo: action creator for getSpotDetails
export const actionGetSpotDetails = (spotDetails) => {
  console.log("spotdetails", spotDetails); //this data is coming from api throuch thunk action.pay attention how thunk action dispatch for here and passing data
  return {
    type: GET_SPOT_DETAILS,
    payload: spotDetails,
  };
};
//todo: thunk action creator

export const getSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`, {
      method: "GET",
    });

    console.log("after you hit api", response); // response after you hit api

    if (response.ok) {
      const data = await response.json();
      dispatch(actionGetSpotDetails(data));
      console.log('dispats data in thuink', data)
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

  } catch (error) {
    return error.message;
  }
};

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

    if (response.ok) {
      const spotData = await response.json();
      dispatch(actionUpdateSpot(spotData));

      
      dispatch(getSpotDetails(spotId));

      return spotData;
    }
    else { 
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error('Error during update:', error);
    return { error };
  }
};


//todo: action creator 

export const actionCurrentSpot = (currentData) => { 
  return { 
      type: CURRENT_SPOT,
      payload:currentData.Spots
  }
}



//todo: thunk action creator 

export const thunkCurrentSpot = () => async dispatch => { 
  
  try { 
      const response =  await csrfFetch("/api/spots/current",{ 
          method: "GET",
          headers: {"Content-Type": "application/json"}
      })
  
      if (response.ok) {
          const jsonData = await response.json();
          console.log('Fetched jsonData:', jsonData);  // Check the structure
          dispatch(actionCurrentSpot(jsonData));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        } 
  }
  catch (error) {
      console.error('Error in thunkCurrentSpot:', error);
      throw {error};  // Rethrow the original error, not a new Error
    }
  }



// todo: action Creator for creating spot
  export const actionCreateSpot = (spotData) => {
    return {
      type: CREATE_SPOT,
      payload: spotData,
    };
  };


//todo : thunk actionc creator

export const thunkCreateSpot = (formData) => async (dispatch) => {  //spotDetails will be passed by dispatching thunk  after form submitted
  try {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {'Content-Type': 'application/json'
  },
    
    body: JSON.stringify(formData),
  });



  if (response.ok) { 
    const spotData = await response.json()
    dispatch(actionCreateSpot(spotData)) 
    return spotData;
  }
  else { 
    throw new Error('error occured hey')
  }

}
catch(error) { 

   return {error}
}

};


  
//todo: action creator
export const actionDeleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    payload: spotId,
  };
};

//todo: thunk creator

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error occurred during  delete:", error);
      return { error };
    }

    dispatch(actionDeleteSpot(spotId));
    return { spotId };
  } catch (error) {
    console.error("Error during delete:", error);
    return { error };
  }
};



// todo: Spots Reducer
const spotsInitialState = {};

export const spotsReducer = (state = spotsInitialState, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      console.log("in reducer ", action.payload);
      let normalizedByForEach = {};
      action.payload.forEach((spot) => (normalizedByForEach[spot.id] = spot));
      return {
        ...state,
        ...normalizedByForEach,
      };
    }
    case GET_SPOT_DETAILS: {
      const spotDetails = action.payload
      const spotId = spotDetails.id
      const normalizedSpot = { 
        ...spotDetails, SpotImages: spotDetails.SpotImages, Owner: spotDetails.Owner
      }
      return {...state,  [spotId] : normalizedSpot}
    }
    case CURRENT_SPOT: { 
      let normalizedCurrentSpots = {};
      action.payload.forEach((spot) => {
        normalizedCurrentSpots[spot.id] = { 
          ...spot,
          // Add any other normalization if needed
        };
      });
    
      return {
        ...state,
        ...normalizedCurrentSpots, // Merge the current user's spots into the state
      };
    }

    case UPDATE_SPOT: {
      const updatedSpotData = action.payload;
      const spotId = updatedSpotData.id;
      // Check if the existing data for this spot is available
      const existingSpotData = state[spotId];
      if (!existingSpotData) {
        
        return state;
      }
      const mergedSpotData = {
        ...existingSpotData,
        ...updatedSpotData,
        // Explicitly retain SpotImages and Owner from existing data
        SpotImages: existingSpotData.SpotImages,
        Owner: existingSpotData.Owner
      };
      return {
        ...state,
        [spotId]: mergedSpotData
      };
    }
    case CREATE_SPOT: {
      const newSpotData = action.payload;
      const spotId = newSpotData.id;
    
      // Directly add the new spot data to the state
      // No need to check for existing data as its a create operation
      return {
        ...state,
        [spotId]: newSpotData, // Add the new spot to the state
      };
    }

    case DELETE_SPOT: {
      console.log('Before deletion in reducer:', state);
    
      // Create a new state object excluding the spot with the given ID
      const newState = { ...state };
      delete newState[action.payload]; // action.payload should be the ID of the spot to delete
    
      console.log('After deletion in reducer:', newState);
      return newState;
    }
    default: {
      return state;
    }
  }
};



   // case CREATE_SPOT: {
    //   const newSpotData = action.payload;
    //   const spotId = newSpotData.id;
    //   const existingSpotData = state[spotId];
    //   if (!existingSpotData) {
    //     return state;
    //   }
    //   const mergedSpotData = {
    //     ...existingSpotData,
    //     ...newSpotData,
    //     // Explicitly retain SpotImages and Owner from existing data
    //     SpotImages: existingSpotData.SpotImages,
    //     Owner: existingSpotData.Owner
    //   };
    //   return {
    //     ...state,
    //     [spotId]: newSpotData // Add the new spot to the state
    //   };
    // }