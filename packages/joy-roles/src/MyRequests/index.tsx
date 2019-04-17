import React from 'react';
import { Table } from 'semantic-ui-react';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import { MyAccountProps, withOnlyMembers } from '@polkadot/joy-utils/MyAccount';
import { withCalls, withMulti } from '@polkadot/ui-api/index';
import { Request, Role, RoleParameters } from '../types';
import { AccountId, Balance, Option } from '@polkadot/types';
import TxButton from '@polkadot/joy-utils/TxButton';
import BN from 'bn.js';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { ComponentProps } from '../props';

type Props = BareProps & ComponentProps & MyAccountProps & {
    requests: Array<Request>
};

class ActionList extends React.PureComponent<Props> {
    render () {
        const { myMemberId, requests } = this.props;
        if (!myMemberId) {
            return <em>Loading...</em>;
        }

        // filter requests for member
        const filteredRequests = requests.filter((request) => request[1].toString() === myMemberId.toString());

        if (filteredRequests.length) {
            return this.renderActions(filteredRequests);
        } else {
            return <div>No requests for member id: {myMemberId.toString()}</div>;
        }
    }

    private renderActions (requests: Array<Request>) {
        return (
            <Table>
                <Table.Body>
                    {
                        requests.map(([account, _, role]: Request) => {
                            return <ActionDisplay account={account} role={role} key={account.toString()}></ActionDisplay>;
                        })
                    }
                </Table.Body>
            </Table>
        );
    }
}

type ActionProps = BareProps & CallProps & {
    account: AccountId,
    role: Role,
    balance?: Balance,
    roleParams?: Option<RoleParameters>
};

class Action extends React.PureComponent<ActionProps> {
    render () {
        const { account, role, balance, roleParams } = this.props;

        if (!balance || !roleParams || roleParams.isNone) return null;

        const params = roleParams.unwrap();

        const minStake = new BN(params.min_stake);
        const canStake = balance.gte(minStake);

        return (
            <Table.Row>
                <Table.Cell><AddressMini value={account} isShort={false} isPadded={false} withBalance={true} withName={true} withMemo={false} size={36}/></Table.Cell>
                <Table.Cell>{role.toString()}</Table.Cell>
                <Table.Cell>{canStake ? null : `(minimum required balance: ${minStake.toString()})`}</Table.Cell>
                <Table.Cell>
                    <TxButton
                        type='submit'
                        size='large'
                        label={'Stake'}
                        isDisabled={!canStake}
                        params={[role, account]}
                        tx={'actors.stake'}
                    />
                </Table.Cell>
            </Table.Row>
        );
    }
}

const ActionDisplay = withCalls<ActionProps>(
    ['query.balances.freeBalance', { propName: 'balance', paramName: 'account' }],
    ['query.actors.parameters', { propName: 'roleParams', paramName: 'role' }]
)(Action);

export default withMulti(
    ActionList,
    withOnlyMembers
);
