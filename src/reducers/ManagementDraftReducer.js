// Initial State
/** *************************
 * sendInstructionsStatus:
 * 0 = Not sending.
 * 1 = Sending in progress.
 * 2 = Sending failed.
 * 3 = Sending success.
 * *************************
 *  deleteDraftStatus:
 * 0 = Not deleting.
 * 1 = Deleting in progress.
 * 2 = Deleting failed.
 * 3 = Deleting success.
 ************************** */
const initialState = {
    data: [],
    singleDraft: [],
    isFetchingDrafts: false,
    isFetchingDraft: false,
    sendInstructionsStatus: 0,
    deleteDraftStatus: 0,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'DRAFTS_FETCH_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.isFetchingDrafts = true;
            return newState;
        }
        case 'DRAFT_FETCH_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.isFetchingDraft = true;
            return newState;
        }
        case 'SEND_INSTRUCTIONS_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.sendInstructionsStatus = 1;
            return newState;
        }
        case 'DRAFTS_FETCH_FAILURE': {
            return Object.assign({}, state);
        }
        case 'DRAFTS_FETCH_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.data = action.json;
            newState.isFetchingDrafts = false;
            return newState;
        }
        case 'DRAFT_FETCH_FAILURE': {
            return Object.assign({}, state);
        }
        case 'DRAFT_FETCH_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.singleDraft = action.json;
            newState.isFetchingDraft = false;
            return newState;
        }
        case 'SEND_INSTRUCTIONS_FAILURE': {
            const newState = Object.assign({}, state);
            newState.sendInstructionsStatus = 2;
            return newState;
        }
        case 'SEND_INSTRUCTIONS_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.sendInstructionsStatus = 3;
            return newState;
        }
        case 'DELETE_DRAFT_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.deleteDraftStatus = 1;
            return newState;
        }
        case 'DELETE_DRAFT_FAILURE': {
            const newState = Object.assign({}, state);
            newState.deleteDraftStatus = 2;
            return newState;
        }
        case 'DELETE_DRAFT_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.deleteDraftStatus = 3;
            return newState;
        }
        default: {
          return state;
        }
    }
}
