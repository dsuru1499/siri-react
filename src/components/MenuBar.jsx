import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';

import { findRouteByLocation } from "../routes";
import { drawerWidth } from "../types";

const styles = theme => ({
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
});


class MenuBar extends Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onDrawerToggle: PropTypes.func.isRequired,
    }

    handleDrawerToggle = () => {
        this.props.onDrawerToggle();
    };

    render() {
        const { classes, location } = this.props;
        const route = findRouteByLocation(location.pathname);
        const title = route && route.name;

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerToggle} className={classes.menuButton} >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>{title}</Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withRouter(withStyles(styles, { withTheme: true })(MenuBar));