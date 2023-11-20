const CREATE_SPOT = "createSpot/actionCreateSpot";
const CREATE_ERROR = "createSpot/createErrorAction"

// todo: action Creator for creating spot
const actionCreateSpot = (spotData) => {
  return {
    type: CREATE_SPOT,
    payload: spotData,
  };
};

//todo: Error handler action creator 
const createErrorAction = (errorData) => { 
  return { 
    type: CREATE_ERROR,
    payload: errorData
  }
}



//todo : thunk actionc creator

export const thunkCreateSpot = (formData) => async (dispatch) => {  //spotDetails will be passed by dispatching thunk  after form submitted
  try {
  const response = await fetch("/api/spots", {
    method: "POST",
    headers: {'Content-Type': 'application/json',
    "XSRF-TOKEN": "xsmaXpRJ-wR7SEPhQZi_2XSnM3Kam_MzAM00"
  },
    
    body: JSON.stringify(formData),
  });

  const spotData = await response.json()

  if (!response.ok) { 

    console.error('errror occured during submit form lo',spotData)
    dispatch(createErrorAction(spotData.errors))
  }
  else { 
     dispatch(actionCreateSpot(spotData)) 
  }

}
catch(error) { 

   console.error('error trough fetching', error)
}



};

// todo: reducer function

const initialState = {
  
};

const createSpotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT: {
        const newSpots = action.payload
      return {
        ...state,
        [newSpots.id]: newSpots
      };
    }
      case CREATE_ERROR: {
      return { 
        ...state, error: action.payload
      }
    }

    default:
      return state;
  }
};


export default createSpotReducer