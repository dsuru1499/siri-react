import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { createSelector } from 'reselect';

import actions, { loadLinesDiscovery } from "../actions";
import * as T from "../types";
import XmlView from "./XmlView";

class LineDiscovery extends Component {

    static propTypes = {
        value: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    componentDidMount() {
        let options = {
            [T.VERSION]: T.DEFAULT_VERSION,
            [T.REQUESTOR_REF]: T.DEFAULT_REQUESTOR_REF,
        };
        this.props.onChange(options);
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