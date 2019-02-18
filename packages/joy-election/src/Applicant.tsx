import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { AccountId, Balance } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { BareProps, AppProps, I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { formatBalance } from '@polkadot/ui-app/util';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

import translate from './translate';
import { ZERO } from '@polkadot/joy-utils/index';

type Stake = {
  new: Balance,
  transferred: Balance
};

type Props = AppProps & ApiProps & BareProps & I18nProps & {
  index: number,
  accountId: AccountId,
  stake?: Stake
};

type State = {
};

class Applicant extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { index, accountId, stake } = this.props;
    // console.log('Applicant', accountId, 'with stake', stake);

    const totalStake = stake ? stake.new.add(stake.transferred) : ZERO;
    const voteUrl = `/election/votes?applicantId=${accountId.toString()}`;

    return (
      <Table.Row>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>
          <AddressMini value={accountId} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} />
        </Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>
          {formatBalance(totalStake)}
        </Table.Cell>
        <Table.Cell>
          <Link to={voteUrl} className='ui button primary inverted'>Vote</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.councilElection.applicantStakes',
      { paramName: 'accountId', propName: 'stake' }]
  )(Applicant)
);
