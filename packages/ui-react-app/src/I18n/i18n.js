// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const i18n = require('i18next');
const LanguageDetector = require('i18next-browser-languagedetector');
const Backend = require('i18next-xhr-backend');
const { reactI18nextModule } = require('react-i18next');

const CONFIG = {
  fallbackLng: 'en',
  ns: ['ui'],
  defaultNS: 'ui',
  debug: true,
  interpolation: {
    escapeValue: false
  },
  react: {
    wait: true
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init(CONFIG);

module.exports = i18n;
