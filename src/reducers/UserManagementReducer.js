/** ************************************
 * We want to show messages in UI for fail/succes, but not either of them by default.
 * Thus we create 3-4 states for the following:
 *
 * registrationSucceeded:
 * 0 = Registration not attempted. (default)
 * 1 = Registration failed.
 * 2 = Registration success.
 * ***********************************
 *  toggleNotificationsStatus:
 * 0 = Not changing.
 * 1 = Changing in progress.
 * 2 = Changing failed.
 * 3 = Changing success.
 * ************************************
 *  deleteUserStatus:
 * 0 = Not deleting.
 * 1 = Deleting in progress.
 * 2 = Deleting failed.
 * 3 = Deleting success.
 ************************************* */
const initialState = {
    registrationSucceeded: 0,
    toggleNotificationsStatus: 0,
    deleteUserStatus: 0,
    userList: [],
    isFetchingUsers: false,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ACCOUNT_REGISTRATION_FAILURE': {
            const newState = Object.assign({}, state);
            newState.registrationSucceeded = 1;
            return newState;
        }
        case 'ACCOUNT_REGISTRATION_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.registrationSucceeded = 2;
            return newState;
        }
        case 'TOGGLE_NOTIFICATIONS_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.toggleNotificationsStatus = 1;
            return newState;
        }
        case 'TOGGLE_NOTIFICATIONS_FAILURE': {
            const newState = Object.assign({}, state);
            newState.toggleNotificationsStatus = 2;
            return newState;
        }
        case 'TOGGLE_NOTIFICATIONS_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.toggleNotificationsStatus = 3;
            return newState;
        }
        case 'USERS_FETCH_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.isFetchingUsers = true;
            return newState;
        }
        case 'USERS_FETCH_FAILURE': {
            return Object.assign({}, state);
        }
        case 'USERS_FETCH_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.userList = action.json;
            newState.isFetchingUsers = false;
            return newState;
        }
        case 'DELETE_USER_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.deleteUserStatus = 1;
            return newState;
        }
        case 'DELETE_USER_FAILURE': {
            const newState = Object.assign({}, state);
            newState.deleteUserStatus = 2;
            return newState;
        }
        case 'DELETE_USER_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.deleteUserStatus = 3;
            return newState;
        }
        default: {
            return state;
        }
    }
}
