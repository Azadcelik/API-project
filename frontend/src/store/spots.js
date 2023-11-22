import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/actionGetSpots";
const DELETE_SPOT = "deletespot/actionDeleteSpot";
const GET_SPOT_DETAILS = "spotDetails/actionGetSpotDetails";
const UPDATE_SPOT = "updateSpot/actionUpdateSpot";

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

      // Fetch full details after updating
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
    case UPDATE_SPOT: {
      const updatedSpotData = action.payload;
      const spotId = updatedSpotData.id;
    
      // Merge the updated spot data with the existing data to retain SpotImages and Owner
      const existingSpotData = state[spotId] || {};
      const mergedSpotData = {
        ...existingSpotData,
        ...updatedSpotData,
        // Retain SpotImages and Owner from existing data
        SpotImages: existingSpotData.SpotImages,
        Owner: existingSpotData.Owner
      };
      return {
        ...state,
        [spotId]: mergedSpotData
      };
    }



    case DELETE_SPOT: {
      // Filter out the spot with the given ID
      const updatedSpots = state.Spots.filter(
        (spot) => spot.id !== action.payload
      );
      return { ...state, Spots: updatedSpots };
    }
    default: {
      return state;
    }
  }
};
