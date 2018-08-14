// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ExtendedBalanceMap } from '@polkadot/ui-react-rx/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';

import IntensionsList from './IntensionsList';
import ValidatorsList from './ValidatorsList';
import Summary from './Summary';

type Props = I18nProps & {
  balances: ExtendedBalanceMap,
  intentions: Array<string>,
  validators: Array<string>
};

export default class Overview extends React.PureComponent<Props> {
  getNextValidators() {
    const { intentions, balances } = this.props;
    // console.log(balances);
    // const sorted = intentions.sort((a, b) => {
    //   return balances[a].stakingBalance.cmp(balances[b].stakingBalance);
    // })

    return intentions;
  }

  render () {
    const { className, balances, intentions, style, validators } = this.props;
    const intentionsExVal = intentions.filter((address) =>
      !validators.includes(address)
    );

    const next = this.getNextValidators();

    return (
      <div
        className={classes('staking--Overview', className)}
        style={style}
      >
        <Summary
          balances={balances}
          intentions={intentions}
          validators={validators}
        />

        <ValidatorsList
          current={validators}
          next={intentions}
        />
      {/*  <h1>Intentions: {intentionsExVal.length + validators.length}</h1>
        <IntensionsList
          intentions={intentionsExVal}
        />*/}
      </div>
    );
  }
}
