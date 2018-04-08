import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './ProgressActions';
// Generate hash for password reset
export const passwordResetHashCreated = () => ({ type: 'ACCOUNT_PASSWORD_RESET_HASH_CREATED' });
export const passwordResetHashFailure = error => ({ type: 'ACCOUNT_PASSWORD_RESET_HASH_FAILURE', error });
// Save new password
export const passwordSaveAttempt = () => ({ type: 'ACCOUNT_PASSWORD_SAVE_ATTEMPT' });
export const passwordSaveFailure = error => ({ type: 'ACCOUNT_PASSWORD_SAVE_FAILURE', error });
export const passwordSaveSuccess = () => ({ type: 'ACCOUNT_PASSWORD_SAVE_SUCCESS' });

export function createHash(email) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // contact the API
        try {
            await fetch(
                // where to contact
                '/api/account/saveresethash',
                // what to send
                {
                    method: 'POST',
                    body: JSON.stringify((email)),
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
                .then((json) => {
                    if (json.success) {
                        return dispatch(passwordResetHashCreated(json));
                    }
                    return dispatch(passwordResetHashFailure(new Error('Something went wrong. Please try again.')));
                })
                .catch(error => dispatch(passwordResetHashFailure(error)));
            // turn off spinner
            return dispatch(decrementProgress());
        }
       catch (error)
       {
           console.log('Error! ' + error);
       }
    };
}

// Save a user's password
export function savePassword(data) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(passwordSaveAttempt());
        dispatch(incrementProgress());
        await fetch(
            // where to contact
            '/api/account/savepassword',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(data),
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
        .then(async (json) => {
            if (json && json.success) {
                dispatch(passwordSaveSuccess());
            } else {
                dispatch(passwordSaveFailure(new Error(json.error.message ? 'There was an error saving the password. Please try again' : json.error)
                ));
            }
        })
        .catch((error) => {
            dispatch(passwordSaveFailure(new Error(error)));
        });
        // turn off spinner
        return dispatch(decrementProgress());
    };
}
