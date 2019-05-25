import { handleActions } from "redux-actions";

const reducers = handleActions(
    {
        "LINES_DISCOVERY/LOADING": (state, action) => {
            return Object.assign({}, state, { linesDiscovery: { request: action.payload, response: null } });
        },
        "LINES_DISCOVERY/SUCCESS": (state, action) => {
            return Object.assign({}, state, { linesDiscovery: { request: state.linesDiscovery.request, response: action.payload } });
        },
        "LINES_DISCOVERY/FAILURE": (state, action) => {
            // return Object.assign({}, state, { linesDiscovery: { request: null, response: null } })
            return state;
        },

        "STOP_POINTS_DISCOVERY/LOADING": (state, action) => {
            return Object.assign({}, state, { stopPointsDiscovery: { request: action.payload, response: null } });
        },
        "STOP_POINTS_DISCOVERY/SUCCESS": (state, action) => {
            return Object.assign({}, state, { stopPointsDiscovery: { request: state.stopPointsDiscovery.request, response: action.payload } });
        },
        "STOP_POINTS_DISCOVERY/FAILURE": (state, action) => {
            // return Object.assign({}, state, { stopPointsDiscovery: { request: null, response: null } });
            return state;
        },

        "STOP_MONITORING/LOADING": (state, action) => {
            let value = { stopMonitoring: {} };
            value.stopMonitoring[action.meta.name] = { request: action.payload, response: null };
            return Object.assign({}, state, value);
        },
        "STOP_MONITORING/SUCCESS": (state, action) => {
            let value = { stopMonitoring: {} };
            value.stopMonitoring[action.meta.name] = { request: state.stopMonitoring[action.meta.name].request, response: action.payload };
            return Object.assign({}, state, value);
        },
        "STOP_MONITORING/FAILURE": (state, action) => {
            let result = Object.assign({}, state);
            delete result.stopMonitoring[action.meta.name];
            return result;
        },

        "ESTIMATED_TIMETABLE/LOADING": (state, action) => {
            let value = { estimatedTimetable: {} };
            value.estimatedTimetable[action.meta.name] = { request: action.payload, response: null };
            return Object.assign({}, state, value);
        },
        "ESTIMATED_TIMETABLE/SUCCESS": (state, action) => {
            let value = { estimatedTimetable: {} };
            value.estimatedTimetable[action.meta.name] = { request: state.estimatedTimetable[action.meta.name].request, response: action.payload };
            return Object.assign({}, state, value);
        },
        "ESTIMATED_TIMETABLE/FAILURE": (state, action) => {
            let result = Object.assign({}, state);
            delete result.estimatedTimetable[action.meta.name];
            return result;
        }
    },
    {
        linesDiscovery: { request: null, response: null },
        stopPointsDiscovery: { request: null, response: null },
        stopMonitoring: {},
        estimatedTimetable: {}
    }
);

export default reducers;