import React from 'react'
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../props';
import { withCalls } from '@polkadot/ui-api/index';
import { Table } from 'semantic-ui-react';
import { Option} from '@polkadot/types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { Actor } from '../types';
import { MemberId } from '@polkadot/joy-members/types';
import { MyAccountProps, withMyAccount } from '@polkadot/joy-utils/MyAccount';
import { queryMembershipToProp } from '@polkadot/joy-members/utils';
import TxButton from '@polkadot/joy-utils/TxButton';

type MemberIdProps = {
    memberIdByAccountId?: Option<MemberId>,
};

type Props = BareProps & ComponentProps & MyAccountProps & MemberIdProps;

class ActorsList extends React.PureComponent<Props> {
    render() {
        const { actorAccountIds, memberIdByAccountId } = this.props;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Member Id</Table.HeaderCell>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Actor Account</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{ actorAccountIds.map((account: string) =>
                    <ActorDisplay key={account} account={account} memberIdByAccountId={memberIdByAccountId} />
                )}
                </Table.Body>
            </Table>
        )
    }
}


type ActorProps = BareProps & MemberIdProps & {
    account: string,
    actor?: Option<Actor>
}

class ActorInner extends React.PureComponent<ActorProps> {
    render() {
        const { actor: actorOpt , memberIdByAccountId: memberIdOpt} = this.props;

        if (!actorOpt || actorOpt.isNone || !memberIdOpt) return null;

        const actor = actorOpt.unwrap();

        const memberId = memberIdOpt.isSome ? memberIdOpt.unwrap() : undefined;

        return (
            <Table.Row>
                <Table.Cell>{actor.member_id.toString()}</Table.Cell>
                <Table.Cell>{actor.role.toString()}</Table.Cell>
                <Table.Cell><AddressMini value={actor.account} isShort={false} isPadded={false} withBalance={true} withName={true} withMemo={true} size={36} /></Table.Cell>
                <Table.Cell>{this.renderMemberCell(memberId, actor)}</Table.Cell>
            </Table.Row>
        )
    }

    private renderMemberCell(memberId: MemberId | undefined, actor: Actor) {
        const memberIsActor = memberId && (memberId.toString() == actor.member_id.toString());

        if (memberIsActor) {
            return <TxButton tx={'actors.unstake'} params={[actor.account]} label={'Unstake'}
                type='submit' size='large' isDisabled={false} />
        } else {
            return actor.member_id.toString()
        }
    }
}

const ActorDisplay = withCalls<ActorProps>(
    ['query.actors.actorByAccountId', {propName: 'actor', paramName: 'account'}]
)(ActorInner)


const ActionableActorsList = withMyAccount(withCalls<Props>(
    queryMembershipToProp('memberIdByAccountId', 'myAddress')
)(ActorsList));

export default ActionableActorsList;