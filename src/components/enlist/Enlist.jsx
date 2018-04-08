import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Import Components
import Header from './components/Header';
import DraftForm from './components/draftForm/DraftForm';

// Import actions
import { switchLanguage } from '../../actions/IntlActions';

export class Enlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
    };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
    document.title = this.props.intl.messages.siteTitle;
  }

  componentWillUpdate(nextProps) {
    document.title = nextProps.intl.messages.siteTitle;
  }

  render() {
    const { intl } = this.props;
    const { draft } = this.props;
    return (
      <div className="container">
          <Header
              switchLanguage={lang => this.props.dispatch(switchLanguage(lang))}
              intl={intl}
          />
          <br /><br />
          <div>
              <DraftForm draft={draft} intl={intl} />
          </div>
          <br /><br />
      </div>
    );
  }
}

Enlist.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


// Retrieve data from store as props
function mapStateToProps(store) {
  return {
      intl: store.intl,
      draft: store.draftEnlist,
  };
}

export default connect(mapStateToProps)(Enlist);
