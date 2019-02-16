import BN from 'bn.js';
import React from 'react';

import { BlockNumber } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps, I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Bubble } from '@polkadot/ui-app/index';
import { formatBalance, formatNumber } from '@polkadot/ui-app/util';

import { ElectionStage } from '@polkadot/joy-utils/types';
import translate from './translate';

type Props = BareProps & ApiProps & I18nProps & {
  chain_bestNumber?: BN,
  councilElection_round?: BN,
  councilElection_stage?: ElectionStage
};

type State = {};

class SummaryBar extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const {
      chain_bestNumber,
      councilElection_round,
      councilElection_stage
    } = this.props;

    let stageName: string;
    let endsAt: BlockNumber;
    if (councilElection_stage) {
      endsAt = councilElection_stage.value as BlockNumber;
      stageName = endsAt.constructor.name;
    }

    let leftBlocks = null;
    if (endsAt && chain_bestNumber) {
      leftBlocks = endsAt.sub(chain_bestNumber);
    }

    console.log({ councilElection_stage });

    return (
      <summary>
        <div>
          <Bubble icon='target' label='Election round #'>
            {formatNumber(councilElection_round)}
          </Bubble>
          <Bubble label='Stage'>
            {stageName}
          </Bubble>
          <Bubble icon='flag checkered' label='Ends at block #'>
            {formatNumber(endsAt)}
          </Bubble>
          <Bubble label='Blocks left'>
            {formatNumber(leftBlocks)}
          </Bubble>
        </div>
      </summary>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    'derive.chain.bestNumber',
    'query.councilElection.round',
    'query.councilElection.stage'
  )(SummaryBar)
);
