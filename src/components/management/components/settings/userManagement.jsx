import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RegisterPage from './RegisterPage';
import UserListPage from './userList';

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserListModalVisible: false,
            deleteSuccesModal: false,
        };
        this.toggleUserListModal = this.toggleUserListModal.bind(this);
    }

    toggleUserListModal() {
        // We only fetch data if we are opening the modal, not closing it.
        this.setState({
            isUserListModalVisible: !this.state.isUserListModalVisible
        });
    }

    render() {
        const { userManagement } = this.props;
        return (
            <div>
                <p className="settings-category">Users</p>
                <div>
                    <RegisterPage />
                </div>
                <Button color="primary" onClick={this.toggleUserListModal}>List of users</Button>
                <Modal isOpen={this.state.isUserListModalVisible} toggle={this.toggleUserListModal} backdrop="static">
                    <ModalHeader toggle={this.toggleUserListModal}>List of users</ModalHeader>
                    <ModalBody>
                        <div>
                            <br />
                            <UserListPage userManagement={userManagement} />
                        </div>
                    </ModalBody>
                    <br />
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggleUserListModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

// Retrieve data from store as props
function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        userManagement: state.userManagement,
    };
}

UserManagement.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps)(UserManagement);
