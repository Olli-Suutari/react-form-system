// Initial State
/** ***********************
 * infoUpdateStatus:
 * 0 = Default (not updating)
 * 1 = Updating.
 * 2 = Update failed
 * 3 = Update success.
 */
const initialState = {
    data: [],
    isFetchingInfo: false,
    infoUpdateStatus: 0,
};


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'INFO_FETCH_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.isFetchingInfo = true;
            return newState;
        }
        case 'INFO_FETCH_FAILURE': {
            return Object.assign({}, initialState);
        }
        case 'INFO_FETCH_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.data = action.json;
            newState.isFetchingInfo = false;
            return newState;
        }
        case 'INFO_UPDATE_ATTEMPT': {
            const newState = Object.assign({}, state);
            newState.infoUpdateStatus = 1;
            return newState;
        }
        case 'INFO_UPDATE_FAILURE': {
            const newState = Object.assign({}, state);
            newState.infoUpdateStatus = 2;
            return newState;
        }
        case 'INFO_UPDATE_SUCCESS': {
            const newState = Object.assign({}, state);
            newState.infoUpdateStatus = 3;
            return newState;
        }
        default: {
            return state;
        }
    }
}
