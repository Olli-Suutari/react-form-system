/** ************************************
 * We want to show messages in UI for fail/succes, but not either of them by default.
 * Thus we create 3 states for the following:
 *
 * registrationSucceeded:
 * 0 = Registration not attempted. (default)
 * 1 = Registration failed.
 * 2 = Registration success.
 * ************************************
 * isPasswordReset:
 * 0 = Reset not attempted.(default
 * 1 = Reset failed.
 * 2 = Reset success.
 *  ***********************************
 * passwordChangeStatus:
 * 0 = Change not attempted.(default
 * 1 = Change failed.
 * 2 = Change success.
 ************************************* */
const initialState = {
    passwordChangeStatus: 0,
    isPasswordReset: 0,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ACCOUNT_PASSWORD_RESET_HASH_FAILURE': {
            const newState = Object.assign({}, state);
            newState.isPasswordReset = 1;
            return newState;
        }
        case 'ACCOUNT_PASSWORD_RESET_HASH_CREATED': {
            const newState = Object.assign({}, state);
            newState.isPasswordReset = 2;
            return newState;
        }
        case 'ACCOUNT_PASSWORD_SAVE_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.passwordChangeStatus = 1;
            return newState;
        }
        case 'ACCOUNT_PASSWORD_SAVE_FAILURE': {
            const newState = Object.assign({}, state);
            newState.passwordChangeStatus = 2;
            return newState;
        }
        case 'ACCOUNT_PASSWORD_SAVE_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.passwordChangeStatus = 3;
            return newState;
        }
        default: {
            return state;
        }
    }
}
