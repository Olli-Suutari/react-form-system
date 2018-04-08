import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './ProgressActions';
// Action Creators
export const infoUpdateAttempt = () => ({ type: 'INFO_UPDATE_ATTEMPT' });
export const infoUpdateFailure = error => ({ type: 'INFO_UPDATE_FAILURE', error });
export const infoUpdateSuccess = () => ({ type: 'INFO_UPDATE_SUCCESS' });
export const fetchInfoAttempt = () => ({ type: 'INFO_FETCH_ATTEMPT' });
export const fetchInfoFailure = error => ({ type: 'INFO_FETCH_FAILURE', error });
export const fetchInfoSuccess = json => ({ type: 'INFO_FETCH_SUCCESS', json });
export const GET_INFO = 'GET_INFO';
export const UPDATE_INFO = 'UPDATE_INFO';
// Get info
export function fetchInfo() {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(fetchInfoAttempt());
        fetch(
            '/api/infos/fetchInfo',
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
                    dispatch(fetchInfoSuccess(json));
                } else {
                    dispatch(fetchInfoFailure(new Error('Fetch info failed')));
                }
            })
            .catch((error) => {
                dispatch(fetchInfoFailure(new Error(error)));
            });

        return dispatch(decrementProgress());
    };
}
// Add draft
export function updateInfo(info) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());

        // register that add draft attempt is being made
        dispatch(infoUpdateAttempt());

        // contact API
        await fetch(
            '/api/infos/updateInfo',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(info),
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
                    return dispatch(infoUpdateSuccess());
                }
                return dispatch(infoUpdateFailure(new Error(json.error.message ? 'Info failed to update.' : json.error)));
            })
            .catch((error) => {
                return dispatch(infoUpdateFailure(new Error(error)));
            });

        // turn off spinner
        return dispatch(decrementProgress());
    };
}
