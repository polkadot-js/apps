// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    },
    debug: false,
    defaultNS: 'ui',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    ns: ['ui'],
    react: {
      wait: true
    }
  });

export default i18n;
