// Copyright 2017-2019 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Options } from './types';

const ENDPOINTS: Options = [
  { text: 'Joystream Testnet (hosted by joystream.org)', value: 'wss://sparta.joystream.org/rpc/' },
  { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/' }
];

const LANGUAGES: Options = [
  { value: 'default', text: 'Default browser language (auto-detect)' }
];

const UIMODES: Options = [
  { value: 'light', text: 'Basic features only' },
  { value: 'full', text: 'Fully featured' }
];

const UITHEMES: Options = [
  { value: 'substrate', text: 'Substrate' }
];

export {
  ENDPOINTS,
  LANGUAGES,
  UIMODES,
  UITHEMES
};
