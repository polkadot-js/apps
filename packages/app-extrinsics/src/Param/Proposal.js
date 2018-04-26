// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, Extrinsic$Params } from '../extrinsics/types';
import type { Props } from './types';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';

import InputExtrinsic from '../InputExtrinsic';
import Params from '../Params';
import Base from './Base';

const transform = (value?: Extrinsic): ?Extrinsic$Params =>
  value && value.params;

export default function Proposal ({ label, subject, value }: Props): React$Node {
  const PrivateParams = withObservable(subject, { transform })(Params);

  return (
    <Base
      size='large'
      label={label}
    >
      <InputExtrinsic
        isPrivate
        subject={subject}
      />
      <PrivateParams />
    </Base>
  );
}
