
import { csrfFetch } from "./csrf"

const ADD_IMAGE =  'addImage/addImage/action'




export const addImageAction = (image) => { 
    return { 
        type: ADD_IMAGE,
        payload : image
    }
}


export const thunkaddImage = (spotId,image) => async dispatch => { 

    console.log('spotid and image in thunk',spotId,image)
    const response = await csrfFetch(`/api/spots/${spotId}/images`, { 
       method: "POST",
       headers : {  "Content-Type": "application/json",
    },
       body: JSON.stringify(image)
    }) 

    try { 
    if (response.ok) { 
     const imageData = await response.json()
     dispatch(addImageAction(imageData))
     console.log('imagedata',imageData)
}

}
   catch (error) { 
         throw new Error('page not found', error)
   }
}


const initialState = {}

const addImageReducer = (state = initialState, action) => { 

    switch(action.type) { 
        case ADD_IMAGE: { 
            
          return {
             ...state
          }
        }
        default: 
        return state
    }
}


export default addImageReducer