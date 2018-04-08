import React from 'react';
import PropTypes from 'prop-types';
import logo1 from './logo1.png';
import logo2 from './logo2.png';

export function Header(props) {
  const languageNodes = props.intl.enabledLanguages.map(
      lang => (<li key={lang} onClick={() => props.switchLanguage(lang)}
                  className={lang === props.intl.locale ? 'selected' : ''}>{lang}</li>)
  );

  return (
    <div className="header">
        <div id="navigation-container">
            <img src={logo2} style={{ maxHeight: 120 + 'px', paddingBottom: 5 }} alt="Logo 2" />
            <img src={logo1} style={{ maxHeight: 120 + 'px' }} alt="Logo 1" />
            <div className="language-switcher">
                <ul>
                    {languageNodes}
                </ul>
            </div>
        </div>
    </div>
  );
}

Header.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default Header;
