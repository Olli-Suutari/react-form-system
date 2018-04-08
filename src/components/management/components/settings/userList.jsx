import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { checkSession } from '../../../../actions/AuthenticationActions';
import { fetchUsers, deleteUser } from '../../../../actions/UserManagementActions';

class UserListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteConfirmModal: false,
            deleteSuccesModal: false,
            deleteConfirmationChecked: false,
            userToDelete: '',
        };
        this.checkUserSession = this.checkUserSession.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.deleteUserConfirmed = this.deleteUserConfirmed.bind(this);
        this.fetchUsersFunction = this.fetchUsersFunction.bind(this);
        // This binding is required for the deletebtn functionality.
        this.userListItem = this.userListItem.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
        this.toggleDeleteSuccess = this.toggleDeleteSuccess.bind(this);
        this.checkDeleteConfirm = this.checkDeleteConfirm.bind(this);
    }

    componentDidMount() {
        this.checkUserSession();
        this.fetchUsersFunction();
    }

    componentWillReceiveProps(nextProps) {
        // Display an alert according to update results.
        if (nextProps.userManagement.deleteUserStatus !== this.props.userManagement.deleteUserStatus) {
            if (nextProps.userManagement.deleteUserStatus === 2) {
                this.fetchUsersFunction();
                alert('There was an error in deletion of the user. If the user was removed from the list, there was an error in ' +
                    'creating a log entry for this action.');
            }
            else if (nextProps.userManagement.deleteUserStatus === 3) {
                this.fetchUsersFunction();
                this.setState({
                    deleteSuccesModal: true,
                });
            }
        }
    }

    checkDeleteConfirm() {
        this.setState({
            deleteConfirmationChecked: !this.state.deleteConfirmationChecked
        });
    }

    toggleDeleteConfirmModal() {
        this.setState({
            deleteConfirmationChecked: false,
            deleteConfirmModal: !this.state.deleteConfirmModal,
        });
    }

    toggleDeleteSuccess() {
        this.setState({
            deleteSuccesModal: !this.state.deleteSuccesModal,
        });
    }

    fetchUsersFunction() {
        const { dispatch } = this.props;
        dispatch(fetchUsers());
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    deleteUser(props) {
        this.setState({
            userToDelete: props.user.email,
            },
        // Callback to handleValidSubmit once setState is done for.
            this.toggleDeleteConfirmModal
        );
    }

    deleteUserConfirmed() {
        this.toggleDeleteConfirmModal();
        const toDelete = { userToDelete: this.state.userToDelete, userEmail: this.props.authentication.email };
        const { dispatch } = this.props;
        dispatch(deleteUser(toDelete));
    }

    userListItem(props) {
        const deleteUserBtn = this.deleteUser.bind(this, props);
        let deleteBtn = <Button color="danger" onClick={deleteUserBtn}>Poista</Button>;
        if (props.user.isAdmin)
        {
            deleteBtn = 'Admin';
        }
        return (
            <tr>
                <td>{props.user.email}</td>
                <td>{deleteBtn}</td>
            </tr>
        );
    }

    render() {
        const toggleConfirmDeleteBtn = this.toggleDeleteConfirmModal.bind(this);
        return (
            <div>
                <div>
                    <Table>
                        <tbody>
                        <tr>
                            <th>Email</th>
                            <th>Delete</th>
                        </tr>
                        {
                            this.props.userManagement.userList.map(user => (
                                <this.userListItem
                                    user={user}
                                    key={user.email}
                                />
                            ))
                        }
                        </tbody>
                    </Table>
                </div>
                <Modal isOpen={this.state.deleteConfirmModal} toggle={this.toggleDeleteConfirmModal}>
                    <ModalHeader className="confirm-delete">Confirm deletion</ModalHeader>
                    <br />
                    <ModalBody>
                        { this.state.userToDelete !== '' ?
                            <p>You are about to delete the following user: {this.state.userToDelete}</p> :
                            null }
                        <br />
                        <Form>
                            <FormGroup check onChange={this.checkDeleteConfirm.bind(this)}>
                                <Input type="checkbox" className="confirm-delete-checkbox" checked={this.state.deleteConfirmationChecked} />{' '}
                                <div style={{ marginLeft: 40 + 'px' }}>
                                    <strong>I am sure that I want to delete this user.</strong>
                                </div>
                                <br />
                            </FormGroup>
                            <br />
                            <Button color="info" onClick={toggleConfirmDeleteBtn}>Cancel</Button>
                            { this.state.deleteConfirmationChecked === true ?
                                <Button color="danger" style={{ float: 'right' }} onClick={this.deleteUserConfirmed}>Delete user
                                </Button> : <Button color="danger" style={{ float: 'right' }} disabled >Delete user</Button> }
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.deleteSuccesModal} toggle={this.toggleDeleteSuccess}>
                    <ModalHeader className="modal-success">Deletion success</ModalHeader>
                    <br />
                    <ModalBody><p>The user was removed successfully</p></ModalBody>
                    <ModalFooter className="modal-success">
                        <Button color="primary" onClick={this.toggleDeleteSuccess}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

UserListPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

UserListPage.contextTypes = {
    router: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        userManagement: state.userManagement,
    };
}

export default connect(mapStateToProps)(UserListPage);
