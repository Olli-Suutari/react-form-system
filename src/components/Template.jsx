import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChangePasswordPage from './management/components/account/ChangePasswordPage';
import LoginPage from './management/components/account/LoginPage';
import ResetPasswordPage from './management/components/account/ResetPasswordPage';
import EnlistPage from './enlist/Enlist';
import ManagementPage from './management/Management';
import { IntlWrapper } from './enlist/intl/IntlWrapper';

function Template(props) {
    const { progress, intl } = props;
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/management" component={ManagementPage} />
                    <Route path="/management/new-password/:hash" component={ChangePasswordPage} />
                    <Route exact path="/management/login" component={LoginPage} />
                    <Route exact path="/management/reset-password" component={ResetPasswordPage} />
                    <IntlWrapper intl={intl}>
                        <Route exact path="*" component={EnlistPage} />
                    </IntlWrapper>
                </Switch>
                <div className="loader-wrapper" style={progress > 0 ? { display: 'block' } : { display: 'none' }}>
                    <div className="loader-box">
                        <div className="loader">Loading...</div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

function mapStateToProps(state) {
    return {
        progress: state.progress,
        authentication: state.authentication,
        account: state.account,
        userManagement: state.userManagement,
        intl: state.intl,
        infos: state.infos,
        draftEnlist: state.draftEnlist,
        draftManagement: state.draftManagement,
    };
}

export default connect(mapStateToProps)(Template);
