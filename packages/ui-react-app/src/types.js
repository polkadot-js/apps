// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { KeyringInstance as UKeyringInstance, KeyringPair } from '@polkadot/util-keyring/types';

export type BareProps = {
  className?: string,
  style?: {
    [string]: string
  }
};

export type I18nProps = BareProps & {
  t: I18Next$Translate
};

export type BaseContext = {
  api: RxApiInterface,
  // TODO: Set the correct/full type
  router: {
    route: {
      location: Location
    }
  }
};

export type KeyringInstance = UKeyringInstance & {
  loadJson: () => void,
  saveJson: (pair: KeyringPair, password?: string) => void
};
