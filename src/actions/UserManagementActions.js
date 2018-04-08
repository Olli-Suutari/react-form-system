import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './ProgressActions';
// Register
export const registrationFailure = error => ({ type: 'ACCOUNT_REGISTRATION_FAILURE', error });
export const registrationSuccess = () => ({ type: 'ACCOUNT_REGISTRATION_SUCCESS' });
// For toggling the preferences for receiving emails when new draft is sent.
export const toggleNotificationsAttempt = () => ({ type: 'TOGGLE_NOTIFICATIONS_ATTEMPT' });
export const toggleNotificationsFailure = error => ({ type: 'TOGGLE_NOTIFICATIONS_FAILURE', error });
export const toggleNotificationsSuccess = json => ({ type: 'TOGGLE_NOTIFICATIONS_SUCCESS', json });
// For fetching a list of users (admin user can view list & delete accounts)
export const usersFetchAttempt = () => ({ type: 'USERS_FETCH_ATTEMPT' });
export const usersFetchFailure = error => ({ type: 'USERS_FETCH_FAILURE', error });
export const usersFetchSuccess = json => ({ type: 'USERS_FETCH_SUCCESS', json });
// For deleting user from the database.
export const deleteUserAttempt = () => ({ type: 'DELETE_USER_ATTEMPT' });
export const deleteUserFailure = error => ({ type: 'DELETE_USER_FAILURE', error });
export const deleteUserSuccess = json => ({ type: 'DELETE_USER_SUCCESS', json });

// Register a User
export function registerUser(userData) {
    return async (dispatch) => {
        dispatch(incrementProgress());
        // contact the API
        await fetch(
            // where to contact
            '/api/account/register',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            },
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((json) => {
                    if (json.success) {
                        return dispatch(registrationSuccess());
                    }
                    return dispatch(registrationFailure(new Error(json.error.message ? 'Email or username already exists' : json.error)));
                });
        return dispatch(decrementProgress());
    };
}


export function toggleEmailNotifications(user) {
    return async (dispatch) => {
        dispatch(incrementProgress());
        dispatch(toggleNotificationsAttempt());
        fetch(
            // contact to
            '/api/account/toggleNotifications',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            },
        ).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return null;
        })
            .then(async (json) => {
                if (json) {
                    dispatch(toggleNotificationsSuccess(json));
                } else {
                    dispatch(toggleNotificationsFailure(new Error('Email notification toggle failed')));
                }
            })
            .catch((error) => {
                dispatch(toggleNotificationsFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

// Fetch all users
export function fetchUsers() {
    return async (dispatch) => {
        dispatch(incrementProgress());
        dispatch(usersFetchAttempt());
        fetch(
            // contact to
            '/api/account/getUsers',
            // what to send
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            },
        ).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return null;
        })
            .then(async (json) => {
                if (json) {
                    dispatch(usersFetchSuccess(json));
                } else {
                    dispatch(usersFetchFailure(new Error('Fetch users failed')));
                }
            })
            .catch((error) => {
                dispatch(usersFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function deleteUser(user) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(deleteUserAttempt());
        // contact API
        fetch(
            // contact to
            '/api/account/deleteUser',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            },
        ).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return null;
        })
            .then(async (json) => {
                if (json) {
                    dispatch(deleteUserSuccess(json));
                } else {
                    dispatch(deleteUserFailure(new Error('Delete user failed')));
                }
            })
            .catch((error) => {
                dispatch(deleteUserFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}
