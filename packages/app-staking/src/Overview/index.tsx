// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';

import IntensionsList from './IntensionsList';
import ValidatorsList from './ValidatorsList';
import Summary from './Summary';

type Props = I18nProps & {
  intentions: Array<string>,
  validators: Array<string>
};

export default class Overview extends React.PureComponent<Props> {
  render () {
    const { className, intentions, style, validators } = this.props;
    const intentionsExVal = intentions.filter((address) =>
      !validators.includes(address)
    );

    return (
      <div
        className={classes('staking--Overview', className)}
        style={style}
      >
        <Summary
          intentions={intentions}
          validators={validators}
        />
        <h1>Validators: {validators.length}</h1>
        <ValidatorsList
          validators={validators}
        />
        <h1>Intentions: {intentionsExVal.length + validators.length}</h1>
        <IntensionsList
          intentions={intentionsExVal}
        />
      </div>
    );
  }
}
