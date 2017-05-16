import PropTypes from "prop-types";
import { FlowRouter } from "meteor/kadira:flow-router";
import * as actions from "/imports/ui/actions";
import * as reducers from "./reducers";

const defaultState = {
  navInfo: [],
  workspace: {
    //! For testing only. Should be empty on start.
    layers: [
      {
        name: "Water-year Precipitation",
        urlTile: "PPT_water_year",
        minZoom: 5,
        maxZoom: 12,
        invisible: false,
        opacity: 0.7,
        extent: "-12856096.661340367, 3620057.6595859504, -11359153.899403473, 5371382.851655904",
      },
      {
        name: "Fahrenheit GDD",
        urlTile: "GDD_may_sept_demosaic",
        minZoom: 5,
        maxZoom: 12,
        invisible: false,
        opacity: 0.7,
        extent: "-12856096.661340367, 3620057.6595859504, -11359153.899403473, 5371382.851655904",
      },
    ],
    filterValue: null,
    error: null,
    result: null,
    request: null,
  },
};

export default (state = defaultState, action) => {
  console.log('run reducer', action.type, {state, action});

  let nextState = state;

  if (action.type in reducers) {
    PropTypes.checkPropTypes(actions[action.type].payloadSchema, action, "action", `reducer:${action.type}`);

    nextState = reducers[action.type](state, action);
  }

  console.log('next state', nextState);

  return nextState;
};