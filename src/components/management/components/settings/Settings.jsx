import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Button, Label } from 'reactstrap';
import Info from './Info';
import UserManagement from './UserManagement';
import { checkSession } from '../../../../actions/AuthenticationActions';
import { toggleEmailNotifications } from '../../../../actions/UserManagementActions';

class SettingsManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: this.props.authentication.email,
            userNotifications: this.props.authentication.emailNotifications,
            notificationsSuccesModal: false,
        };
        this.checkUserSession = this.checkUserSession.bind(this);
        this.toggleEmailNotifications = this.toggleEmailNotifications.bind(this);
        this.sendToggleToDB = this.sendToggleToDB.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
    }

    componentWillMount() {
        this.checkUserSession();
    }

    // TO DO: We just reload the page to avoid dealing with re-rendering and re-doing the function with possible re-toggle.
    componentWillReceiveProps(nextProps) {
        if (nextProps.userManagement.toggleNotificationsStatus !== this.props.userManagement.toggleNotificationsStatus) {
            // Display an alert according to update results.
            if (nextProps.userManagement.toggleNotificationsStatus === 2) {
                alert('There was an error, please try again.');
                window.location.reload(true);
            }
            else if (nextProps.userManagement.toggleNotificationsStatus === 3) {
                this.toggleNested();
            }
        }
    }

    reloadPage() {
        window.location.reload(true);
    }

    sendToggleToDB() {
        const { dispatch } = this.props;
        const user = this.state;
        dispatch(toggleEmailNotifications(user));
    }

    toggleEmailNotifications() {
        if (this.props.authentication.emailNotifications)
        {
            this.setState({
                userNotifications: false,
            }
            , this.sendToggleToDB
            );
        }
        else if (!this.props.authentication.emailNotifications)
        {
            this.setState({
                userNotifications: true,
                }
                , this.sendToggleToDB
            );
        }
        else
        {
            alert('There was an error in changing the notification settings.');
            window.location.reload(true);
        }
        this.checkUserSession();
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    toggleNested() {
        this.setState({
            notificationsSuccesModal: !this.state.notificationsSuccesModal,
        });
    }

    render() {
        let adminSettings = '';
        if (this.props.authentication.isAdmin)
        {
            adminSettings = (<div>
                <br />
                <h2 className="admin-settings-text">Settings for administrator</h2>
                <Info infos={this.props.infos} />
                <UserManagement />
            </div>);
        }
        return (
            <div>
                <br />
                <FormGroup check onChange={this.toggleEmailNotifications.bind(this)}>
                    <Label check>
                        <Input type="checkbox" defaultChecked={this.props.authentication.emailNotifications} />{' '}
                        <strong>Send me an email notification of new applications</strong>
                    </Label>
                </FormGroup>
                <Modal isOpen={this.state.notificationsSuccesModal} toggle={this.toggleNested}>
                    <ModalHeader className="modal-success">Success</ModalHeader>
                    <br />
                    <ModalBody><p>Notification settings updated successfully</p></ModalBody>
                    <br />
                    <ModalFooter className="modal-success">
                        <Button color="primary" onClick={this.reloadPage}>OK</Button>
                    </ModalFooter>
                </Modal>
                {adminSettings}
            </div>
        );
    }
}

// Retrieve data from store as props
function mapStateToProps(state) {
    return {
        infos: state.infos,
        authentication: state.authentication,
        userManagement: state.userManagement,
    };
}

SettingsManagement.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


SettingsManagement.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps)(SettingsManagement);
