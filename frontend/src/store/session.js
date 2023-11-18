import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const GET_SPOTS = "session/actionGetSpots";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// todo: first we are fetching through csrfFetch function handling errors and url match for us
// todo: then we match api method with delete and finally we are dispatching actionCreator remover and then returning the removed data which probbably need to be user null

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

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
      dispatch(actionGetSpots(data.Spots));  //if you get bug try to just get data then 
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

export default sessionReducer;