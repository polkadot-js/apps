// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import uiSettings, { LANGUAGE_DEFAULT } from '@polkadot/ui-settings';

import Backend from './Backend';

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  lookup: () => {
    const i18nLang = uiSettings.i18nLang;

    return i18nLang === LANGUAGE_DEFAULT
      ? undefined
      : i18nLang;
  },
  name: 'i18nLangDetector'
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    backend: {},
    debug: false,
    detection: {
      order: ['i18nLangDetector', 'navigator']
    },
    fallbackLng: false,
    interpolation: {
      escapeValue: false
    },
    keySeparator: false,
    load: 'languageOnly',
    ns: [
      'apps',
      'apps-config',
      'apps-routing',
      'app-123code',
      'app-accounts',
      'app-claims',
      'app-contracts',
      'app-council',
      'app-dashboard',
      'app-democracy',
      'app-explorer',
      'app-extrinsics',
      'app-generic-asset',
      'app-i18n',
      'app-js',
      'app-parachains',
      'app-settings',
      'app-society',
      'app-staking',
      'app-storage',
      'app-sudo',
      'app-tech-comm',
      'app-toolbox',
      'app-treasury',
      'react-api',
      'react-components',
      'react-hooks',
      'react-params',
      'react-query',
      'react-signer',
      'translation'
    ],
    nsSeparator: false,
    react: {
      wait: true
    },
    returnEmptyString: false,
    returnNull: false
  })
  .catch((error: Error): void =>
    console.log('i18n: failure', error)
  );

uiSettings.on('change', (settings) => {
  i18n.changeLanguage(
    settings.i18nLang === LANGUAGE_DEFAULT
      ? i18n.services.languageDetector.detect()
      : settings.i18nLang
  );
});

export default i18n;
