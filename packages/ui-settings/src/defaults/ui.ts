// Copyright 2017-2019 @plasm/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

import { isPlasm } from './type';

const LANGUAGE_DEFAULT = 'default';

const UIMODE_DEFAULT = !isPlasm && typeof window !== 'undefined' && window.location.host.includes('ui-light')
  ? 'light'
  : 'full';

const UIMODES: Option[] = [
  {
    info: 'full',
    text: 'Fully featured',
    value: 'full'
  },
  {
    info: 'light',
    text: 'Basic features only',
    value: 'light'
  }
];

const UITHEME_DEFAULT = isPlasm
  ? 'plasm'
  : 'substrate';

const UITHEMES: Option[] = [
  {
    info: 'polkadot',
    text: 'Polkadot',
    value: 'polkadot'
  },
  {
    info: 'substrate',
    text: 'Substrate',
    value: 'substrate'
  },
  {
    info: 'plasm',
    text: 'Plasm',
    value: 'plasm'
  }
];

const ICON_DEFAULT = 'default';

const ICON_DEFAULT_HOST = isPlasm
  ? 'plasm'
  : 'substrate';

const ICONS: Option[] = [
  {
    info: 'default',
    text: 'Default for the connected node',
    value: 'default'
  },
  {
    info: 'plasm',
    text: 'Plasm',
    value: 'plasm'
  },
  {
    info: 'polkadot',
    text: 'Polkadot',
    value: 'polkadot'
  },
  {
    info: 'substrate',
    text: 'Substrate',
    value: 'substrate'
  },
  {
    info: 'beachball',
    text: 'Beachball',
    value: 'beachball'
  }
];

export {
  ICON_DEFAULT,
  ICON_DEFAULT_HOST,
  ICONS,
  LANGUAGE_DEFAULT,
  UIMODE_DEFAULT,
  UIMODES,
  UITHEME_DEFAULT,
  UITHEMES
};
