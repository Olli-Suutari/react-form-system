import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Navbar, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
// Import Components
import Drafts from './components/DraftList';
import SettingsManagement from './components/settings/Settings';
import { checkSession, logUserOut } from '../../actions/AuthenticationActions';
import accountIcon from './person.svg';

export class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSettingsModalVisible: false,
            timeout: setTimeout(function () { this.logUserOutFunction(); }.bind(this), 3570000),
        };
        this.checkUserSession = this.checkUserSession.bind(this);
        this.logUserOutFunction = this.logUserOutFunction.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    }

    componentWillMount() {
        this.checkUserSession();
    }

    componentDidMount() {
        document.title = 'Management page';
        // Set timeout, reload reset timer on key/mouse/ touch events
        // Based on: https://stackoverflow.com/questions/667555/detecting-idle-time-in-javascript-elegantly
        window.onload = this.resetTimer;
        document.onmousemove = this.resetTimer;
        document.onkeypress = this.resetTimer;
        document.onmousedown = this.resetTimer; // touchscreen presses
        document.ontouchstart = this.resetTimer;
        document.onclick = this.resetTimer; // touchpad clicks
        document.onscroll = this.resetTimer; // scrolling with arrow keys
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.authentication.isLoggedIn)
        {
            window.location = '/management/login';
        }
    }

    resetTimer()
    {
        // The session will expire after an hour of inactivity (3600000 ms) This is also coded on app.js,
        // lets log user out at 59.5 minutes to avoid needing to resolt to session timing out in app.js
        clearTimeout(this.state.timeout);
        this.state.timeout = setTimeout(function () { this.logUserOutFunction(); }.bind(this), 3570000);
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    logUserOutFunction() {
        const { dispatch } = this.props;
        dispatch(logUserOut());
    }

    toggleSettingsModal() {
        this.setState({
            isSettingsModalVisible: !this.state.isSettingsModalVisible
        });
    }

    render() {
        if (!this.props.authentication.isLoggedIn)
        {
            return (
                <div className="redirect">
                    <h2>Loading...</h2>
                </div>
            );
        }
        const { drafts } = this.props;
        const { email } = this.props.authentication;
        return (
            <div className="container">
                <br />
                <Navbar color="faded" light expand="md">
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown>
                                <DropdownToggle>
                                    <img src={accountIcon} style={{ width: 24 + 'px', height: 24 + 'px' }} alt="Menu" />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem disabled>{email}</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={this.logUserOutFunction}> <a href="#" target="_self">Log out</a>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={this.toggleSettingsModal}> <a href="#" target="_self">Settings</a>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                </Navbar>
                <Drafts drafts={drafts} />
                <Modal isOpen={this.state.isSettingsModalVisible} toggle={this.toggleSettingsModal} backdrop="static">
                    <ModalHeader toggle={this.toggleSettingsModal}>Settings</ModalHeader>
                    <ModalBody>
                        <SettingsManagement />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggleSettingsModal}>Close</Button>
                    </ModalFooter>
                </Modal>
              </div>
        );
    }
}

Management.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
    return {
        drafts: store.draftManagement,
        authentication: store.authentication,
        userManagement: store.userManagement,
    };
}

export default connect(mapStateToProps)(Management);
