
//todo: your variable for your aaction 

import { csrfFetch } from "./csrf";

const CURRENT_SPOT = 'current/currentSpot'


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
        console.error('Fetch response not OK:', response.status);
        // Handle non-OK responses appropriately
      } 
}
catch (error) {
    console.error('Error in thunkCurrentSpot:', error);
    throw error;  // Rethrow the original error, not a new Error
  }
}

const initialState = []

const currentSpotReducer = (state = initialState,action) =>  { 

    switch(action.type) { 
        case CURRENT_SPOT: { 
            const normalizedData = action.payload.reduce((acc,spot) => { 
                acc[spot.id] = spot
                return acc
            },{})

            return normalizedData
        }
        default: 
        return state
    }

}


export default currentSpotReducer ;