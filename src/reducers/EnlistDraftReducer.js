// Initial State
/** *************************
 * sendDraftStatus:
 * 0 = Not sending.
 * 1 = Sending in progress.
 * 2 = Sending failed.
 * 3 = Sending success.
 ************************** */
const initialState = {
    sendDraftStatus: 0,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'DRAFT_ADD_ATTEMPT': {
          const newState = Object.assign({}, state);
          newState.sendDraftStatus = 1;
          return newState;
        }
        case 'DRAFT_ADD_FAILURE': {
            const newState = Object.assign({}, state);
            newState.sendDraftStatus = 2;
            return newState;
        }
        case 'DRAFT_ADD_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.sendDraftStatus = 3;
            return newState;
        }

        default: {
          return state;
        }
    }
}
