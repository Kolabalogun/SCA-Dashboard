import { combineReducers } from "redux";

import authReducer from "./features/authSlice";

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Export the root reducer for use in the Redux store
export { rootReducer };
