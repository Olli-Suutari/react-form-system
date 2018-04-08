import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { logUserIn, checkSession } from '../../../../actions/AuthenticationActions';

export class LoginPageContainer extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          email: '',
          password: '',
          showLoginFailed: false,
      };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.checkIfEnter = this.checkIfEnter.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

    componentDidMount() {
        // Check session, if user is logged in componentWillReceiveProps will redirect the user.
        const { dispatch } = this.props;
        dispatch(checkSession());
        document.title = 'Login page';
        // https://jsfiddle.net/alvaroAV/svvz7tkn/
        /* Create an alert to show if the browser is IE */
        if (navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1) {
            alert('Internet Explorer is not supported, please try an another browser.');
        }
    }

    componentWillReceiveProps(nextProps) {
      // Check if logging in status has changed.
      if (nextProps.authentication.isLoggedIn)
      {
          return (
              <Redirect to="/management" />
          );
      }
      else if (nextProps.authentication.isLoggingIn !== this.props.authentication.isLoggingIn)
        // If the status is changed to false and we are not logged in, alert the user of failed login attempt.
        { if (!nextProps.authentication.isLoggingIn && !nextProps.authentication.isLoggedIn)
        {
            this.setState({ showLoginFailed: true });
        } }
  }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }
    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    // Handle submission once all form data is valid
    handleFormSubmit() {
        const formData = this.state;
        const { dispatch } = this.props;
        dispatch(logUserIn(formData));
    }

    // catch enter clicks
    checkIfEnter(target) {
        if (target.charCode === 13) {
            this.handleFormSubmit();
        }
    }

    render() {
    if (this.props.authentication.isLoggedIn) {
      return (
        <Redirect to="/management" />
      );
    }
    let loginFailed = '';
    if (this.state.showLoginFailed)
    {
        loginFailed = 'Login failed with the given email/password combination.';
    }
    return (
        <div className="login-page">
            <div className="form">
                <p>Welcome! You can login to the system from this page.</p>
                <br />
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" required name="email" placeholder="Email"
                               onKeyPress={this.checkIfEnter} onChange={this.handleEmailChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" required name="password" placeholder="Password"
                               onKeyPress={this.checkIfEnter} onChange={this.handlePasswordChange} />
                    </FormGroup>
                    <Button className="button" href="#" target="_self" onClick={this.handleFormSubmit}>Login</Button>
                </Form>
                <span className="message"><Link to="/management/reset-password">Do you want to change your password or have you forgotten it?
              </Link></span>
                <br /><br />
                <h5 style={{ color: 'red' }}>{loginFailed}</h5>
            </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
  };
}

export default connect(mapStateToProps)(LoginPageContainer);
