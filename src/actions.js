import { createActions } from 'redux-actions';
import linesDiscoveryService from "./services/LinesDiscoveryService";
import stopPointsDiscoveryService from "./services/StopPointsDiscoveryService";
import stopMonitoringService from "./services/StopMonitoringService";
import estimatedTimetableService from "./services/EstimatedTimetableService";

export const loadLinesDiscovery = (payload) => dispatch => {
    const request = linesDiscoveryService.getDocument(payload);
    dispatch(actions.linesDiscovery.loading(request));
    return linesDiscoveryService.fetch(request).then(
        value => dispatch(actions.linesDiscovery.success(value)),
        error => dispatch(actions.linesDiscovery.failure(error))
    );
};

export const loadStopPointsDiscovery = (payload) => dispatch => {
    const request = stopPointsDiscoveryService.getDocument(payload);
    dispatch(actions.stopPointsDiscovery.loading(request));
    return stopPointsDiscoveryService.fetch(request).then(
        value => dispatch(actions.stopPointsDiscovery.success(value)),
        error => dispatch(actions.stopPointsDiscovery.failure(error))
    );
};

export const loadStopMonitoring = (payload, name) => dispatch => {
    const request = stopMonitoringService.getDocument(payload);
    dispatch(actions.stopMonitoring.loading(request, name));
    return stopMonitoringService.fetch(request).then(
        value => dispatch(actions.stopMonitoring.success(value, name)),
        error => dispatch(actions.stopMonitoring.failure(error, name))
    );
};

export const loadEstimatedTimetable = (payload, name) => dispatch => {
    const request = estimatedTimetableService.getDocument(payload);
    dispatch(actions.estimatedTimetable.loading(request, name));
    return estimatedTimetableService.fetch(request).then(
        value => dispatch(actions.estimatedTimetable.success(value, name)),
        error => dispatch(actions.estimatedTimetable.failure(error, name))
    );
};

const actions = createActions(
    {
        LINES_DISCOVERY: {
            LOADING: payload => payload,
            SUCCESS: payload => payload,
            FAILURE: payload => payload
        },
        STOP_POINTS_DISCOVERY: {
            LOADING: payload => payload,
            SUCCESS: payload => payload,
            FAILURE: payload => payload
        },
        STOP_MONITORING: {
            LOADING: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            SUCCESS: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            FAILURE: [
                payload => payload,
                (payload, name) => ({ name })
            ],
        },
        ESTIMATED_TIMETABLE: {
            LOADING: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            SUCCESS: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            FAILURE: [
                payload => payload,
                (payload, name) => ({ name })
            ],
        }
    }
);

export default actions;
