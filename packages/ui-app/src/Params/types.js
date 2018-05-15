// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$Types } from '@polkadot/params/types';
import type { BareProps } from '../types';

export type RawParam = {
  isValid: boolean,
  value: mixed,
}

export type RawParams = Array<RawParam>;

export type BaseProps = BareProps & {
  onChange: (index: number, value: RawParam) => void,
  value: {
    name: string,
    options?: {
      initValue?: mixed,
      minValue?: mixed,
      maxValue?: mixed
    },
    type: Param$Types
  }
};

export type Props = BaseProps & {
  isDisabled?: boolean,
  isError?: boolean,
  index: number,
  label: string,
  withLabel?: boolean
};

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentMap = {
  // flowlint-next-line unclear-type:off
  [Param$Type]: React$ComponentType<any>
};
