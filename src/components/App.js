import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "../helpers/history";
import PrivateRoute from "../helpers/privateRoute";
import "./App.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ProjectSelect from "./project-select/ProjectSelect";
import ProjectDetails from "./homepage/ProjectDetails";
import Homepage from "./homepage/Homepage";
import { bindActionCreators } from "redux";
import * as authActions from "../redux/actions/authActions";
import * as projectActions from "../redux/actions/projectActions";
import ProductsCatalog from "./products-catalog/ProductsCatalog";
import ProvisionProduct from "./provision-product/ProvisionProduct";
import Profile from "./profile/Profile";
import Login from "./login/Login";
import ProvisionedProductDetails from "./provisioned-product-details/ProvisionedProductDetails";


function App({ session, projectList, selectedProject, actions, ...props }) {
  useEffect(() => {
    actions.authActions.userSessionLoad();
  }, [actions]);

  return (
    <Router history={history} >
      <div className="App">
        <div className="app-content">
          <Header />
          <Switch>
            <Route exact path="/login" render={(props) => <Login  {...props} />} />
            <PrivateRoute path="/project-select" component={ProjectSelect} />
            <PrivateRoute path="/project-details" component={ProjectDetails} />
            <PrivateRoute path="/products-catalog" component={ProductsCatalog} />
            <PrivateRoute path="/provision-product" component={ProvisionProduct} />
            <PrivateRoute path="/provisioned-product-details" component={ProvisionedProductDetails} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/" component={Homepage} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

function mapStateToProps(state) {
  const { project, auth } = state;
  return {
    session: auth.session,
    isAuthenticated: auth.isAuthenticated,
    selectedProject: project.selectedProject,
    projectList: project.projectList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      authActions: bindActionCreators(authActions, dispatch),
      projectActions: bindActionCreators(projectActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

