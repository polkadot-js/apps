// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param } from '@polkadot/primitives/param';
import type { BareProps } from '@polkadot/ui-react-app/types';
import type { RawParam } from '../types';

export type BaseProps = BareProps & {
  subject: rxjs$BehaviorSubject<RawParam>,
  value: Param
};

export type Props = BaseProps & {
  isError?: boolean,
  label: string
};

export type Size = 'full' | 'large' | 'medium' | 'small';
