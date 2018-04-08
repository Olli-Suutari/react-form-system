import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import DraftCreateWidget from './DraftCreateWidget';
import { fetchInfo } from '../../../../actions/InfoActions';

class DraftForm extends Component {
  constructor(props) {
    super(props);
    this.fetchInfoFunction = this.fetchInfoFunction.bind(this);
  }

  componentDidMount() {
    this.fetchInfoFunction();
  }

  fetchInfoFunction() {
    const { dispatch } = this.props;
    dispatch(fetchInfo());
  }

  render() {
    const { draft, intl, infos } = this.props;
    const FI = infos.data.infoFi;
    const EN = infos.data.infoEn;
    return (
      <div>
        <div className="jumbotron">
          <h2 className="form-title"><FormattedMessage id="siteTitle" /></h2>
          <div dangerouslySetInnerHTML={{ __html: intl.locale === 'fi' ? FI : EN }} />
        </div>
          <DraftCreateWidget draft={draft} intl={intl} termsFi={infos.data.termsFi} termsEn={infos.data.termsEn} />
      </div>
    );
  }
}

// actions required to provide data for this component to render in sever side.
DraftForm.need = [() => { return fetchInfo(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    infos: state.infos,
  };
}

DraftForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

DraftForm.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DraftForm);
