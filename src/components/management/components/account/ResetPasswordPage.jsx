import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, FormGroup, Label } from 'reactstrap';
import Formsy from 'formsy-react';
import { createHash } from '../../../../actions/PassResetActions';
import FormsyInput from '../../../../shared/formsy';

export class ResetPasswordPageContainer extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          email: '',
          canSubmit: false,
      };
    // bound functions
    this.clearPasswordReset = this.clearPasswordReset.bind(this);
    this.checkIfEnter = this.checkIfEnter.bind(this);
    this.triggerFormSend = this.triggerFormSend.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
  }

    componentDidMount() {
        document.title = 'Reset password';
    }

    // Reload the page thus re-enabling the form.
    clearPasswordReset() {
        window.location.reload(false);
    }

    triggerFormSend() {
        // Set states from fields that use formsy.
        const formsyValues = this.refs.form.getModel();
        // For some reason, the button is not disabled when the page loads and thus sending empty form is possible.
        if (formsyValues.email)
        {
            this.setState({
                    email: formsyValues.email,
                },
                // Callback to handleValidSubmit once setState is done for.
                this.handleValidSubmit
            );
        }
        else
        {
            alert('The email field is empty');
        }
    }

    // Handle submission once all form data is valid
    handleValidSubmit() {
        const formData = this.state;
        const { dispatch } = this.props;
        dispatch(createHash(formData));
    }

    // catch enter clicks
    checkIfEnter(target) {
      // console.log("check enter...");
        if (target.charCode === 13) {
            this.handleValidSubmit();
        }
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

  render() {
    // To do: How to add checkEnter to Formsy?
    let inputSection = (<Formsy ref="form" onValid={this.enableButton} onInvalid={this.disableButton}>
            <FormGroup>
            <Label for="exampleEmail">Email</Label>
                <FormsyInput
                    name="email"
                    validations="isEmail"
                    validationError="The email is invalid."
                    onKeyPress={this.checkIfEnter}
                />
            </FormGroup>
            <Button type="submit" className="button" href="#" target="_self" disabled={!this.state.canSubmit}
            onClick={this.triggerFormSend}>Send the reset link</Button>
            </Formsy>);
      if (this.props.passwordManagement.isPasswordReset === 1) {
          inputSection = (<div>
              <p style={{ color: 'red' }}>
                  Password reset failed. Make sure that the email is correct and try again.
              </p>
              <p>
                  <Button className="button" href="/management/reset-password" target="_self"
                          onClick={this.clearPasswordReset}>Send a new message</Button>
              </p>
          </div>);
      }
      if (this.props.passwordManagement.isPasswordReset === 2) {
          inputSection = (<div>
                      <p>
                          The password reset link was just sent to the email you provided. If you received no mail,
                          try waiting a few minutes and check your spam folder too. If you still cannot find the link,
                          you can try sending it again.
                      </p>
                      <p>
                          <Button className="button" href="/management/reset-password" target="_self"
                                  onClick={this.clearPasswordReset}>Send a new message</Button>
                      </p>
                  </div>);
      }
    return (
        <div className="login-page">
            <div className="form">
                <p>You can send a password reset link to your email from this page.</p>
                <br />
                {inputSection}
                <span className="message">
                    <Link to="/management/login">No need for a password reset? Return to the login page.
                </Link></span>
                <br />
            </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({ passwordManagement: state.passwordManagement });

export default connect(mapStateToProps)(ResetPasswordPageContainer);
