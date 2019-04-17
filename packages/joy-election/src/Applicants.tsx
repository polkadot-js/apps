import React from 'react';
import { Table } from 'semantic-ui-react';
import BN from 'bn.js';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { AccountId } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import translate from './translate';
import Applicant from './Applicant';
import ApplyForm from './ApplyForm';
import Section from '@polkadot/joy-utils/Section';
import { queryToProp } from '@polkadot/joy-utils/index';
import { withMyAccount, MyAccountProps } from '@polkadot/joy-utils/MyAccount';

type Props = ApiProps & I18nProps & MyAccountProps & {
  candidacyLimit?: BN,
  applicants?: Array<AccountId>
};

class Applicants extends React.PureComponent<Props> {

  private renderTable = (applicants: Array<AccountId>) => (
    <Table celled selectable compact>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>#</Table.HeaderCell>
        <Table.HeaderCell>Applicant</Table.HeaderCell>
        <Table.HeaderCell>Total stake</Table.HeaderCell>
        <Table.HeaderCell style={{ width: '1%' }}>Actions</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>{applicants.map((accountId, index) => (
      <Applicant key={index} index={index} accountId={accountId} />
    ))}</Table.Body>
    </Table>
  )

  render () {
    const { myAddress, applicants = [], candidacyLimit = new BN(0) } = this.props;
    const title = <span>Applicants <sup>{applicants.length}/{formatNumber(candidacyLimit)}</sup></span>;

    return <>
      <Section title='My application'>
        <ApplyForm myAddress={myAddress} />
      </Section>
      <Section title={title}>
      {!applicants.length
        ? <em>No applicants yet</em>
        : this.renderTable(applicants)
      }
      </Section>
    </>;
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('query.councilElection.candidacyLimit'),
    queryToProp('query.councilElection.applicants')
  )(withMyAccount(Applicants))
);
