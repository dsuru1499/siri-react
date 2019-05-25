import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import { FormControl, FormHelperText, InputLabel } from '@material-ui/core';
import clsx from 'clsx';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  slider: {
    position: 'relative',
    marginTop: 50,
  },
  inputLabel: {
    fontSize: "0.8rem",
  },
});

const SliderUI = React.forwardRef((props, ref) => {

  const { classes, className: classNameProp, defaultValue, disabled, error,
    FormHelperTextProps, fullWidth, helperText, id, InputLabelProps,
    InputProps, inputProps, inputRef, label, margin, name, required = false,
    onChange, value, ...other
  } = props;

  const labelRef = React.useRef(null);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;

  function handleChange(event, value) {
    onChange({ target: { id: id, name: name, value: value } });
  };


  return (
    <FormControl className={clsx(classes.root, classNameProp)} error={error}
      fullWidth={fullWidth} ref={ref} required={required}{...other}>
      {label && (<InputLabel className={classes.inputLabel} htmlFor={id} ref={labelRef} {...InputLabelProps}>{label}</InputLabel>)}
      <Slider classes={{ container: classes.slider }} id={id} name={name} value={value}
        onChange={handleChange} aria-describedby={helperTextId} {...InputProps}/>
      {helperText && (<FormHelperText id={helperTextId} {...FormHelperTextProps}>{helperText}</FormHelperText>)}
    </FormControl>
  );
});

SliderUI.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  FormHelperTextProps: PropTypes.object,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.node,
  id: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  label: PropTypes.node,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.any,
};

export default withStyles(styles, { withTheme: true })(SliderUI);
