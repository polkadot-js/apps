import React from 'react';
import { Table } from 'semantic-ui-react';

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { AccountId } from '@polkadot/types';

import translate from './translate';
import Applicant from './Applicant';
import ApplyForm from './ApplyForm';
import Section from '@polkadot/joy-utils/Section';
import { withMyAccount, MyAccountProps } from '@polkadot/joy-utils/MyAccount';

type Props = ApiProps & I18nProps & MyAccountProps & {
  applicants?: Array<AccountId>
};

type State = {};

class Applicants extends React.PureComponent<Props, State> {

  state: State = {};

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
    const { myAddress, applicants = [] } = this.props;
    // console.log({ applicants });

    return <>
      <ApplyForm myAddress={myAddress} />
      <Section title='Applicants'>
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
    ['query.councilElection.applicants', { propName: 'applicants' }]
  )(withMyAccount(Applicants))
);
