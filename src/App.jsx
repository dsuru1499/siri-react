import React, { Component } from 'react';
import { Provider } from "react-redux";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import store from "./store"
import routes from "./routes";
import MenuBar from "./components/MenuBar"
import SideBar from "./components/SideBar"

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes } = this.props;

    return (
      <Provider store={store}>
        <HashRouter>
          <div className={classes.root}>
            <CssBaseline />
            <MenuBar onDrawerToggle={this.handleDrawerToggle} />
            <SideBar open={this.state.open} onDrawerToggle={this.handleDrawerToggle} />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                {routes.map((prop, key) => {
                  return (<Route path={prop.path} component={prop.component} key={key} />);
                })}
                <Redirect from="/" to="/lines-discovery" />
              </Switch>
            </main>
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);