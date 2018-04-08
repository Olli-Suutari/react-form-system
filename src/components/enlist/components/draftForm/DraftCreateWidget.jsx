import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import TinyMCE from 'react-tinymce';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalFooter, Alert } from 'reactstrap';
import Formsy from 'formsy-react';
import FormsyInput from '../../../../shared/formsy';
import { addDraft } from '../../../../actions/EnlistDraftActions';
import SentDraftDetails from './SentDraftDetails';
import TermsModal from './Terms';

export class DraftCreateWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            emailVerification: '',
            organisation: '',
            members: '',
            membersValid: false,
            title: '',
            description: '',
            descriptionPristine: true,
            descriptionValid: false,
            heardFrom: '',
            fileName: '',
            fileData: '',
            captcha: '',
            accepted: [],
            rejected: [],
            submitBtnEnable: true,
            formsyValidationIsValid: false,
            showTermsModal: false,
            showSentFormModal: false,
            termsChecked: false,
            tinyMCELang: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
            tinyMCELocale: 'en-GB',
            alertVisible: false,
            alertText: '',
        };
        this.formsyValidationErrors = this.formsyValidationErrors.bind(this);
        this.formsyValidationOK = this.formsyValidationOK.bind(this);
        this.membersEdited = this.membersEdited.bind(this);
        this.descriptionEdited = this.descriptionEdited.bind(this);
        this.removeAttachment = this.removeAttachment.bind(this);
        this.toggleTerms = this.toggleTerms.bind(this);
        this.acceptTerms = this.acceptTerms.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onResolved = this.onResolved.bind(this);
        this.triggerFormSend = this.triggerFormSend.bind(this);
        this.compileFormData = this.compileFormData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // Change TinyMCE language
        // See: https://github.com/Olli-Suutari/tinyMCE-4-translations
        // Also change the html lang.
        if (nextProps.intl.locale !== this.props.intl.locale)
        {
            if (nextProps.intl.locale === 'en')
            {
                this.setState({
                    tinyMCELang: 'https://olli-suutari.github.io/tinyMCE-4-translations/en_GB.js',
                    tinyMCELocale: 'en_GB',
                });
                document.documentElement.lang = 'en-GB';
            }
            else if (nextProps.intl.locale === 'fi')
            {
                this.setState({
                    tinyMCELang: 'https://olli-suutari.github.io/tinyMCE-4-translations/fi.js',
                    tinyMCELocale: 'fi',
                });
                document.documentElement.lang = 'fi';
            }
        }
        if (nextProps.draft.sendDraftStatus !== this.props.draft.sendDraftStatus)
        {
            if (nextProps.draft.sendDraftStatus === 2) {
                this.setState({
                    alertVisible: true,
	                submitBtnEnable: true,
                    alertText: <FormattedMessage id="submitError" />
                });
            }
            else if (nextProps.draft.sendDraftStatus === 3) {
                this.toggle();
            }
        }
    }

    onSubmit() {
	    const matchPadding = /padding-left: \d\d\d/;
        // Show alert if over 75k len in description.
        if (this.state.description.length > 75000)
        {
            this.setState({
                alertVisible: true,
                alertText: (this.props.intl.messages.descriptionTooLong + ' (' + this.state.description.length + ')')
            });
        }
        else
        {
	        // If padding is more than 99, replace it with 80 (max 4 idents)
	        if (this.state.description.match(matchPadding)) {
		        console.log(this.state.description);
		        this.setState({
			        description: this.state.description.replace(matchPadding, 'padding-left: 80'),
		        });
		        console.log(this.state.description);
	        }
            this.setState({
                submitBtnEnable: false
            });
            this.ReCAPTCHA.execute();
        }
    }

    onResolved(value) {
        this.setState({
            captcha: value
        });
        this.triggerFormSend();
    }

    onDismissAlert() {
        this.setState({ alertVisible: false });
    }

	acceptTerms() {
		this.setState({
			termsChecked: !this.state.termsChecked
		});
	}

	removeAttachment() {
		this.setState({
			fileName: '',
			fileData: '',
			accepted: [],
			rejected: [],
		});
	}

	triggerFormSend() {
		// Set states from fields that use formsy.
		const formsyValues = this.refs.form.getModel();
		this.setState({
				name: formsyValues.name,
				email: formsyValues.email,
				emailVerification: formsyValues.emailVerification,
				organisation: formsyValues.organisation,
				title: formsyValues.title,
				heardFrom: formsyValues.heardFrom,
			},
			// Callback to compileFormData once setState is done for.
			this.compileFormData
		);
		// Reset the reCaptcha < Here to avoid timeouts if modal is not closed.
		this.ReCAPTCHA.reset();
	}

	// Send form
	compileFormData() {
		const { dispatch } = this.props;
		const formData = this.state;
		// Send form data
		dispatch(addDraft(formData));
	}

	toggleTerms() {
		// If opening, show details.
		this.setState({
			showTermsModal: !this.state.showTermsModal,
		});
		// Scroll to the bottom of the page.
		window.scrollTo(0, document.body.scrollHeight);
	}

	toggle() {
		// If opening, show details.
		if (!this.state.showSentFormModal) {
			this.setState({
				showSentFormModal: !this.state.showSentFormModal,
			});
		}
		// If closing, reset form.
		else {
			this.setState({
				showSentFormModal: !this.state.showSentFormModal,
				name: '',
				email: '',
				emailVerification: '',
				organisation: '',
				members: '',
				membersValid: false,
				title: '',
				description: '',
				descriptionPristine: true,
				descriptionValid: false,
				heardFrom: '',
				termsChecked: false,
				submitBtnEnable: true,
				alertVisible: false,
				fileName: '',
				fileData: '',
				accepted: [],
				rejected: [],
			});
			// Reset tinyMCE and formsy fields.
			// TO DO: Reset formatting settings.
			tinymce.EditorManager.get('description').setContent(''); // eslint-disable-line
			this.refs.form.reset();
			// Scroll to the top of the page.
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
	}

	formsyValidationErrors() {
		this.setState({ formsyValidationIsValid: false });
	}

	formsyValidationOK() {
		this.setState({ formsyValidationIsValid: true });
	}

	membersEdited(e) {
		if (e.target.value === 'default')
		{
			this.setState({
				membersValid: false,
			});
		}
		else
		{
			this.setState({
				members: e.target.value,
				membersValid: true,
			});
		}
	}

	descriptionEdited(e) {
		// New row for example adds two characters, lets make the limit 15 to make sure we get at least 10 min.
		const textLen = e.target.getContent({ format: 'text' }).length;
		this.setState({
			description: e.target.getContent(),
			descriptionPristine: false,
		});
		if (textLen > 14)
		{
			this.setState({ descriptionValid: true });
		}
		else {
			// If we set the state to match invalidInput the error text will be shown in the UI.
			this.setState({ descriptionValid: false, });
		}
	}

	render() {
        const dropzoneActiveStyle = {
            border: '2px solid #ced4da',
        };

        const langUrl = this.state.tinyMCELang;
        const langLocale = this.state.tinyMCELocale;
        return (
            <div className="form">
              <Formsy onValid={this.formsyValidationOK} ref="form" onInvalid={this.formsyValidationErrors}>
                <FormGroup>
                  <Label for="name"><FormattedMessage id="draftSenderName" /> *</Label>
                    <FormsyInput
                        name="name"
                        validations={{
                            matchRegexp: /[\S]+[\s]+[\S]/,
                            maxLength: 80
                        }}
                        validationErrors={{
                            matchRegexp: <FormattedMessage id="draftSenderNameInvalid" />,
                            maxLength: <FormattedMessage id="inputTooLong" />
                        }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="email"><FormattedMessage id="draftSenderEmail" /> *</Label>
                    <FormsyInput
                        name="email"
                        validations={{
                            isEmail: true,
                            maxLength: 80
                        }}
                        validationErrors={{
                            isEmail: <FormattedMessage id="draftSenderEmailInvalid" />,
                            maxLength: <FormattedMessage id="inputTooLong" />
                        }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="emailVerification"><FormattedMessage id="draftSenderConfirmEmail" /> *</Label>
                    <FormsyInput
                        name="emailVerification"
                        validations="equalsField:email"
                        validationError={<FormattedMessage id="draftSenderConfirmEmailInvalid" />}
                        required
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="organisation"><FormattedMessage id="draftSenderOrganisation" /> *</Label>
                    <FormsyInput
                        name="organisation"
                        validations={{
                            minLength: 5,
                            maxLength: 90
                        }}
                        validationErrors={{
                            minLength: <FormattedMessage id="draftSenderOrganisationInvalid" />,
                            maxLength: <FormattedMessage id="inputTooLong" />
                        }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="members"><FormattedMessage id="draftMembers" /> *</Label>
                    <Input type="select" name="select" id="draftMembers" onChange={this.membersEdited} value={this.state.members}>
                        <option value="default">{this.props.intl.messages.draftMembersDefault}</option>
                        <option value="2">2 {this.props.intl.messages.persons}</option>
                        <option value="3">3 {this.props.intl.messages.persons}</option>
                        <option value="4">4 {this.props.intl.messages.persons}</option>
                        <option value="5">5 {this.props.intl.messages.persons}</option>
                        <option value="6">6 {this.props.intl.messages.persons}</option>
                        <option value="7">7 {this.props.intl.messages.persons}</option>
                        <option value="8">8 {this.props.intl.messages.persons}</option>
                        <option value="9">9 {this.props.intl.messages.persons}</option>
                        <option value="10">10 {this.props.intl.messages.persons}</option>
                        <option value="+10">+10 {this.props.intl.messages.persons}</option>
                    </Input>
                    {!this.state.membersValid ? <p style={{ color: ' red' }}>
                        <FormattedMessage id="draftMembersInvalid" /> </p> : null}
                </FormGroup>
                <FormGroup>
                  <Label for="title"><FormattedMessage id="draftTitle" /> *</Label>
                    <FormsyInput
                        name="title"
                        validations={{
                            minLength: 5,
                            maxLength: 90
                        }}
                        validationErrors={{
                            minLength: <FormattedMessage id="draftTitleInvalid" />,
                            maxLength: <FormattedMessage id="inputTooLong" />
                        }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="description"><FormattedMessage id="draftDescription" /> *</Label>
                    <TinyMCE
                        id="description"
                        content={this.state.description}
                        config={{
                            language_url: langUrl,
                            language: langLocale,
                            plugins: 'autolink link autoresize lists textcolor',
                            toolbar1: 'bold italic underline forecolor fontsizeselect link',
                            toolbar2: 'undo redo alignleft aligncenter alignright alignjustify outdent indent',
                            fontsize_formats: '11pt 12pt 13pt 15pt',
                            textcolor_cols: '5',
                            autoresize_bottom_margin: 50,
                            menubar: false,
                            statusbar: false,
                            branding: false,
                        }}
                        onChange={this.descriptionEdited}
                    />
                    {!this.state.descriptionValid && !this.state.descriptionPristine ? <p style={{ color: ' red' }}>
                        <FormattedMessage id="draftDescriptionInvalid" /></p> : null}
                </FormGroup>
                <FormGroup>
                  <Label for="heardFrom"><FormattedMessage id="draftHeardFrom" /> *</Label>
                    <FormsyInput
                        name="heardFrom"
                        validations={{
                            minLength: 4,
                            maxLength: 90
                        }}
                        validationErrors={{
                            minLength: <FormattedMessage id="draftHeardFromInvalid" />,
                            maxLength: <FormattedMessage id="inputTooLong" />
                        }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    {/* Dropzone: Max 10 MB (10485760 bytes), single pdf file. Since we convert file to base 64,
                        the size may increases by up to 30%, max single document size for MongoDB is 16 MB. */}
                  <section>
                    <Label for="draftPdfLabel"><FormattedMessage id="draftPdfLabel" /> (max 10 mb)</Label>
                    <div className="dropzone">
                      <Dropzone
                          accept="application/pdf"
                          multiple={false}
                          maxSize={10485760}
                          activeStyle={dropzoneActiveStyle}
                          onDrop={(accepted, rejected) => {
                              if (accepted.length > 0 || rejected.length > 0) {
                                  this.setState({ accepted, rejected });
                              }
                              /* If the file is accepted, convert it to base64 */
                              if (accepted.length > 0)
                              {
                                  // Disable submit button while uploading file
                                  this.setState({
                                      submitBtnEnable: false,
                                      alertVisible: false,
                                  });
                                  const promise = new Promise((resolve, reject) => {
                                      document.body.style.cursor = 'wait';
                                      const reader = new FileReader();
                                      reader.readAsDataURL(accepted[0]);
                                      reader.onload = () => {
                                          if (reader.result) {
                                              resolve(reader.result);
                                          }
                                          else {
                                              reject(Error('Failed converting to base64'));
                                          }
                                      };
                                  });
                                  promise.then((result) => {
                                      const promise2 = new Promise((resolve) => {
                                          const base64String = result.substr(28);
                                          resolve(this.setState({
                                              fileName: accepted[0].name,
                                              fileData: base64String
                                          }));
                                      });
                                      promise2.then(() => {
                                          document.body.style.cursor = 'default';
                                          this.setState({
                                              submitBtnEnable: true
                                          });
                                      });
                                      // TO DO: result includes: data:application/pdf;base64, < this is not part of Base64
                                      // We remove it with JS, would it be possible to make it directly to result?
                                  }, (err) => {
                                      console.log(err);
                                      document.body.style.cursor = 'default';
                                  });
                              }
                              else
                              if (rejected.length > 0) {
                                      this.setState({
                                          alertVisible: true,
	                                      submitBtnEnable: true,
                                          alertText: <FormattedMessage id="draftPdfRejectedAlert" />
                                      });
                                  }
                          }
                          }
                      >
                        <p><FormattedMessage id="draftPdfInfo" /></p>
                        <p><FormattedMessage id="draftPdfExtension" /></p>
                      </Dropzone>
                    </div>
                    <br />
                    <aside>
                    {this.state.accepted.length > 0 ?
                        <p style={{ fontSize: '120' + '%', color: ' green' }}>{this.state.accepted[0].name}&nbsp;&nbsp;|
                            &nbsp;&nbsp;{(this.state.accepted[0].size / (1000000)).toFixed(2)} MB
                            &nbsp;&nbsp;<Button color="danger" onClick={this.removeAttachment}>X</Button></p> : null}

                    {this.state.rejected.length > 0 ?
                        <p style={{ fontSize: '120' + '%', color: ' red' }}><FormattedMessage id="draftPdfRejected" />:
                            &nbsp;{this.state.rejected[0].name}&nbsp;&nbsp;|
                            &nbsp;&nbsp;&nbsp;{(this.state.rejected[0].size / (1000000)).toFixed(2)} MB</p> : null}
                    </aside>
                  </section>
                </FormGroup>
                  <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.onDismissAlert}>
                      {this.state.alertText}
                  </Alert>
                <br />
                  <FormGroup check onChange={this.acceptTerms.bind(this)}>
                      <Input type="checkbox" className="accept-terms-checkbox" checked={this.state.termsChecked} />{' '}
                      <div style={{ marginLeft: 40 + 'px' }}>
                          <strong><a href="#" target="_self" onClick={this.toggleTerms}><FormattedMessage id="draftTerms" /></a></strong>
                      </div>
                  </FormGroup>
                <br />
                  { this.state.submitBtnEnable === true && this.state.termsChecked === true &&
                  this.state.formsyValidationIsValid === true && this.state.membersValid && this.state.descriptionValid ?
                      <Button color="success" size="sm" className="send-btn" onClick={this.onSubmit}><FormattedMessage id="submit" />
                      </Button> : <Button color="success" size="sm" className="send-btn" disabled ><FormattedMessage id="submit" /></Button> }
                  <ReCAPTCHA
                      ref={ref => this.ReCAPTCHA = ref}
                      size="invisible"
                      badge="inline"
                      sitekey="<6LeR3VEUAAAAAKA4UWxvklfaHH6OPT3VMaDbr5Ml>"
                      onChange={this.onResolved}
                  />
                  { this.state.termsChecked === true &&
                  this.state.formsyValidationIsValid === true && this.state.membersValid && this.state.descriptionValid ?
                      '' : <p style={{ float: 'right', color: ' red', marginTop: '4' + 'px' }} ><FormattedMessage id="formIncomplete" /></p> }
              </Formsy>
              <Modal isOpen={this.state.showSentFormModal} toggle={this.toggle} className="modal-lg always-lg" backdrop="static">
                <ModalHeader toggle={this.toggle} className="modalHeader"><FormattedMessage id="formSubmitted" /></ModalHeader>
                  <SentDraftDetails form={this.state} />
                  <ModalFooter className="modalFooter">
                      <Button color="primary" onClick={this.toggle}><FormattedMessage id="close" /></Button>
                  </ModalFooter>
              </Modal>
            <Modal isOpen={this.state.showTermsModal} toggle={this.toggleTerms} className="modal-lg" backdrop="static">
                <ModalHeader toggle={this.toggleTerms} className="modalHeader"><FormattedMessage id="termsModalTitle" /></ModalHeader>
                { this.state.tinyMCELocale === 'fi' ?
                    <TermsModal terms={this.props.termsFi} /> : <TermsModal terms={this.props.termsEn} /> }
                <ModalFooter className="modalFooter">
                    <Button color="primary" onClick={this.toggleTerms}><FormattedMessage id="close" /></Button>
                </ModalFooter>
            </Modal>
            </div>
        );
    }
}

DraftCreateWidget.contextTypes = {
    router: PropTypes.object,
};

export default connect()(DraftCreateWidget);
