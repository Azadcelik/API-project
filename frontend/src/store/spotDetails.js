const GET_SPOT_DETAILS = "spotDetails/actionGetSpotDetails";

// todo: action creator for getSpotDetails
export const actionGetSpotDetails = (spotDetails) => {
    console.log('spotdetails', spotDetails) //this data is coming from api throuch thunk action.pay attention how thunk action dispatch for here and passing data
  return {
    type: GET_SPOT_DETAILS,
    payload: spotDetails,
  };
};

//todo: thunk action creator

export const getSpotDetails = (spotId) => async (dispatch) => {
    // console.log("Fetching details for spotId:", spotId); //spotId is coming from url which is been passed through dispatch in useEffect.that is how you are hitting correct id


  //i need to go throgh api to get all details of spot first
  const response = await fetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
//   console.log(response) // response after you hit api
  if (response.ok) {
    const data = await response.json();
    dispatch(actionGetSpotDetails(data));
  }
  else { 
    throw new Error ('fetching is not succesful')
  }

};


//todo: i still do not know how to normalize this data.Come back and refactor for normalization after watching related videos again
const initialState = {
  SpotImages: [],
  Owner: [],
};

// todo: reducer for spotDetails
const spotDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_DETAILS: {
      return { ...state,
        ...action.payload
         };
    }
    default: 
    return state
  }
};

export default spotDetailsReducer;
