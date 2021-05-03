import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup } from "reactstrap";
import "./Login.scss";
import TextInput from "../common/TextInput";
import { bindActionCreators } from "redux";
import * as authActions from "../../redux/actions/authActions";
import * as projectActions from "../../redux/actions/projectActions";

// class Login extends React.Component {
function Login({ isAuthenticated, user, actions, ...props }) {

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  useEffect(() => {
    // console.log("ProjectSelect >> useEffect >> ");
    // actions.authActions.redirectIfAuthenticated('/project-select');
  }, [actions]);

  function handleSubmit(event) {
    event.preventDefault();
    actions.authActions.login(credentials.username, credentials.password);
  }

  function handleChange(event) {
    setCredentials({ ...credentials, [event.target.name]: event.target.value })
  };

  return (
    <div className="login container" >
      <h1>Sign in to your account</h1>
      <div className="form-wrapper">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <TextInput
              id="email"
              label="Email"
              type="email"
              onChange={handleChange}
              name="username"
              value={credentials.username}
            />
          </FormGroup>
          <FormGroup>
            <TextInput
              id="password"
              label="Password"
              type="password"
              onChange={handleChange}
              name="password"
              value={credentials.password}
            />
          </FormGroup>
          <Button>Sign In</Button>
          {/* <Link to='/project-select' className="button">Sign In</Link> */}
          <p>Forgot username or password?</p>
        </Form>
      </div>
      <div className="request-access">
        <p>Don't belong to a faculty?</p>
        <p>Click here to request access</p>
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  const { auth } = state;
  // console.log("Login >> mapStateToProps >> auth >> ", auth)
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated
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

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(Login);
