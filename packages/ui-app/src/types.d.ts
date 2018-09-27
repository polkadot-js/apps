// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { RxApiInterface } from '@polkadot/api-rx/types';

export type BareProps = {
  className?: string,
  style?: {
    [index: string]: any
  }
};

export type I18nProps = BareProps & {
  t: TranslationFunction
};

export type BaseContext = {
  api: RxApiInterface,
  // TODO: Set the correct type
  router: {
    route: {
      location: Location
    }
  }
};

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;
