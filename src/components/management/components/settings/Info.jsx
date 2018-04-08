import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, Label, ModalBody, ModalFooter } from 'reactstrap';
import TinyMCE from 'react-tinymce';
// Import actions
import { checkSession } from '../../../../actions/AuthenticationActions';
import { fetchInfo, updateInfo } from '../../../../actions/InfoActions';

class InfoManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormInfoModalVisible: false,
            isEmailInfoModalVisible: false,
            isTermsModalVisible: false,
            infoTextFi: '',
            infoTextEn: '',
            emailInfoFi: '',
            emailInfoEn: '',
            termsEn: '',
            termsFi: '',
            infoSuccesModal: false,
        };
        this.checkUserSession = this.checkUserSession.bind(this);
        this.fetchInfoFunction = this.fetchInfoFunction.bind(this);
        this.handleInputFiInfo = this.handleInputFiInfo.bind(this);
        this.handleInputEnInfo = this.handleInputEnInfo.bind(this);
        this.handleEmailInfoInput = this.handleEmailInfoInput.bind(this);
        this.handleInputTermsFi = this.handleInputTermsFi.bind(this);
        this.handleInputTermsEn = this.handleInputTermsEn.bind(this);
        this.toggleFormInfoModal = this.toggleFormInfoModal.bind(this);
        this.toggleEmailnfoModal = this.toggleEmailnfoModal.bind(this);
        this.toggleTermsModal = this.toggleTermsModal.bind(this);
        this.changeInfo = this.changeInfo.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
    }

    componentWillMount() {
        this.checkUserSession();
    }

    componentDidMount() {
        this.fetchInfoFunction();
    }

    componentWillReceiveProps(nextProps) {
        // Display an alert according to update results.
        if (nextProps.infos.infoUpdateStatus !== this.props.infos.infoUpdateStatus) {
            if (nextProps.infos.infoUpdateStatus === 2) {
                alert('Something went wrong, please try again.');
                window.location.reload(true);
            }
            else if (nextProps.infos.infoUpdateStatus === 3) {
                this.setState({
                    infoSuccesModal: true,
                });
            }
        }
    }

    checkUserSession() {
        const { dispatch } = this.props;
        dispatch(checkSession());
    }

    fetchInfoFunction() {
        const { dispatch } = this.props;
        dispatch(fetchInfo());
    }

    handleInputFiInfo(e) {
        this.setState({
            infoTextFi: e.target.getContent()
        });
    }

    handleInputEnInfo(e) {
        this.setState({
            infoTextEn: e.target.getContent()
        });
    }

    handleInputTermsFi(e) {
        this.setState({
            termsFi: e.target.getContent()
        });
    }

    handleInputTermsEn(e) {
        this.setState({
            termsEn: e.target.getContent()
        });
    }

    handleEmailInfoInput() {
        this.setState({ emailInfoFi: this.refs.emailInfoFi.value });
        this.setState({ emailInfoEn: this.refs.emailInfoEn.value });
    }

    toggleFormInfoModal() {
        this.checkUserSession();
        // We only fetch data if we are opening the modal, not closing it.
        if (!this.state.isFormInfoModalVisible)
        {
            const { infos } = this.props;
            this.setState({
                infoTextFi: infos.data.infoFi,
                infoTextEn: infos.data.infoEn,
                emailInfoFi: infos.data.emailInfoFi,
                emailInfoEn: infos.data.emailInfoEn,
                termsFi: infos.data.termsFi,
                termsEn: infos.data.termsEn,
            });
        }
        this.setState({
            isFormInfoModalVisible: !this.state.isFormInfoModalVisible
        });
    }

    toggleEmailnfoModal() {
        this.checkUserSession();
        if (!this.state.isEmailInfoModalVisible)
        {
            const { infos } = this.props;
            this.setState({
                infoTextFi: infos.data.infoFi,
                infoTextEn: infos.data.infoEn,
                emailInfoFi: infos.data.emailInfoFi,
                emailInfoEn: infos.data.emailInfoEn,
                termsFi: infos.data.termsFi,
                termsEn: infos.data.termsEn,
            });
        }
        this.setState({
            isEmailInfoModalVisible: !this.state.isEmailInfoModalVisible
        });
    }

    toggleTermsModal() {
        this.checkUserSession();
        if (!this.state.isTermsModalVisible)
        {
            const { infos } = this.props;
            this.setState({
                infoTextFi: infos.data.infoFi,
                infoTextEn: infos.data.infoEn,
                emailInfoFi: infos.data.emailInfoFi,
                emailInfoEn: infos.data.emailInfoEn,
                termsFi: infos.data.termsFi,
                termsEn: infos.data.termsEn,
            });
        }
        this.setState({
            isTermsModalVisible: !this.state.isTermsModalVisible
        });
    }

    toggleNested() {
        this.setState({
            infoSuccesModal: !this.state.infoSuccesModal,
        });
    }

    changeInfo() {
        this.checkUserSession();
        const formData = this.state;
        // Method to update info
        const { dispatch } = this.props;
        if (this.state.infoTextFi !== '' || this.state.infoTextEn !== '' || this.state.emailInfoFi !== '' || this.state.emailInfoEn
            || this.state.termsFi !== '' || this.state.termsEn) {
            dispatch(updateInfo(formData));
            // TO DO: Close both modals.
            // this.toggleFormInfoModal();
            this.setState({
                isFormInfoModalVisible: false,
                isEmailInfoModalVisible: false,
                isTermsModalVisible: false,
            });
            this.fetchInfoFunction();
        }
        else {
            alert('Ohjeet eivät olla täysin tyhjiä, tarkista kentät ja yritä uudestaan.');
        }
    }

    // This renders buttons for opening editors for updating form/mail instructions.
    // We are actually passing both infos to both modals and just re-save the existing data
    // to avoid needing to create own save functions for each.
    // TO DO: Create own save functions for saving/getting info data from db?
    render() {
        return (<div>
            <p className="settings-category">Edit instructions</p>
            <div>
                <Button color="primary" style={{ marginBottom: +'15' + 'px' }}
                        onClick={this.toggleFormInfoModal}>Application instructions</Button>
            </div>
            <div>
            <Button color="primary" style={{ marginBottom: +'15' + 'px' }}
                    onClick={this.toggleEmailnfoModal}>Email instructions</Button>
            </div>
            <Button color="primary" onClick={this.toggleTermsModal}>Terms & conditions</Button>
            <Modal className="modal-lg" isOpen={this.state.isFormInfoModalVisible} toggle={this.toggleFormInfoModal} backdrop="static">
                <ModalHeader toggle={this.toggleFormInfoModal}>Application instructions</ModalHeader>
                <ModalBody>
                    <div>
                        <Label className="settings-category">Instructions in Finnish</Label>
                        <TinyMCE
                            content={this.state.infoTextFi}
                            config={{
                                language_url: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
                                language: 'en_GB',
                                plugins: 'autolink link autoresize lists textcolor',
                                toolbar1: 'bold italic underline forecolor fontsizeselect link',
                                toolbar2: 'undo redo alignleft aligncenter alignright alignjustify outdent indent',
                                fontsize_formats: '12pt 13pt 14pt 16pt 20pt',
                                textcolor_cols: '5',
                                autoresize_bottom_margin: 25,
                                menubar: false,
                                statusbar: false,
                                branding: false,
                            }}
                            onChange={this.handleInputFiInfo}
                        />
                        <br />
                        <Label className="settings-category">Instructions in English</Label>
                        <TinyMCE
                            content={this.state.infoTextEn}
                            config={{
                                language_url: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
                                language: 'en_GB',
                                plugins: 'autolink link autoresize lists textcolor',
                                toolbar1: 'bold italic underline forecolor fontsizeselect link',
                                toolbar2: 'undo redo alignleft aligncenter alignright alignjustify outdent indent',
                                fontsize_formats: '12pt 13pt 14pt 16pt 20pt',
                                textcolor_cols: '5',
                                autoresize_bottom_margin: 25,
                                menubar: false,
                                statusbar: false,
                                branding: false,
                            }}
                            onChange={this.handleInputEnInfo}
                        />
                    </div>
                    <br />
                    <Button color="info" onClick={this.toggleFormInfoModal}>Cancel</Button>
                    <Button color="success" onClick={this.changeInfo}>Save</Button>
                    <br />
                </ModalBody>
            </Modal>
            <Modal className="modal-lg" isOpen={this.state.isEmailInfoModalVisible} toggle={this.toggleEmailnfoModal} backdrop="static">
                <ModalHeader toggle={this.toggleEmailnfoModal}>Email instructions</ModalHeader>
                <ModalBody>
                    <div>
                        <div>
                            <Label className="settings-category">Email instructions in Finnish</Label>
                            <textarea value={this.state.emailInfoFi} className="form-field"
                                      onChange={this.handleEmailInfoInput} ref="emailInfoFi" />
                            <Label className="settings-category">Email instructions in English</Label>
                            <textarea value={this.state.emailInfoEn} className="form-field"
                                      onChange={this.handleEmailInfoInput} ref="emailInfoEn" />
                        </div>
                    </div>
                    <br />
                    <Button color="info" onClick={this.toggleEmailnfoModal}>Cancel</Button>
                    <Button color="success" onClick={this.changeInfo}>Save</Button>
                    <br />
                </ModalBody>
            </Modal>
            <Modal className="modal-lg always-lg" isOpen={this.state.isTermsModalVisible} toggle={this.toggleTermsModal} backdrop="static">
                <ModalHeader toggle={this.toggleTermsModal}>Terms & conditions</ModalHeader>
                <ModalBody>
                    <div>
                        <Label className="settings-category">Terms & conditions in Finnish</Label>
                        <TinyMCE
                            content={this.state.termsFi}
                            config={{
                                language_url: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
                                language: 'en_GB',
                                plugins: 'autolink link autoresize lists textcolor',
                                toolbar1: 'bold italic underline forecolor fontsizeselect link',
                                toolbar2: 'undo redo alignleft aligncenter alignright alignjustify outdent indent',
                                fontsize_formats: '12pt 13pt 14pt 16pt 20pt',
                                textcolor_cols: '5',
                                autoresize_bottom_margin: 25,
                                menubar: false,
                                statusbar: false,
                                branding: false,
                            }}
                            onChange={this.handleInputTermsFi}
                        />
                        <br />
                        <Label className="settings-category">Terms & conditions in English</Label>
                        <TinyMCE
                            content={this.state.termsEn}
                            config={{
                                language_url: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
                                language: 'en_GB',
                                plugins: 'autolink link autoresize lists textcolor',
                                toolbar1: 'bold italic underline forecolor fontsizeselect link',
                                toolbar2: 'undo redo alignleft aligncenter alignright alignjustify outdent indent',
                                fontsize_formats: '12pt 13pt 14pt 16pt 20pt',
                                textcolor_cols: '5',
                                autoresize_bottom_margin: 25,
                                menubar: false,
                                statusbar: false,
                                branding: false,
                            }}
                            onChange={this.handleInputTermsEn}
                        />
                    </div>
                    <br />
                    <Button color="info" onClick={this.toggleTermsModal}>Cancel</Button>
                    <Button color="success" onClick={this.changeInfo}>Save</Button>
                    <br />
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.infoSuccesModal} toggle={this.toggleNested}>
                <ModalHeader>Update success</ModalHeader>
                <br />
                <ModalBody><p>The information was updated successfully.</p></ModalBody>
                <br />
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleNested}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

// actions required to provide data for this component to render in sever side.
InfoManagement.need = [() => { return fetchInfo(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
    return {
        infos: state.infos,
    };
}

InfoManagement.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


InfoManagement.contextTypes = {
    router: PropTypes.object,
};

export default connect(mapStateToProps)(InfoManagement);
