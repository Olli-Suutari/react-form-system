import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { ModalBody } from 'reactstrap';

function TermsModal(props) {
	const { terms } = props;
	return (
		<div>
			<ModalBody className="modalBody">
				<h4><FormattedMessage id="termsTitle" /> </h4>
				<p dangerouslySetInnerHTML={{ __html: terms }} />
				<br />
				<h4><FormattedMessage id="cookiesTitle" /> </h4>
				<p><FormattedMessage id="cookiesInfo" /> </p>
			</ModalBody>
		</div>
	);
}

TermsModal.propTypes = {
    terms: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ DraftActions: state.DraftActions });

export default connect(mapStateToProps)(TermsModal);
