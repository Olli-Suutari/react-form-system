import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './ProgressActions';

// Action Creators
export const draftAddAttempt = () => ({ type: 'DRAFT_ADD_ATTEMPT' });
export const draftAddFailure = error => ({ type: 'DRAFT_ADD_FAILURE', error });
export const draftAddSuccess = json => ({ type: 'DRAFT_ADD_SUCCESS', json });

// Add draft
export function addDraft(draftData) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(draftAddAttempt());
        // contact API
        await fetch(
            '/api/drafts/adddraft',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(draftData),
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
                    dispatch(draftAddSuccess());
                } else {
                    dispatch(draftAddFailure(new Error(json.error.message ? 'There was an error in saving the draft: ' : json.error)));
                }
            })
            .catch((error) => {
                dispatch(draftAddFailure(new Error(error)));
            });

        // turn off spinner
        return dispatch(decrementProgress());
    };
}
