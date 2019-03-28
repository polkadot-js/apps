import React from 'react';
import { Table } from 'semantic-ui-react';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import { MyAccountProps, withMyAccount } from '@polkadot/joy-utils/MyAccount';
import { withCalls } from '@polkadot/ui-api/index';
import { MemberId } from '@polkadot/joy-members/types';
import { queryMembershipToProp } from '@polkadot/joy-members/utils';
import { Request, Role } from '../types';
import { AccountId, Balance, Option } from '@polkadot/types';
import TxButton from '@polkadot/joy-utils/TxButton';
import BN from 'bn.js';
import { RoleParameters } from '../types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

type Props = BareProps & {
    memberId?: MemberId,
    requests: Array<Request>,
}

class ActionList extends React.PureComponent<Props> {
    render () {
        const { memberId, requests } = this.props
        if (memberId) {
            // filter requests for member
            const filteredRequests = requests.filter((request) => request[1].toString() == memberId.toString());

            if (filteredRequests.length) {
                return this.renderActions(filteredRequests)
            } else {
                return <div>No requests for member id: {memberId.toString()}</div>
            }

        } else {
            return <div>Selecte an account that is a member to see list of staking requests.</div>
        }
    }

    private renderActions(requests: Array<Request>) {
        return (
            <Table>
                <Table.Body>
                    {
                        requests.map((request: Request) => {
                            const account = request[0];
                            const role = request[2];
                            return <ActionDisplay account={account} role={role} key={request[0].toString()}></ActionDisplay>
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}

type ActionProps = BareProps & CallProps & {
    account: AccountId,
    role: Role,
    balance?: Balance,
    roleParams?: Option<RoleParameters>,
};

class Action extends React.PureComponent<ActionProps> {
    render() {
        const {account, role, balance, roleParams} = this.props;

        if (!balance || ! roleParams) return null;

        const params = roleParams.unwrapOr(undefined);
        if (!params) return null; // no role parameters defined for this role

        const minStake = new BN(params.get('min_stake') as Balance);
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
                        tx={'actors.stake'} />
                </Table.Cell>
            </Table.Row>
        )
    }
};

const ActionDisplay = withCalls<ActionProps>(
    ['query.balances.freeBalance', { propName: 'balance', paramName: 'account' }],
    ['query.actors.parameters', {propName: 'roleParams', paramName: 'role'}],
)(Action);

type WithMyMemberIdProps = MyAccountProps & {
    memberIdByAccountId?: Option<MemberId>,
    requests: Array<Request>,
};

function WithMyMemberIdInner (props: WithMyMemberIdProps) {
    if (props.memberIdByAccountId) {
        const memberId = props.memberIdByAccountId.unwrapOr(undefined);
        return <ActionList memberId={memberId} {...props}></ActionList>
    } else return <em>Loading...</em>;
}

const MyActionList = withMyAccount(withCalls<WithMyMemberIdProps>(
    queryMembershipToProp('memberIdByAccountId', 'myAddress')
)(WithMyMemberIdInner));


export default MyActionList;
