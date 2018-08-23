// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ExtrinsicDecoded } from '@polkadot/params/types';
import { Props } from '../types';

import React from 'react';

import Extrinsic from '../../Extrinsic';
import Static from '../../Static';
import classes from '../../util/classes';
import Bare from './Bare';
import Unknown from './Unknown';

export default class Proposal extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, label, style, withLabel } = this.props;

    if (!isDisabled) {
      return (
        <Unknown {...this.props} />
      );
    }

    const proposal = value as ExtrinsicDecoded;
    const { extrinsic: { name, section } } = proposal;

    return (
      <Bare>
        <Static
          className={classes(className, 'full')}
          label={label}
          style={style}
          withLabel={withLabel}
        >
          {section}.{name}
        </Static>
        <Extrinsic value={proposal} />
      </Bare>
    );
  }
}
