// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    },
    debug: false,
    defaultNS: 'ui',
    fallbackLng: false,
    interpolation: {
      escapeValue: false
    },
    lng: 'en',
    ns: [
      'app-123code',
      'app-accounts',
      'app-address-book',
      'app-claims',
      'app-contracts',
      'app-council',
      'app-dashboard',
      'app-democracy',
      'app-explorer',
      'app-extrinsics',
      'app-generic-asset',
      'app-js',
      'app-parachains',
      'app-settings',
      'app-staking',
      'app-storage',
      'app-sudo',
      'app-toolbox',
      'app-transfer',
      'app-treasury',
      'apps',
      'apps-routing',
      'react-api',
      'react-components',
      'react-params',
      'react-query',
      'react-signer'
    ],
    keySeparator: false,
    nsSeparator: false,
    react: {
      wait: true
    }
  })
  .catch((error: Error): void =>
    console.log('i18n: failure', error)
  );

export default i18n;
