import { localizationData } from '../components/enlist/intl/Setup';

// Export Constants
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';

export function switchLanguage(newLang) {
  return {
    type: SWITCH_LANGUAGE,
    ...localizationData[newLang],
  };
}
