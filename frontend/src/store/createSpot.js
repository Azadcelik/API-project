const CREATE_SPOT = "createSpot/actionCreateSpot";

// todo: action Creator for creating spot
const actionCreateSpot = (spotData) => {
  return {
    type: CREATE_SPOT,
    payload: spotData,
  };
};

//todo : thunk actionc creator

export const thunkCreateSpot = (spotDetails) => async (dispatch) => {  //spotDetails will be passed by dispatching thunk  after form submitted
  const response = await fetch("/api/spots", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spotDetails),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(actionCreateSpot(data)); //ask if you need to return response everytime
  } else {
     
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch"); //this should be your approach to handle error 
  }
};

// todo: reducer function

const initialState = {};

const createSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
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


export default createSpotReducer