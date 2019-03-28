import React from 'react'
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../props';
import { Role, RoleParameters } from  '../types';
import { Option, u32, Balance, BlockNumber } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api/index';
import { Table } from 'semantic-ui-react';
import Section from '@polkadot/joy-utils/Section';

import BN from 'bn.js';

type Props = BareProps & ComponentProps;

export default class AvailableRoles extends React.PureComponent<Props> {
    render() {
        return (
            <div> {this.props.roles.map((role) => <div key={role.toString()}><RoleDisplay role={role}></RoleDisplay></div>) } </div>
        )
    }
}


type RoleProps = BareProps & {
    role: Role,
    roleParams?: Option<RoleParameters>
}

class RoleDisplayInner extends React.PureComponent<RoleProps> {
    render() {
        const {role, roleParams} = this.props;
        if (!roleParams) return null;

        const params = roleParams.unwrapOr(undefined);
        if (!params) return null; // no role parameters defined for this role

        return (
            <Section title={`${role.toString()}`}>
                <Parameters role={role} params={params}></Parameters>
            </Section>
        )
    }
}

const RoleDisplay = withCalls<RoleProps>(
    ['query.actors.parameters', {propName: 'roleParams', paramName: 'role'}]
)(RoleDisplayInner)


type ParamProps = BareProps & {
    role: Role,
    params: RoleParameters
}

const Parameters = function Parameters(props: ParamProps) {
    const {params, role} = props;

    const minStake = new BN(params.get('min_stake') as Balance);
    const maxActors = new BN(params.get('max_actors') as u32);
    const reward = new BN(params.get('reward') as Balance);
    const rewardPeriod = new BN(params.get('reward_period') as BlockNumber);
    const unbondingPeriod = new BN(params.get('unbonding_period') as BlockNumber);

    return(
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>RoleId</Table.HeaderCell>
                    <Table.HeaderCell>{role.toNumber()}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>Minimum Stake</Table.Cell>
                    <Table.Cell>{minStake.toString()} JOY</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Maximum Actors</Table.Cell>
                    <Table.Cell>{maxActors.toString()}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Reward</Table.Cell>
                    <Table.Cell>{reward.toString()} JOY, every {rewardPeriod.toString()} blocks</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Unbonding Period</Table.Cell>
                    <Table.Cell>{unbondingPeriod.toString()} blocks</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
};