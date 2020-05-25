// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Translator from '@polkadot/app-i18n';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: Translator,
    display: {
      isHidden: true
    },
    icon: 'th',
    name: 'i18n',
    text: t<string>('nav.i18n', 'I18n Translator', { ns: 'apps-routing' })
  };
}
