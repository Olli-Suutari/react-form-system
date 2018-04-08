// Initial state
const initialState = {
    id: '',
    isLoggedIn: false,
    isLoggingIn: false,
    isAdmin: false,
    emailNotifications: true,
    email: '',
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'AUTHENTICATION_LOGIN_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.isLoggingIn = true;
            return newState;
        }
        case 'AUTHENTICATION_LOGIN_FAILURE':
        case 'AUTHENTICATION_SESSION_CHECK_FAILURE':
        case 'AUTHENTICATION_LOGOUT_SUCCESS': {
            return Object.assign({}, initialState);
        }
        case 'AUTHENTICATION_LOGIN_SUCCESS':
        case 'AUTHENTICATION_SESSION_CHECK_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.id = action.json._id;
            newState.isLoggedIn = true;
            newState.isLoggingIn = false;
            newState.email = action.json.email;
            newState.isAdmin = action.json.isAdmin;
            newState.emailNotifications = action.json.emailNotifications;
            return newState;
        }
        case 'AUTHENTICATION_LOGOUT_FAILURE':
        default: {
            return state;
        }
    }
}
