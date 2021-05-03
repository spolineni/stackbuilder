import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function productReducer(state = initialState.projects, action) {

  switch (action.type) {
    default:
      return state;
  }
}
