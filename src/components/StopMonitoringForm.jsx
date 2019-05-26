import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from 'formik';
import * as yup from "yup"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import Select from "./Select";
import actions, { loadLinesDiscovery, loadStopPointsDiscovery } from "../actions";
import * as T from "../types";
import * as Xml from "../services/Xml";
import Slider from "./Slider";
import { getParams } from "../utils"

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 250,
    },
    menu: {
        width: 250,
    },
});

function View(props) {

    const { classes, monitoringRefs, lineRefs, values, errors, handleChange, isValid, setFieldTouched } = props;
    const { monitoringRef, lineRef, startTime, stopVisitTypes, previewInterval,
        maximumStopVisits, minimumStopVisitsPerLine, minimumStopVisitsPerLineVia,
        maximumNumberOfCallsPrevious, maximumNumberOfCallsOnwards } = values;

    const handleOnChange = (e) => {
        handleChange(e);
        setFieldTouched(e.target.name, true, false);
    };

    const STOP_VISIT_TYPES = [{ value: 'all', label: 'all', },
    { value: 'arrivals', label: 'arrivals', },
    { value: 'departures', label: 'departures', },];

    return (
        <Form >
            <Grid container className={classes.container} spacing={24}>
                <Grid item xs={12}>
                    <Select id="monitoringRef" name="monitoringRef" label="Monitoring Ref" placeholder="Monitoring Ref"
                        error={Boolean(errors.monitoringRef)} helperText={errors.monitoringRef && errors.monitoringRef.value}
                        values={monitoringRefs} value={monitoringRef} onChange={handleOnChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Select id="lineRef" name="lineRef" label="Line Ref" placeholder="Line Ref"
                        error={Boolean(errors.lineRef)} helperText={errors.lineRef && errors.lineRef.value}
                        values={lineRefs} value={lineRef} onChange={handleOnChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="startTime" name="startTime" label="startTime" type="time"
                        className={classes.textField} InputLabelProps={{ shrink: true, }} inputProps={{ step: 60, }}
                        error={Boolean(errors.startTime)} helperText={errors.startTime}
                        defaultValue={startTime} onChange={handleOnChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="stopVisitTypes" name="stopVisitTypes" label="Stop Visit Types" select
                        className={classes.textField} SelectProps={{ MenuProps: { className: classes.menu, }, }}
                        error={Boolean(errors.stopVisitTypes)} helperText={errors.stopVisitTypes}
                        value={stopVisitTypes} onChange={handleChange}>
                        {STOP_VISIT_TYPES.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="previewInterval" name="previewInterval" label={"Preview Interval " + previewInterval}
                        error={Boolean(errors.previewInterval)} helperText={errors.previewInterval}
                        value={previewInterval} onChange={handleOnChange}
                        InputProps={{ step: 1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="maximumStopVisits" name="maximumStopVisits" label={"Maximum Stop Visits " + maximumStopVisits}
                        error={Boolean(errors.maximumStopVisits)} helperText={errors.maximumStopVisits}
                        value={maximumStopVisits} onChange={handleOnChange}
                        InputProps={{ step: 1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="minimumStopVisitsPerLine" name="minimumStopVisitsPerLine" label={"Minimum Stop Visits Per Line " + minimumStopVisitsPerLine}
                        error={Boolean(errors.minimumStopVisitsPerLine)} helperText={errors.minimumStopVisitsPerLine}
                        value={minimumStopVisitsPerLine} onChange={handleOnChange}
                        InputProps={{ step: 1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="minimumStopVisitsPerLineVia" name="minimumStopVisitsPerLineVia" label={"Minimum Stop Visits Per Line Via " + minimumStopVisitsPerLineVia}
                        error={Boolean(errors.minimumStopVisitsPerLineVia)} helperText={errors.minimumStopVisitsPerLineVia}
                        value={minimumStopVisitsPerLineVia} onChange={handleOnChange}
                        InputProps={{ step: 1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="maximumNumberOfCallsPrevious" name="maximumNumberOfCallsPrevious" label={"Maximum Number Of Calls Previous " + maximumNumberOfCallsPrevious}
                        error={Boolean(errors.maximumNumberOfCallsPrevious)} helperText={errors.maximumNumberOfCallsPrevious}
                        value={maximumNumberOfCallsPrevious} onChange={handleOnChange}
                        InputProps={{ step: 1, min: -1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider className={classes.textField} id="maximumNumberOfCallsOnwards" name="maximumNumberOfCallsOnwards" label={"Maximum Number Of Calls Onwards " + maximumNumberOfCallsOnwards}
                        error={Boolean(errors.maximumNumberOfCallsOnwards)} helperText={errors.maximumNumberOfCallsOnwards}
                        value={maximumNumberOfCallsOnwards} onChange={handleOnChange}
                        InputProps={{ step: 1, min: -1 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="flex-end" >
                        <Button type="submit" variant="outlined" disabled={!isValid} >Submit</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Form>
    );
}

class StopMonitoringForm extends Component {

    static propTypes = {
        monitoringRefs: PropTypes.array.isRequired,
        lineRefs: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
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

    handleSubmit = (values, actions) => {
        const { history } = this.props;
        const url = "/stop-monitoring?" + this.setParams(values);
        history.push(url);
    }

    getParams() {
        const { location, monitoringRefs, lineRefs } = this.props;
        const params = getParams(location);
        let monitoringRef = monitoringRefs.find(t => t.value === params.monitoringRef);
        let lineRef = lineRefs.find(t => t.value === params.lineRef);

        return Object.assign(params, {
            monitoringRef: monitoringRef,
            lineRef: lineRef,
            startTime: params.startTime || "",
            stopVisitTypes: params.startTime || "",
            previewInterval: parseInt(params.previewInterval) || 0,
            maximumStopVisits: parseInt(params.maximumStopVisits) || 0,
            minimumStopVisitsPerLine: parseInt(params.minimumStopVisitsPerLine) || 0,
            minimumStopVisitsPerLineVia: parseInt(params.minimumStopVisitsPerLineVia) || 0,
            maximumNumberOfCallsPrevious: parseInt(params.maximumNumberOfCallsPrevious) || 0,
            maximumNumberOfCallsOnwards: parseInt(params.maximumNumberOfCallsOnwards) || 0,
        });
    }

    setParams(values) {
        const { monitoringRef, lineRef, startTime, stopVisitTypes, previewInterval,
            maximumStopVisits, minimumStopVisitsPerLine, minimumStopVisitsPerLineVia,
            maximumNumberOfCallsPrevious, maximumNumberOfCallsOnwards } = values;

        const search = new URLSearchParams();
        monitoringRef && search.set("MonitoringRef", monitoringRef.value);
        lineRef && search.set("LineRef", lineRef.value);
        !!startTime && search.set("StartTime", startTime);
        !!stopVisitTypes && search.set("StopVisitTypes", stopVisitTypes);
        (previewInterval > 0) && search.set("PreviewInterval", previewInterval);
        (maximumStopVisits > 0) && search.set("MaximumStopVisits", maximumStopVisits);
        (minimumStopVisitsPerLine > 0) && search.set("MinimumStopVisitsPerLine", minimumStopVisitsPerLine);
        (minimumStopVisitsPerLineVia > 0) && search.set("MinimumStopVisitsPerLineVia", minimumStopVisitsPerLineVia);
        (maximumNumberOfCallsPrevious >= 0) && search.set("MaximumNumberOfCallsPrevious", maximumNumberOfCallsPrevious);
        (maximumNumberOfCallsOnwards >= 0) && search.set("MaximumNumberOfCallsOnwards", maximumNumberOfCallsOnwards);
        return search.toString();
    }

    getSchema() {
        return yup.object().shape({
            monitoringRef: yup.object().shape({
                label: yup.string(),
                value: yup.string().required("Monitoring Ref is required"),
            }),
            lineRef: yup.object().shape({
                label: yup.string(),
                value: yup.string(),
            }),
            startTime: yup.string(),
            stopVisitTypes: yup.string(),
            previewInterval: yup.number().integer(),
            maximumStopVisits: yup.number().integer(),
            minimumStopVisitsPerLine: yup.number().integer(),
            minimumStopVisitsPerLineVia: yup.number().integer(),
            maximumNumberOfCallsPrevious: yup.number().integer(),
            maximumNumberOfCallsOnwards: yup.number().integer(),
        });
    }

    render() {
        const { classes, monitoringRefs, lineRefs } = this.props;

        return (
            <Formik onSubmit={this.handleSubmit}
                render={props => <View {...props} classes={classes} lineRefs={lineRefs} monitoringRefs={monitoringRefs} />}
                initialValues={this.getParams()}
                validationSchema={this.getSchema()}
                enableReinitialize={true}
                isInitialValid={true}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(actions.linesDiscovery.failure({})),
        onChange: (options) => {
            dispatch(loadLinesDiscovery(options));
            dispatch(loadStopPointsDiscovery(options));
        },
    }
}

const lineRefSelector = createSelector((state, props) => state.linesDiscovery, (value) => {
    let result = [];
    if (value.response) {
        let array = value.response.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "AnnotatedLineRef");
        for (var i = 0; i < array.length; i++) {
            let item = array[i];
            result.push({
                value: item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "LineRef")[0].textContent,
                label: item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "LineName")[0].textContent
                    + " / " + item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "LineRef")[0].textContent
            });
        }
    }
    return result.sort((a, b) => a.label.localeCompare(b.label));
});

const monitoringRefSelector = createSelector((state, props) => state.stopPointsDiscovery, (value) => {
    let result = [];
    if (value.response) {
        let array = value.response.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "AnnotatedStopPointRef");
        for (var i = 0; i < array.length; i++) {
            let item = array[i];
            result.push({
                value: item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "StopPointRef")[0].textContent,
                label: item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "StopName")[0].textContent
                    + " / " + item.getElementsByTagNameNS(Xml.SIRI_NAMESPACE_URI, "StopPointRef")[0].textContent
            });
        }
    }
    return result.sort((a, b) => a.label.localeCompare(b.label));
});

const mapStateToProps = (state, props) => {
    return {
        monitoringRefs: monitoringRefSelector(state, props),
        lineRefs: lineRefSelector(state, props),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles, { withTheme: true })(StopMonitoringForm)));