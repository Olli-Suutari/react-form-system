import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import TinyMCE from 'react-tinymce';
// Confirm dialogue
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
// Import actions
import { fetchDrafts, fetch20Drafts, fetch50Drafts, textSearch, fetchDraft, sendInstructionEmailRequest, deleteDraft }
    from '../../../actions/ManagementDraftActions';
import { checkSession } from '../../../actions/AuthenticationActions';
const FileSaver = require('file-saver');
const b64toBlob = require('b64-to-blob');

class DraftListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            organisation: '',
            members: '',
            title: '',
            description: '',
            heardFrom: '',
            fileName: '',
            fileData: '',
            cuid: '',
            draftsToFetch: '20',
            searchTerm: '',
            draftToDelete: '',
            scrollPosition: 0,
            modal: false,
            deleteConfirmModal: false,
            deleteConfirmationChecked: false,
            deleteSuccesModal: false,
        };
        // bound functions
        this.timeFormat = this.timeFormat.bind(this);
        this.toggleFetchRadioBtn = this.toggleFetchRadioBtn.bind(this);
        this.searchTermChanged = this.searchTermChanged.bind(this);
        this.fetchAllDrafts = this.fetchAllDrafts.bind(this);
        this.fetch20Drafts = this.fetch20Drafts.bind(this);
        this.fetch50Drafts = this.fetch50Drafts.bind(this);
        this.fetchDraftFunction = this.fetchDraftFunction.bind(this);
        this.DraftListItem = this.DraftListItem.bind(this);
        this.DraftList = this.DraftList.bind(this);
        this.handleupdateMailSent = this.handleupdateMailSent.bind(this);
        this.sendInstructionMailFunction = this.sendInstructionMailFunction.bind(this);
        this.downloadPdf = this.downloadPdf.bind(this);
        this.checkUserSession = this.checkUserSession.bind(this);
        this.fetchBySelectedQuantity = this.fetchBySelectedQuantity.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
        this.deleteDraft = this.deleteDraft.bind(this);
        this.deleteDraftConfirmed = this.deleteDraftConfirmed.bind(this);
        this.checkDeleteConfirm = this.checkDeleteConfirm.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDeleteSuccess = this.toggleDeleteSuccess.bind(this);
    }

    componentDidMount() {
        this.checkUserSession();
        const { dispatch } = this.props;
        dispatch(fetch20Drafts());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drafts.singleDraft !== this.props.drafts.singleDraft) {
            const newDate = this.timeFormat(new Date(nextProps.drafts.singleDraft.draft.dateAdded));
            this.setState({
                sentDate: newDate,
                name: nextProps.drafts.singleDraft.draft.name,
                email: nextProps.drafts.singleDraft.draft.email,
                organisation: nextProps.drafts.singleDraft.draft.organisation,
                members: nextProps.drafts.singleDraft.draft.members,
                title: nextProps.drafts.singleDraft.draft.title,
                description: nextProps.drafts.singleDraft.draft.description,
                heardFrom: nextProps.drafts.singleDraft.draft.heardFrom,
                fileName: nextProps.drafts.singleDraft.draft.fileName,
                fileData: nextProps.drafts.singleDraft.draft.fileData,
                cuid: nextProps.drafts.singleDraft.draft.cuid,
                modal: !this.state.modal,
            });
        }
        if (nextProps.drafts.sendInstructionsStatus !== this.props.drafts.sendInstructionsStatus) {
            if (nextProps.drafts.sendInstructionsStatus === 2)
            {
                alert('Sähköpostin lähettämisessä tapahtui virhe.');
            }
            if (nextProps.drafts.sendInstructionsStatus === 3)
            {
                confirmAlert({
                    title: '',
                    message: 'The email was sent to the address provided in the application.',
                    confirmLabel: 'OK',
                    cancelLabel: '',
                    onConfirm: () => { this.fetchBySelectedQuantity(); },
                });
            }
            document.body.style.cursor = 'default';
        }
        // Display an alert according to update results.
        if (nextProps.drafts.deleteDraftStatus !== this.props.drafts.deleteDraftStatus) {
            if (nextProps.drafts.deleteDraftStatus === 2) {
                this.fetchBySelectedQuantity();
                alert('There was an error in deleting the application. If it was removed from the list, the error happened in creating ' +
                    'a log entry for the deletion.');
            }
            else if (nextProps.drafts.deleteDraftStatus === 3) {
                this.fetchBySelectedQuantity();
                this.setState({
                    deleteSuccesModal: true,
                });
            }
        }
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    toggleFetchRadioBtn(event)
    {
        if (event.target.value === '20')
        {
            this.setState({
                draftsToFetch: '20'
                },
                this.fetchBySelectedQuantity
            );
        }
        else if (event.target.value === '50')
        {
            this.setState({
                draftsToFetch: '50'
                },
                this.fetchBySelectedQuantity
            );
        }
        else if (event.target.value === 'all')
        {
            this.setState({
                draftsToFetch: 'all'
            },
            this.fetchBySelectedQuantity
            );
        }
    }

    fetchBySelectedQuantity() {
        // Check session and reset possible search term.
        this.checkUserSession();
        this.setState({
            searchTerm: ''
        });
        if (this.state.draftsToFetch === '20') {
            this.fetch20Drafts();
        }
        else if (this.state.draftsToFetch === '50') {
            this.fetch50Drafts();
        }
        else if (this.state.draftsToFetch === 'all') {
            this.fetchAllDrafts();
        }
    }

    searchTermChanged(event) {
        this.setState({
            searchTerm: event.target.value
        });
        // If search is at least 3 chars long we will perform search.
        if (event.target.value.length > 2)
        {
            // If input is not changed in 0.25 s, perform the search.
            const search = event.target.value;
            setTimeout(function () {
                if (search === this.state.searchTerm) {
                    const { dispatch } = this.props;
                    dispatch(textSearch(search));
                }
            }.bind(this), 250);
        }
        // Re-fetch drafts if search is emptied.
        if (event.target.value.length === 0)
        {
            this.fetchBySelectedQuantity();
        }
    }

    fetchAllDrafts() {
        const { dispatch } = this.props;
        dispatch(fetchDrafts());
    }

    fetch20Drafts() {
        const { dispatch } = this.props;
        dispatch(fetch20Drafts());
    }

    fetch50Drafts() {
        const { dispatch } = this.props;
        dispatch(fetch50Drafts());
    }

    fetchDraftFunction(basicDetails) {
        // Pass cuid and logged in users email as data to fetchDraft.
        const draft = { cuid: basicDetails.cuid, userEmail: this.props.authentication.email };
        const { dispatch } = this.props;
        dispatch(fetchDraft(draft));
    }

    sendInstructionMailFunction(cuid) {
        const { dispatch } = this.props;
        dispatch(sendInstructionEmailRequest(cuid));
    }

    handleupdateMailSent(draft) {
        this.checkUserSession();
        confirmAlert({
            title: '',
            message: 'Are you sure you want to send the instructions email?',
            confirmLabel: 'Send',
            cancelLabel: 'Cancel',
            onConfirm: () => {
                document.body.style.cursor = 'wait';
                this.sendInstructionMailFunction(draft); },
        });
    }

    deleteDraft() {
        this.toggleDeleteConfirmModal();
    }

    checkDeleteConfirm() {
        this.setState({
            deleteConfirmationChecked: !this.state.deleteConfirmationChecked
        });
    }

    deleteDraftConfirmed() {
        this.toggleDeleteConfirmModal();
        const toDelete = { cuid: this.state.cuid, dateSent: this.state.sentDate, userEmail: this.props.authentication.email };
        const { dispatch } = this.props;
        dispatch(deleteDraft(toDelete));
    }

    toggle(basicDetails) {
        // We only fetch data if we are opening the modal, not closing it.
        if (!this.state.modal)
        {
            this.checkUserSession();
            this.setState({
                scrollPosition: window.pageYOffset
            });
            // This will also toggle the modal.
            this.fetchDraftFunction(basicDetails.draft);
        }
        else
        {
            this.setState({
                modal: !this.state.modal,
            });
            window.scrollTo(0, this.state.scrollPosition);
        }
    }

    toggleDeleteConfirmModal() {
        this.setState({
            deleteConfirmationChecked: false,
            deleteConfirmModal: !this.state.deleteConfirmModal,
        });
        window.scrollTo(0, this.state.scrollPosition);
    }

    toggleDeleteSuccess() {
        this.setState({
            deleteSuccesModal: !this.state.deleteSuccesModal,
            modal: !this.state.modal,
        });
        window.scrollTo(0, this.state.scrollPosition);
    }

    // Generates a .pdf file from base64 and downloads it.
    downloadPdf = function (base64Data, fileName) {
        const blob = b64toBlob(base64Data, 'application/pdf');
        FileSaver.saveAs(blob, fileName);
    };
    // Formats date as dd.mm.yyyy hh:mm
    // https://stackoverflow.com/questions/19346405/jquery-how-to-get-hhmmss-from-date-object
    timeFormat(d) {
        // Get dd.mm.yyyy hh:mm
        // January = 0.
        const days = (d.getDate());
        const months = (d.getMonth() + 1);
        const years = (d.getFullYear());
        const hours = this.formatTwoDigits(d.getHours());
        const minutes = this.formatTwoDigits(d.getMinutes());
        return days + '.' + months + '.' + years + ' ' + hours + ':' + minutes;
    }
    // Add 0 to h/m inputs if number is less than 10.
    formatTwoDigits(n) {
        return n < 10 ? '0' + n : n;
    }
    // DRAFT LIST ITEM
     DraftListItem(props) {
        // Note: If we try to assign prop.draft.dateAddded to equal newDate we get NAN on opening modal.
        const newDate = this.timeFormat(new Date(props.draft.dateAdded));
        // let clickTitleToOpenModal = this.toggle.bind(this, props.draft, newDate);
        const clickTitleToOpenModal = this.toggle.bind(this, props);
        const clickSendMailBtn = this.handleupdateMailSent.bind(this, props);
        // Lets check if instructions email is already sent, if not create a button.
         //               <td><a href="#" onClick={clickTitleToOpenModal}>{title}</a></td>
        let mailInfo = 'Sent';
        if (!props.draft.checkedMailSent)
        {
            mailInfo = <Button color="info" onClick={clickSendMailBtn}>Send</Button>;
        }
        return (
            <tr>
                <td><a href="#" target="_self" onClick={clickTitleToOpenModal}>{props.draft.title}</a></td>
                <td>{props.draft.name}</td>
                <td>{newDate}</td>
                <td>{mailInfo}</td>
            </tr>
        );
    }

     DraftList() {
         const { drafts } = this.props;
         // let deleteDraftBtn = this.deleteDraft.bind(this, this.state);
         let deleteBtn = '';
         if (this.props.authentication.isAdmin)
         {
             deleteBtn = (<Button color="danger" size="sm" style={{ marginTop: '10' + 'px' }}
                                 onClick={this.deleteDraft}>Delete application</Button>);
         }
      return (
        <div>
          <Table>
            <tbody>
            <tr className="table-title">
              <th>Title</th>
              <th>Sender</th>
              <th>Sent</th>
              <th>Email</th>
            </tr>
            {
                drafts.data.map(draft => (
                    <this.DraftListItem
                        draft={draft}
                        key={draft.cuid}
                    />
                ))
            }
            </tbody>
          </Table>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg always-lg" backdrop="static">
                <ModalHeader toggle={this.toggle}>Application details</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Sent: {this.state.sentDate}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sender: {this.state.name}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Email: {this.state.email}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Organisation or trade: {this.state.organisation}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Team size: {this.state.members} members</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Title: {this.state.title}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Description:</Label>
                            <TinyMCE
                                content={this.state.description}
                                config={{
                                    plugins: 'autoresize',
                                    autoresize_bottom_margin: 15,
                                    width: '100%',
                                    readonly: true,
                                    menubar: false,
                                    statusbar: false,
                                    toolbar: false,
                                    branding: false
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Heard from: {this.state.heardFrom} </Label>
                        </FormGroup>
                        <FormGroup>
                            {this.state.fileName &&
                            <p className="p-as-btn" onClick={() => this.downloadPdf(this.state.fileData,
                                this.state.fileName)} >{'Download: ' + this.state.fileName}</p>
                            }
                            {!this.state.fileName &&
                            <Label>The application has no attachment.</Label>
                            }
                        </FormGroup>
                        {deleteBtn}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
      );
    }
  render() {
        const toggleConfirmDeleteBtn = this.toggleDeleteConfirmModal.bind(this);
        return (
          <div>
              <FormGroup tag="fieldset" inline onChange={this.toggleFetchRadioBtn.bind(this)}>
                  <Label style={{ marginRight: '15' + 'px' }}><strong>Show:</strong></Label>
                      <Label check style={{ marginRight: '10' + 'px' }}>
                          <Input type="radio" name="radio1" value="20" defaultChecked />{' '}
                          20
                      </Label>
                      <Label check style={{ marginRight: '10' + 'px' }}>
                          <Input type="radio" name="radio1" value="50" />{' '}
                          50
                      </Label>
                      <Label check>
                          <Input type="radio" name="radio1" value="all" />{' '}
                          All
                      </Label>
              </FormGroup>
              <FormGroup onChange={this.searchTermChanged.bind(this)}>
              <Label><strong>Search by title or sender</strong></Label>
                  <Input type="text" value={this.state.searchTerm} placeholder="Write at least 3 characters" />{' '}
              </FormGroup>
              <this.DraftList />
              <Modal isOpen={this.state.deleteConfirmModal} toggle={this.toggleDeleteConfirmModal}>
                  <ModalHeader className="confirm-delete">Confirm deletion</ModalHeader>
                  <br />
                  <ModalBody>
                      { this.state.userToDelete !== '' ?
                          <p>You are about to remove an application sent by {this.state.name} are you sure you want to delete it?</p> :
                          null }
                      <br />
                      <Form>
                          <FormGroup check onChange={this.checkDeleteConfirm.bind(this)}>
                              <Input type="checkbox" className="confirm-delete-checkbox" checked={this.state.deleteConfirmationChecked} />{' '}
                              <div style={{ marginLeft: 40 + 'px' }}>
                                  <strong>I am sure that I want to delete this application.</strong>
                              </div>
                              <br />
                          </FormGroup>
                          <br />
                          <Button color="info" onClick={toggleConfirmDeleteBtn}>Cancel</Button>
                          { this.state.deleteConfirmationChecked === true ?
                              <Button color="danger" style={{ float: 'right' }} onClick={this.deleteDraftConfirmed}>Delete application
                              </Button> : <Button color="danger" style={{ float: 'right' }} disabled >Delete application</Button> }
                      </Form>
                  </ModalBody>
              </Modal>
              <Modal isOpen={this.state.deleteSuccesModal} toggle={this.toggleDeleteSuccess}>
                  <ModalHeader className="modal-success">Success</ModalHeader>
                  <br />
                  <ModalBody><p>The application was successfully deleted.</p></ModalBody>
                  <ModalFooter className="modal-success">
                      <Button color="primary" onClick={this.toggleDeleteSuccess}>OK</Button>
                  </ModalFooter>
              </Modal>
          </div>
    );
  }
}

DraftListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

DraftListPage.contextTypes = {
  router: PropTypes.object,
};

function mapStateToProps(store) {
    return {
        authentication: store.authentication,
    };
}

export default connect(mapStateToProps)(DraftListPage);
