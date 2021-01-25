// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_DEFAULT, settings } from '@polkadot/ui-settings';

import Backend from './Backend';

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  lookup: () => {
    const i18nLang = settings.i18nLang;

    return i18nLang === LANGUAGE_DEFAULT
      ? undefined
      : i18nLang;
  },
  name: 'i18nLangDetector'
});

i18next
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
      'apps-electron',
      'apps-routing',
      'app-accounts',
      'app-claims',
      'app-contracts',
      'app-council',
      'app-democracy',
      'app-explorer',
      'app-extrinsics',
      'app-generic-asset',
      'app-js',
      'app-parachains',
      'app-poll',
      'app-rpc',
      'app-settings',
      'app-signing',
      'app-society',
      'app-staking',
      'app-storage',
      'app-sudo',
      'app-tech-comm',
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

settings.on('change', (settings): void => {
  i18next.changeLanguage(
    settings.i18nLang === LANGUAGE_DEFAULT
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      ? i18next.services.languageDetector.detect()
      : settings.i18nLang
  ).catch(console.error);
});

export default i18next;
