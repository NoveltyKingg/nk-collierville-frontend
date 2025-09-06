/* eslint-disable indent */
import { AVAILABLE_ACTIONS } from "./actions";

const { ADD_PROFILE, SET_GENERAL, SET_PROFILE } = AVAILABLE_ACTIONS;

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_PROFILE: {
      return {
        ...state,
        profile: {
          ...state?.profile,
          ...(action?.data || {}),
        },
      };
    }

    case SET_PROFILE: {
      return {
        profile: {
          ...(action?.data || {}),
        },
      };
    }

    case SET_GENERAL: {
      return {
        ...state,
        general: {
          ...state?.general,
          ...(action?.data || {}),
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
