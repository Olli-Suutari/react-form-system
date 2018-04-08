import { enabledLanguages, localizationData } from '../components/enlist/intl/Setup';
import { SWITCH_LANGUAGE } from '../actions/IntlActions';

// const initLocale = global.navigator && global.navigator.language || 'en';
const initLocale = 'en';

const initialState = {
  locale: initLocale,
  enabledLanguages,
  ...(localizationData[initLocale] || {}),
};

const IntlReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_LANGUAGE: {
      const { ...actionWithoutType } = action; // eslint-disable-line
      return { ...state, ...actionWithoutType };
    }

    default:
      return state;
  }
};

export default IntlReducer;
