import BN from 'bn.js';
import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Labelled } from '@polkadot/ui-app/index';
import { Balance } from '@polkadot/types';

import translate from './translate';
import AccountSelector from '@polkadot/joy-utils/AccountSelector';
import TxButton from '@polkadot/joy-utils/TxButton';
import InputStake from '@polkadot/joy-utils/InputStake';

type Props = ApiProps & I18nProps & {
  minStake?: Balance
};

type State = {
  accountId?: string,
  stake?: BN,
  isStakeValid?: boolean
};

class ApplyForm extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { accountId, stake, isStakeValid } = this.state;

    return (
      <div>
        <AccountSelector onChange={this.onChangeAccount} />
        <InputStake
          min={this.minStake()}
          isValid={isStakeValid}
          onChange={this.onChangeStake}
        />
        <Labelled style={{ marginTop: '.5rem' }}>
          <TxButton
            size='large'
            isDisabled={!isStakeValid}
            accountId={accountId}
            label='Apply to council'
            params={[stake]}
            tx='election.apply'
          />
        </Labelled>
      </div>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  private minStake = (): BN => {
    return this.props.minStake || new BN(1);
  }

  private onChangeStake = (stake?: BN): void => {
    const isStakeValid = stake && stake.gte(this.minStake());
    this.setState({ stake, isStakeValid });
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.councilElection.minCouncilStake', { propName: 'minStake' }]
  )(ApplyForm)
);
