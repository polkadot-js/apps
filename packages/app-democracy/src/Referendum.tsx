// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { RxReferendum } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import Labelled from '@polkadot/ui-app/Labelled';
import VoteThreshold from '@polkadot/ui-app/Params/Param/VoteThreshold';
import classes from '@polkadot/ui-app/util/classes';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  bestNumber?: BN,
  value: RxReferendum
};

class Referendum extends React.PureComponent<Props> {
  render () {
    const { className, style, value } = this.props;

    return (
      <Item
        className={classes('democracy--Referendum', className)}
        idNumber={value.id}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
        style={style}
      >
        {this.renderVoting()}
      </Item>
    );
  }

  private renderExtra () {
    const { bestNumber, t, value: { blockNumber, voteThreshold } } = this.props;

    if (!bestNumber) {
      return null;
    }

    return (
      <div className='democracy--Referendum-info'>
        <Labelled label={t('referendum.endLabel', {
          defaultValue: 'remaining time'
        })}>
          {t('referendum.endInfo', {
            defaultValue: 'ending at block #{{blockNumber}}, {{remaining}} blocks remaining',
            replace: {
              blockNumber: numberFormat(blockNumber),
              remaining: numberFormat(blockNumber.sub(bestNumber))
            }
          })}
        </Labelled>
        <VoteThreshold
          isDisabled
          defaultValue={{ value: voteThreshold } as RawParam}
          label={t('referendum.thresholdLabel', {
            defaultValue: 'vote threshold'
          })}
          name='voteThreshold'
        />
      </div>
    );
  }

  private renderVoting () {
    return 'extra voting stuff goes here';
  }
}

export default withMulti(
  Referendum,
  translate,
  withObservable('bestNumber'),
  withObservable('democracyProposals')
);
