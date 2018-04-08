import { combineReducers } from 'redux';
import PasswordReducer from '../reducers/PassResetReducer';
import AuthenticationReducer from '../reducers/AuthenticationReducer';
import ProgressReducer from '../reducers/ProgressReducer';
import EnlistDraftReducer from './EnlistDraftReducer';
import ManagementDraftReducer from './ManagementDraftReducer';
import UserManagementReducer from './userManagementReducer';
import InfoReducer from '../reducers/InfoReducer';
import intl from './IntlReducer';

const reducers = {
    authentication: AuthenticationReducer,
    passwordManagement: PasswordReducer,
    progress: ProgressReducer,
    draftEnlist: EnlistDraftReducer,
    draftManagement: ManagementDraftReducer,
    infos: InfoReducer,
    userManagement: UserManagementReducer,
    intl,
};

export default combineReducers(reducers);
