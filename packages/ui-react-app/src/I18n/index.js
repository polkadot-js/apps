// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

type Props = {
  children: React$Node
};

const React = require('react');
const { I18nextProvider } = require('react-i18next');

const i18n = require('./i18n');

module.exports = function I18n ({ children }: Props): React$Node {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};
