const GET_SPOTS = "spots/actionGetSpots";




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
  
  // todo: Spots Reducer
  const spotsInitialState =  {
    Spots: []
  }
  
  export const spotsReducer = (state = spotsInitialState,action) => { 
      switch(action.type) { 
        case GET_SPOTS : { 
          
          return {...state, Spots: action.payload}
        }
        default : { 
          return state
        }
      }
     
  }