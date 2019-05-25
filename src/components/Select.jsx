import React, { Component } from "react";
import PropTypes from "prop-types";
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import { TextField, List, ListItem, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },


    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,

            }}
            {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem ? selectedItem.label : "").indexOf(suggestion.label) > -1;

    return (
        <ListItem
            {...itemProps}
            key={suggestion.value}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.label}
        </ListItem>
    );
}
renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(suggestions, value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    let result = (inputLength === 0) ? [] : suggestions.filter(suggestion => {
        const keep = count < 50 
            && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
        if (keep) {
          count += 1;
        }
        return keep;
    });
    return result;
}


class SelectUI extends Component {

    static propTypes = {
        values: PropTypes.array.isRequired,
        value: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
    }

    state = {
        inputValue: "",
    }

    componentWillReceiveProps(props) {
        const { value } = props;
        this.setState({ inputValue: value ? value.label : "" });
    }

    handleChange = (value) => {
        const { id, name, onChange } = this.props;
        onChange({ target: { id: id, name: name, value: value } });
    }

    handleInputValueChange =  (inputValue) => {
        this.setState({ inputValue: inputValue});
    }

    render() {
        const { classes, values, helperText, error, placeholder } = this.props;
        const { inputValue } = this.state;

        return (
            <div className={classes.root}>
                <Downshift onChange={this.handleChange} itemToString={(t) => t ? t.label : ""}
                    inputValue={inputValue} onInputValueChange={this.handleInputValueChange} >
                    {({
                        getInputProps,
                        getItemProps,
                        getMenuProps,
                        highlightedIndex,
                        inputValue,
                        isOpen,
                        selectedItem,
                        clearSelection,
                    }) => (<div className={classes.container}>
                        {renderInput({
                            fullWidth: true,
                            classes,
                            error: error,
                            helperText: helperText,
                            InputProps: getInputProps({
                                placeholder: placeholder,
                                onChange: e => {
                                    e.persist()
                                    if (e.target.value === "") {
                                        clearSelection();
                                    }
                                },
                            }),
                        })}
                        <div {...getMenuProps()}>
                            {isOpen ? (
                                <Paper className={classes.paper} square>
                                    <List className={classes.list}>
                                        {getSuggestions(values, inputValue)
                                            .map((value, index) => renderSuggestion({
                                                suggestion: value,
                                                index,
                                                itemProps: getItemProps({ item: value, index }),
                                                highlightedIndex,
                                                selectedItem,
                                            }))}
                                    </List>
                                </Paper>
                            ) : null}
                        </div>
                    </div>)
                    }
                </Downshift>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SelectUI);
