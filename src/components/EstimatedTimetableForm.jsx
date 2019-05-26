import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from 'formik';
import * as yup from "yup"
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { Grid, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import Select from "./Select";
import actions, { loadLinesDiscovery } from "../actions";
import * as T from "../types";
import * as Xml from "../services/Xml";
import Slider from "./Slider";
import { getParams } from "../utils"


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 250,
  },
});

function View(props) {
  const { classes, lineRefs, values, errors, handleChange, isValid, setFieldTouched } = props;
  const { lineRef, previewInterval } = values;

  const handleOnChange = (e) => {
    handleChange(e);
    setFieldTouched(e.target.name, true, false);
  };

  return (
    <Form >
      <Grid container className={classes.root} spacing={24}>
        <Grid item xs={12}>
          <Select id="lineRef" name="lineRef" label="Line Ref" placeholder="Line Ref"
            error={Boolean(errors.lineRef)}
            helperText={errors.lineRef && errors.lineRef.value}
            values={lineRefs} value={lineRef} onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Slider className={classes.textField} id="previewInterval" name="previewInterval" label={"Preview Interval " + previewInterval}
            error={Boolean(errors.previewInterval)} helperText={errors.previewInterval}
            value={previewInterval} onChange={handleOnChange}
            InputProps={{ step: 1 }}
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

class EstimatedTimetableForm extends Component {

  static propTypes = {
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
    const url = "/estimated-timetable?" + this.setParams(values);
    history.replace(url);
  }

  getParams() {
    const { location, lineRefs } = this.props;
    const params = getParams(location);
    let lineRef = lineRefs.find(t => t.value === params.lineRef);

    return Object.assign(params, {
      lineRef: lineRef,
      previewInterval: parseInt(params.previewInterval) || 0,
    });
  }

  setParams(values) {
    const { lineRef, previewInterval } = values;

    const params = new URLSearchParams();
    lineRef && params.set("LineRef", lineRef.value);
    (previewInterval > 0) && params.set("PreviewInterval", previewInterval);
    return params.toString();
  }

  getSchema() {
    return yup.object().shape({
      lineRef: yup.object().shape({
        label: yup.string(),
        value: yup.string().required("Line ref is required")
      }),
      previewInterval: yup.number().integer(),
    });
  }

  render() {
    const { classes, lineRefs } = this.props;

    return (
      <Formik onSubmit={this.handleSubmit}
        render={props => <View {...props} classes={classes} lineRefs={lineRefs} />}
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
    onChange: (options) => dispatch(loadLinesDiscovery(options)),
  }
}

const selector = createSelector((state, props) => state.linesDiscovery, (value) => {
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

const mapStateToProps = (state, props) => {
  return {
    lineRefs: selector(state, props),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles, { withTheme: true })(EstimatedTimetableForm)));