import { combineReducers } from "redux";
import { listTableReducer } from "../components/Tables/modules/reducer";
export const rootReducer = combineReducers({
  listTableReducer,
});
