import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { createSelector } from 'reselect';

import actions, { loadLinesDiscovery } from "../actions";
import XmlView from "./XmlView";
import { getParams } from "../utils"


class LineDiscovery extends Component {

    static propTypes = {
        value: PropTypes.object.isRequired,
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
        this.props.onClose();
    }

    render() {
        const { value } = this.props;
        return (
            <Fragment>
                <XmlView document={value.request} />
                <XmlView document={value.response} />
            </Fragment>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(actions.linesDiscovery.failure({})),
        onChange: (options) => {
            dispatch(loadLinesDiscovery(options));
        }
    }
}

const selector = createSelector((state, props) => state.linesDiscovery, value => value);

const mapStateToProps = (state, props) => {
    return {
        value: selector(state, props),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LineDiscovery));