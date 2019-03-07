import BN from 'bn.js';
import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Labelled } from '@polkadot/ui-app/index';
import { Balance } from '@polkadot/types';

import translate from './translate';
import TxButton from '@polkadot/joy-utils/TxButton';
import InputStake from '@polkadot/joy-utils/InputStake';
import { Stake } from '@polkadot/joy-utils/types';
import { calcTotalStake, ZERO } from '@polkadot/joy-utils/index';
import { MyAccountProps } from '@polkadot/joy-utils/MyAccount';

type Props = ApiProps & I18nProps & MyAccountProps & {
  minStake?: Balance,
  alreadyStaked?: Stake
};

type State = {
  stake: BN,
  isStakeValid: boolean
};

const DEFAULT_STATE: State = {
  stake: ZERO,
  isStakeValid: false
};

class ApplyForm extends React.PureComponent<Props, State> {

  state = DEFAULT_STATE;

  render () {
    const { stake, isStakeValid } = this.state;
    const hasAlreadyStakedEnough = this.alreadyStaked().gte(this.minStake());
    const minStake = hasAlreadyStakedEnough ? ZERO : this.minStake();
    const buttonLabel = hasAlreadyStakedEnough ? 'Add to your stake' : 'Apply to council';

    return (
      <div>
        <InputStake
          min={minStake}
          isValid={isStakeValid}
          onChange={this.onChangeStake}
        />
        <Labelled style={{ marginTop: '.5rem' }}>
          <TxButton
            size='large'
            isDisabled={!isStakeValid}
            label={buttonLabel}
            params={[stake]}
            tx='election.apply'
          />
        </Labelled>
      </div>
    );
  }

  private alreadyStaked = (): BN => {
    return calcTotalStake(this.props.alreadyStaked);
  }

  private minStake = (): BN => {
    return this.props.minStake || new BN(1);
  }

  private onChangeStake = (stake?: BN): void => {
    stake = stake || ZERO;
    const isStakeBigEnough = stake.add(this.alreadyStaked()).gte(this.minStake());
    const isStakeValid = !stake.isZero() && isStakeBigEnough;
    this.setState({ stake, isStakeValid });
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.councilElection.minCouncilStake',
      { propName: 'minStake' }],
    ['query.councilElection.applicantStakes',
      { paramName: 'myAddress', propName: 'alreadyStaked' }]
  )(ApplyForm)
);
