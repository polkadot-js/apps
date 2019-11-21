// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Extrinsic } from '@polkadot/types/interfaces';
import { Props } from '../types';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call, Static } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';

import Bare from './Bare';
import Unknown from './Unknown';

export default function Proposal (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, label, style, withLabel } = props;

  if (!isDisabled) {
    return (
      <Unknown {...props} />
    );
  }

  const proposal = value as Extrinsic;
  const { method, section } = registry.findMetaCall(proposal.callIndex);

  return (
    <Bare>
      <Static
        className={classes(className, 'full')}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        {section}.{method}
      </Static>
      <Call value={proposal} />
    </Bare>
  );
}
