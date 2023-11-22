import { csrfFetch } from "./csrf";

const GET_SPOTS = "spots/actionGetSpots";
const DELETE_SPOT = "deletespot/actionDeleteSpot";


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
      const response = await fetch("api/spots", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data) Spots is inside objects and has value of array of objects
        dispatch(actionGetSpots(data.Spots));  //if you get bug try to just get data then / this is directly returning
      } else {
        throw new Error("fetching is not succesfull");
      }
    } catch (errors) {
      console.log(errors);
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
  const spotsInitialState =  {
    Spots: []
  }
  
  export const spotsReducer = (state = spotsInitialState, action) => { 
    switch (action.type) { 
        case GET_SPOTS: { 
            return {...state, Spots: action.payload};
        }
        case DELETE_SPOT: {
            // Filter out the spot with the given ID
            const updatedSpots = state.Spots.filter(spot => spot.id !== action.payload);
            return {...state, Spots: updatedSpots};
        }
        default: { 
            return state;
        }
    }
};