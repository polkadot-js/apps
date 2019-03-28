import React from 'react'
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../props';
import { withCalls } from '@polkadot/ui-api/index';
import { Table } from 'semantic-ui-react';
import { Option} from '@polkadot/types';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

type Props = BareProps & ComponentProps;

export default class ActorsList extends React.PureComponent<Props> {
    render() {
        const actors: Array<string> = this.props.actors;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Actor Account</Table.HeaderCell>
                        <Table.HeaderCell>Member Id</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {actors.map((account: string) => <ActorDisplay key={account} account={account}/>)}
                </Table.Body>
            </Table>
        )
    }
}


type ActorProps = BareProps & {
    account: string,
    actor?: Option<any>, // Option<Actor>
}

class ActorInner extends React.PureComponent<ActorProps> {
    render() {
        const { actor: actorOpt } = this.props;

        if (!actorOpt || actorOpt.isNone) return null;

        const actor = actorOpt.unwrap();

        return (
            <Table.Row>
                <Table.Cell>{actor.role.toString()}</Table.Cell>
                <Table.Cell><AddressMini value={this.props.account} isShort={false} isPadded={false} withBalance={true} withName={true} withMemo={true} size={36} /></Table.Cell>
                <Table.Cell>{actor.member_id.toString()}</Table.Cell>
            </Table.Row>
        )
    }
}

const ActorDisplay = withCalls<ActorProps>(
    ['query.actors.actorsByAccountId', {propName: 'actor', paramName: 'account'}]
)(ActorInner)