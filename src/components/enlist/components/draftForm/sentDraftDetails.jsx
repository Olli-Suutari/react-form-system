import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, FormGroup, Label, ModalBody } from 'reactstrap';
import TinyMCE from 'react-tinymce';
// This is used to show the sent form details in the draftCreateWidget.
export class SentDraftDetails extends PureComponent {
    render() {
        return (
            <div>
            <ModalBody className="modalBody">
                <p><FormattedMessage id="formSentText" /></p>
                <br />
                <Form>
                    <FormGroup>
                      <Label><FormattedMessage id="draftSenderName" />: {this.props.form.name}</Label>
                    </FormGroup>
                    <FormGroup>
                      <Label><FormattedMessage id="draftSenderEmail" />: {this.props.form.email}</Label>
                    </FormGroup>
                    <FormGroup>
                      <Label><FormattedMessage id="draftSenderOrganisation" />: {this.props.form.organisation}</Label>
                    </FormGroup>
                    <FormGroup>
                      <Label><FormattedMessage id="draftMembers" />: {this.props.form.members} <FormattedMessage id="persons" /></Label>
                    </FormGroup>
                    <FormGroup>
                      <Label><FormattedMessage id="draftTitle" />: {this.props.form.title}</Label>
                    </FormGroup>
                    <FormGroup>
                      <Label><FormattedMessage id="draftDescription" /></Label>
	                    <TinyMCE
		                    content={this.props.form.description}
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
                      <Label><FormattedMessage id="draftHeardFrom" />: {this.props.form.heardFrom} </Label>
                    </FormGroup>
                      {this.props.form.fileName.length > 0 &&
                      <FormGroup>
                          <Label><FormattedMessage id="draftPdfLabel" />: {this.props.form.fileName}</Label>
                      </FormGroup>
                      }
                  </Form>
                </ModalBody>
            </div>
        );
    }
}

SentDraftDetails.propTypes = {
    form: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ DraftActions: state.DraftActions });

export default connect(mapStateToProps)(SentDraftDetails);
