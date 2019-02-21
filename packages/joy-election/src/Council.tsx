import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Table } from 'semantic-ui-react';
import { formatBalance } from '@polkadot/ui-app/util';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';

import { calcBackersStake } from '@polkadot/joy-utils/index';
import { Seat } from '@polkadot/joy-utils/types';
import translate from './translate';
import Section from '@polkadot/joy-utils/Section';

type Props = ApiProps & I18nProps & {
  council?: Seat[]
};

type State = {};

class Council extends React.PureComponent<Props, State> {

  state: State = {};

  private renderTable (council: Seat[]) {
    return (
      <Table celled selectable compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell>Council member</Table.HeaderCell>
          <Table.HeaderCell>Own stake</Table.HeaderCell>
          <Table.HeaderCell>Backers' stake</Table.HeaderCell>
          <Table.HeaderCell>Backers count</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{council.map((seat, index) => (
        <Table.Row key={index}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>
            <AddressMini value={seat.member} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} />
          </Table.Cell>
          <Table.Cell>{formatBalance(seat.stake)}</Table.Cell>
          <Table.Cell>{formatBalance(calcBackersStake(seat.backers))}</Table.Cell>
          <Table.Cell>{seat.backers.length}</Table.Cell>
        </Table.Row>
      ))}</Table.Body>
      </Table>
    );
  }

  render () {
    const { council = [] } = this.props;
    // console.log({ council });
    return (
      <Section title='Active council members'>
      {!council.length
          ? <em>Council is not elected yet</em>
          : this.renderTable(council)
      }
      </Section>
    );
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.council.activeCouncil', { propName: 'council' }]
  )(Council)
);
