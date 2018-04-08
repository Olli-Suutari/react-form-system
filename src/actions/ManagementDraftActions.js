import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './ProgressActions';
// For fetching all of the draftManagement.
export const draftsFetchAttempt = () => ({ type: 'DRAFTS_FETCH_ATTEMPT' });
export const draftsFetchFailure = error => ({ type: 'DRAFTS_FETCH_FAILURE', error });
export const draftsFetchSuccess = json => ({ type: 'DRAFTS_FETCH_SUCCESS', json });
// For fetching a single draft.
export const draftFetchAttempt = () => ({ type: 'DRAFT_FETCH_ATTEMPT' });
export const draftFetchFailure = error => ({ type: 'DRAFT_FETCH_FAILURE', error });
export const draftFetchSuccess = json => ({ type: 'DRAFT_FETCH_SUCCESS', json });
// For sending the instruction email to the application sender.
export const sendInstructionEmailAttempt = () => ({ type: 'SEND_INSTRUCTIONS_ATTEMPT' });
export const sendInstructionEmailFailure = error => ({ type: 'SEND_INSTRUCTIONS_FAILURE', error });
export const sendInstructionEmailSuccess = json => ({ type: 'SEND_INSTRUCTIONS_SUCCESS', json });
// For deleting a draft.
// For deleting user from the database.
export const deleteDraftAttempt = () => ({ type: 'DELETE_DRAFT_ATTEMPT' });
export const deleteDraftFailure = error => ({ type: 'DELETE_DRAFT_FAILURE', error });
export const deleteDraftSuccess = json => ({ type: 'DELETE_DRAFT_SUCCESS', json });

// Fetch all
export function fetchDrafts() {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());

        // register that add draft attempt is being made
        dispatch(draftsFetchAttempt());

        // contact API
        fetch(
            // contact to
            '/api/drafts/getdrafts',
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
                    dispatch(draftsFetchSuccess(json));
                } else {
                    dispatch(draftsFetchFailure(new Error('Fetching failed')));
                }
            })
            .catch((error) => {
                dispatch(draftsFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function fetch20Drafts() {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());

        // register that add draft attempt is being made
        dispatch(draftsFetchAttempt());

        // contact API
        fetch(
            // contact to
            '/api/drafts/get20drafts',
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
                    dispatch(draftsFetchSuccess(json));
                } else {
                    dispatch(draftsFetchFailure(new Error('Fetching failed.')));
                }
            })
            .catch((error) => {
                dispatch(draftsFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function fetch50Drafts() {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());

        // register that add draft attempt is being made
        dispatch(draftsFetchAttempt());

        // contact API
        fetch(
            // contact to
            '/api/drafts/get50drafts',
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
                    dispatch(draftsFetchSuccess(json));
                } else {
                    dispatch(draftsFetchFailure(new Error('Fetching failed.')));
                }
            })
            .catch((error) => {
                dispatch(draftsFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function textSearch(searchTerm) {
    const myobj = JSON.parse('{ "searchTerm":"' + searchTerm + '" }');
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(draftsFetchAttempt());
        // contact API
        fetch(
            // contact to
            '/api/drafts/draftTextSearch',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(myobj),
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
                    dispatch(draftsFetchSuccess(json));
                } else {
                    dispatch(draftsFetchFailure(new Error('Fetching failed')));
                }
            })
            .catch((error) => {
                dispatch(draftsFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}


export function fetchDraft(cuid) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(draftFetchAttempt());
        // contact API
        fetch(
            // contact to
            '/api/drafts/getdraft',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(cuid),
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
                    dispatch(draftFetchSuccess(json));
                } else {
                    dispatch(draftFetchFailure(new Error('Fetching failed')));
                }
            })
            .catch((error) => {
                dispatch(draftFetchFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function sendInstructionEmailRequest(cuid) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(sendInstructionEmailAttempt());
        // contact API
        fetch(
            // contact to
            '/api/drafts/sendInstructionEmail',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(cuid),
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
                    dispatch(sendInstructionEmailSuccess(json));
                } else {
                    dispatch(sendInstructionEmailFailure(new Error('Send instructions failed')));
                }
            })
            .catch((error) => {
                dispatch(sendInstructionEmailFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}

export function deleteDraft(draft) {
    return async (dispatch) => {
        // turn on spinner
        dispatch(incrementProgress());
        // register that add draft attempt is being made
        dispatch(deleteDraftAttempt());
        // contact API
        fetch(
            // contact to
            '/api/drafts/deleteDraft',
            // what to send
            {
                method: 'POST',
                body: JSON.stringify(draft),
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
                    dispatch(deleteDraftSuccess(json));
                } else {
                    dispatch(deleteDraftFailure(new Error('Delete failed')));
                }
            })
            .catch((error) => {
                dispatch(deleteDraftFailure(new Error(error)));
            });
        return dispatch(decrementProgress());
    };
}
