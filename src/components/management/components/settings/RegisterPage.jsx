import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, FormGroup, Label, ModalBody } from 'reactstrap';
import Formsy from 'formsy-react';
import { createHash } from '../../../../actions/PassResetActions';
import { checkSession } from '../../../../actions/AuthenticationActions';
import { registerUser } from '../../../../actions/UserManagementActions';
import FormsyInput from '../../../../shared/formsy';

export class RegisterPageContainer extends React.Component {
  constructor(props) {
    super(props);
      // component state
      this.state = {
          email: '',
          username: '',
          canSubmit: false,
          isUserCreationModalVisible: false,
          registerUserResult: '',
      };
      this.checkUserSession = this.checkUserSession.bind(this);
      this.registerFunction = this.registerFunction.bind(this);
      this.resetPasswordRequest = this.resetPasswordRequest.bind(this);
      this.sendPassResetFunction = this.sendPassResetFunction.bind(this);
      this.triggerFormSend = this.triggerFormSend.bind(this);
      this.disableButton = this.disableButton.bind(this);
      this.enableButton = this.enableButton.bind(this);
      this.generateRandomID = this.generateRandomID.bind(this);
      this.toggleUserCreationModal = this.toggleUserCreationModal.bind(this);
  }

    componentDidMount()
    {
        this.checkUserSession();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userManagement.registrationSucceeded !== this.props.userManagement.registrationSucceeded)
        {
            // 1 = fail, 2 = success. This comes from accountReducer.js
            if (nextProps.userManagement.registrationSucceeded === 1)
            {
                this.setState({ registerUserResult: <h5 style={{ color: 'red' }}>Failure in creating the new user,
                        make sure this email is not already registered.</h5> });
            }
            else if (nextProps.userManagement.registrationSucceeded === 2)
            {
                this.sendPassResetFunction();
                this.setState({ registerUserResult: <h5 style={{ color: 'green' }}>User created successfully.</h5> });
            }
        }
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    resetPasswordRequest(email) {
        const { dispatch } = this.props;
        dispatch(createHash(email));
    }

    generateRandomID() {
        /* eslint-disable */
        const randId = document.querySelector('.rand-id');
        const btn = document.querySelector('button');
        /* eslint-enable */
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    registerFunction() {
        const user = { email: this.state.email, username: this.state.username };
        const toCreate = { user, userEmail: this.props.authentication.email };
        const { dispatch } = this.props;
        dispatch(registerUser(toCreate));
    }

    sendPassResetFunction() {
        const { dispatch } = this.props;
        const userData = this.state;
        dispatch(createHash(userData));
    }

    triggerFormSend() {
        // Set states from fields that use formsy.
        const formsyValues = this.refs.form.getModel();
        // For some reason, the button is not disabled when the page loads and thus sending empty form is possible.
        if (formsyValues.email)
        {
            const newUsername = this.generateRandomID();
            this.setState({
                    email: formsyValues.email,
                    username: newUsername,
                },
                // Callback to handleValidSubmit once setState is done for.
                this.registerFunction
            );
        }
        else
        {
            alert('The email field is empty.');
        }
    }

    disableButton() {
        // Disable button and remove potential user creation succes/fail texts.
        this.setState({
            canSubmit: false,
            registerUserResult: '' });
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    toggleUserCreationModal() {
        this.setState({
            isUserCreationModalVisible: !this.state.isUserCreationModalVisible,
            registerUserResult: '',
        });
    }

  render() {
    const resultText = this.state.registerUserResult;
      return (
          <div>
              <Button color="primary" style={{ marginBottom: +'15' + 'px' }} onClick={this.toggleUserCreationModal}>User creation</Button>
              <Modal isOpen={this.state.isUserCreationModalVisible} toggle={this.toggleUserCreationModal} backdrop="static">
                  <ModalHeader>User creation</ModalHeader>
                  <ModalBody>
                      <div>
                          <p>As an administrator, you can add new users to the systems. The new users will receive an email with
                              instructions on how to reset their password and log in.</p>
                          <br />
                          <Formsy ref="form" onValid={this.enableButton} onInvalid={this.disableButton}>
                              <FormGroup>
                                  <Label>Email</Label>
                                  <FormsyInput
                                      name="email"
                                      validations="isEmail"
                                      validationError="Email is invalid"
                                  />
                              </FormGroup>
                              {resultText} <br />
                              <Button color="info" onClick={this.toggleUserCreationModal}>Cancel</Button>
                              <Button color="success" href="#" target="_self" disabled={!this.state.canSubmit}
                                      onClick={this.triggerFormSend}>Create user</Button>
                          </Formsy>
                          <br />
                      </div>
                  </ModalBody>
              </Modal>
          </div>
    );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        userManagement: state.userManagement,
    };
}

export default connect(mapStateToProps)(RegisterPageContainer);
