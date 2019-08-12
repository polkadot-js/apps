// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  // .use(Backend)
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // backend: {
    //   loadPath: 'locales/{{lng}}/{{ns}}.json'
    // },
    debug: false,
    defaultNS: 'ui',
    fallbackLng: false,
    interpolation: {
      escapeValue: false
    },
    lng: 'en',
    ns: ['ui'],
    react: {
      wait: true
    }
  })
  .catch((error: Error): void =>
    console.log('i18n: failure', error)
  );

export default i18n;
