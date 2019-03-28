import React from 'react'
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../props';
import { Role, RoleParameters } from  '../types';
import { Option, AccountId } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/index';
import { Table } from 'semantic-ui-react';
import Section from '@polkadot/joy-utils/Section';
import { formatBalance } from '@polkadot/ui-app/util';

import BN from 'bn.js';

type Props = BareProps & ComponentProps;

export default class AvailableRoles extends React.PureComponent<Props> {
    render() {
        return (
            <div>{this.props.roles.map((role) =>
                <div key={role.toString()}><RoleDisplay role={role} /></div>)
             }</div>
        )
    }
}


type RoleProps = BareProps & {
    role: Role,
    roleParams?: Option<RoleParameters>,
    actors?: Array<AccountId>
}

class RoleDisplayInner extends React.PureComponent<RoleProps> {
    render() {
        const {role, roleParams, actors} = this.props;
        if (!roleParams || roleParams.isNone || !actors) return <em>Loading...</em>;

        const params = roleParams.unwrap();

        return (
            <Section title={role.toString()}>
                <Parameters role={role} params={params} active={actors.length}></Parameters>
            </Section>
        )
    }
}

const RoleDisplay = withCalls<RoleProps>(
    ['query.actors.parameters', {propName: 'roleParams', paramName: 'role'}],
    ['query.actors.accountsByRole', {propName: 'actors', paramName: 'role'}],
)(RoleDisplayInner)


type ParamProps = BareProps & {
    role: Role,
    params: RoleParameters,
    active: number,
}

const Parameters = function Parameters(props: ParamProps) {
    const {params, role, active} = props;

    const minStake = formatBalance(new BN(params.min_stake));
    const maxActors = (new BN(params.max_actors)).toString();
    const reward = formatBalance(new BN(params.reward));
    const rewardPeriod = (new BN(params.reward_period)).toString();
    const unbondingPeriod = (new BN(params.unbonding_period)).toString();

    return(
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Role Id</Table.HeaderCell>
                    <Table.HeaderCell>{role.toNumber()}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>Minimum Stake</Table.Cell>
                    <Table.Cell>{minStake}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Actors</Table.Cell>
                    <Table.Cell>{active}/{maxActors}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Reward</Table.Cell>
                    <Table.Cell>{reward}, every {rewardPeriod} blocks</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Unbonding Period</Table.Cell>
                    <Table.Cell>{unbondingPeriod} blocks</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
};