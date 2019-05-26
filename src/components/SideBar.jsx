import React, { Component, Fragment } from 'react';

import { Typography, Divider, ListItem, ListItemText, Hidden, List, Drawer } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import routes from "../routes";
import { drawerWidth } from "../types";

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
  },
  toolbar: theme.mixins.toolbar,
});

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing,
  },
}))(MuiExpansionPanelDetails);

class Menu extends Component {

  state = {
    expanded: null,
  };

  handleChange = route => (event, expanded) => {
    const { history } = this.props;
    history.replace(route.path);
    this.setState({
      expanded: expanded ? route.name : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;


    return (
      <div>
        <div className={classes.toolbar} />
        <List>
          {routes.map((prop, key) => {
            if (prop.form) {
              return (
                <ExpansionPanel key={prop.name} expanded={expanded === prop.name} onChange={this.handleChange(prop)} >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{prop.name}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <prop.form />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            } else {
              return (
                <Fragment key={key}>
                  <Divider />
                  <ListItem button key={prop.name} onClick={this.handleChange(prop)}>
                    <ListItemText primary={prop.name} />
                  </ListItem>
                </Fragment>
              );
            }
          })}
        </List>
      </div>
    );
  }
}


class SideBar extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onDrawerToggle: PropTypes.func.isRequired,
  }

  handleDrawerToggle = () => {
    this.props.onDrawerToggle();
  };

  render() {
    const { classes, theme, open, container, history } = this.props;

    return (
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer container={container} variant="temporary" anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={open} onClose={this.handleDrawerToggle} classes={{ paper: classes.drawerPaper, }} >
            <Menu history={history} classes={classes} />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper, }} variant="permanent" open >
            <Menu history={history} classes={classes} />
          </Drawer>
        </Hidden>
      </nav>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(SideBar));