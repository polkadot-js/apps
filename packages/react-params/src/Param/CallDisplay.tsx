// Copyright 2017-2021 @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Call from '../Call'
import { Static } from '@canvas-ui/react-components';
import React from 'react';

import { Extrinsic } from '@polkadot/types/interfaces';

import { Props } from '@canvas-ui/react-components/types';
import Bare from './Bare';
import Unknown from './Unknown';

function CallDisplay (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue: { value }, isDisabled, label, withLabel } = props;

  if (!isDisabled) {
    return (
      <Unknown {...props} />
    );
  }

  const call = value as Extrinsic;
  const { method, section } = call.registry.findMetaCall(call.callIndex);

  return (
    <Bare>
      <Static
        className={`${className} full`}
        label={label}
        withLabel={withLabel}
      >
        {section}.{method}
      </Static>
      <Call value={call} />
    </Bare>
  );
}

export default React.memo(CallDisplay);
