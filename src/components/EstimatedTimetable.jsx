import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { createSelector } from 'reselect';

import actions, { loadEstimatedTimetable } from "../actions";
import XmlView from "./XmlView";
import { getParams } from "../utils"

class EstimatedTimetable extends Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        value: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onChange(getParams(this.props.location));
    }

    componentWillReceiveProps(props) {
        if (props.location !== this.props.location) {
            this.props.onChange(getParams(props.location));
        }
    }

    componentWillUnmount() {
        this.props.onClose(getParams(this.props.location));
    }

    render() {
        const { value } = this.props;
        return (value) ? (
            <Fragment>
                <XmlView document={value.request} />
                <XmlView document={value.response} />
            </Fragment>
        ) : null;
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onClose: (options) => dispatch(actions.estimatedTimetable.failure({}, options.lineRef)),
        onChange: (options) => {
            dispatch(loadEstimatedTimetable(options, options.lineRef));
        }
    }
}

const selector = createSelector((state, props) => {
    let params = getParams(props.location);
    return state.estimatedTimetable[params.lineRef];
}, value => value);

const mapStateToProps = (state, props) => {
    return {
        value: selector(state, props)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EstimatedTimetable));