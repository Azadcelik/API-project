import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import { spotsReducer } from './spots';
import spotDetailsReducer from './spotDetails';
import createSpotReducer from './createSpot';

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  spotDetails: spotDetailsReducer,
  createSpotState: createSpotReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;