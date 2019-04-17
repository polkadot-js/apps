import BN from 'bn.js';
import uuid from 'uuid/v4';

import React from 'react';
import { Message, Table } from 'semantic-ui-react';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { AccountId, Balance } from '@polkadot/types';
import { Button, Input, Labelled, InputAddress } from '@polkadot/ui-app/index';
import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { formatBalance } from '@polkadot/util';

import translate from './translate';
import { accountIdsToOptions, hashVote } from './utils';
import { queryToProp, ZERO, getUrlParam, nonEmptyStr } from '@polkadot/joy-utils/index';
import TxButton from '@polkadot/joy-utils/TxButton';
import InputStake from '@polkadot/joy-utils/InputStake';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { MyAccountProps, withOnlyMembers } from '@polkadot/joy-utils/MyAccount';
import { saveVote, NewVote } from './myVotesStore';

// TODO use a crypto-prooven generator instead of UUID 4.
function randomSalt () {
  return uuid().replace(/-/g, '');
}

// AppsProps is needed to get a location from the route.
type Props = AppProps & ApiProps & I18nProps & MyAccountProps & {
  applicantId?: string,
  minVotingStake?: Balance,
  applicants?: AccountId[]
};

type State = {
  applicantId?: string,
  stake?: BN,
  salt?: string,
  isStakeValid?: boolean,
  isFormSubmitted: boolean
};

class Component extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);

    let { applicantId, location } = this.props;
    applicantId = applicantId ? applicantId : getUrlParam(location, 'applicantId');

    this.state = {
      applicantId,
      stake: ZERO,
      salt: randomSalt(),
      isFormSubmitted: false
    };
  }

  render () {
    const { myAddress } = this.props;
    const { applicantId, stake, salt, isStakeValid, isFormSubmitted } = this.state;
    const isFormValid = nonEmptyStr(applicantId) && isStakeValid;
    const applicantOpts = accountIdsToOptions(this.props.applicants || []);
    const hashedVote = hashVote(applicantId, salt);

    const buildNewVote = (): Partial<NewVote> => ({
      voterId: myAddress,
      applicantId,
      stake: (stake || ZERO).toString(),
      salt: salt,
      hash: hashedVote
    });

    return (
      <>{isFormSubmitted

      // Summary of submitted vote:
      ? <div>
        <Message info>
          Your vote has been sent
        </Message>
        <Table celled selectable compact definition className='SealedVoteTable'>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Applicant</Table.Cell>
            <Table.Cell><AddressMini value={applicantId} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} withMemo={true} /></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Stake</Table.Cell>
            <Table.Cell>{formatBalance(stake)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Salt</Table.Cell>
            <Table.Cell><code>{salt}</code></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Hashed vote</Table.Cell>
            <Table.Cell><code>{hashedVote}</code></Table.Cell>
          </Table.Row>
        </Table.Body>
        </Table>
        <Labelled style={{ marginTop: '.5rem' }}>
          <Button
            size='large'
            label='Submit another vote'
            onClick={this.resetForm}
          />
        </Labelled>
      </div>

      // New vote form:
      : <div>
        <div className='ui--row'>
          <InputAddress
            label='Applicant to vote for:'
            onChange={this.onChangeApplicant}
            type='address'
            options={applicantOpts}
            value={applicantId}
            placeholder='Select an applicant you support'
          />
        </div>
        <InputStake
          min={this.minStake()}
          isValid={isStakeValid}
          onChange={this.onChangeStake}
        />
        <div className='ui--row'>
          <Input
            className='large'
            isDisabled={true}
            label='Random salt:'
            value={salt}
            onChange={this.onChangeSalt}
          />
          <div className='medium' style={{ margin: '.5rem' }}>
            <Button onClick={this.newRandomSalt}>Generate</Button>
            <Message compact warning size='tiny' content='You need to remember this salt!' />
          </div>
        </div>
        <div className='ui--row'>
          <Input
            isDisabled={true}
            label='Hashed vote:'
            value={hashedVote}
          />
        </div>
        <Labelled style={{ marginTop: '.5rem' }}>
          <TxButton
            size='large'
            isDisabled={!isFormValid}
            label='Submit my vote'
            params={[hashedVote, stake]}
            tx='election.vote'
            txSentCb={this.onFormSubmitted}
            txFailedCb={this.onTxFailed}
            txSuccessCb={(txResult: SubmittableResult) => this.onTxSuccess(buildNewVote() as NewVote, txResult)}
          />
        </Labelled>
      </div>}
      </>
    );
  }

  private resetForm = (): void => {
    this.onChangeStake(ZERO);
    this.newRandomSalt();
    this.setState({ isFormSubmitted: false });
  }

  private onFormSubmitted = (): void => {
    this.setState({ isFormSubmitted: true });
  }

  private onTxFailed = (_txResult: SubmittableResult): void => {
    // TODO Possible UX improvement: tell a user that his vote hasn't been accepted.
  }

  private onTxSuccess = (vote: NewVote, txResult: SubmittableResult): void => {
    let hasVotedEvent = false;
    txResult.events.forEach((event, i) => {
      const { section, method } = event.event;
      if (section === 'election' && method === 'Voted') {
        hasVotedEvent = true;
      }
    });
    if (hasVotedEvent) {
      saveVote(vote);
      this.setState({ isFormSubmitted: true });
    }
  }

  private newRandomSalt = (): void => {
    this.setState({ salt: randomSalt() });
  }

  private minStake = (): BN => {
    return this.props.minVotingStake || new BN(1);
  }

  private onChangeStake = (stake?: BN) => {
    const isStakeValid = stake && stake.gte(this.minStake());
    this.setState({ stake, isStakeValid });
  }

  private onChangeApplicant = (applicantId?: string) => {
    this.setState({ applicantId });
  }

  private onChangeSalt = (salt?: string) => {
    // TODO check that salt is unique by checking Substrate store.
    this.setState({ salt });
  }
}

export default withMulti(
  Component,
  translate,
  withOnlyMembers,
  withCalls<Props>(
    queryToProp('query.councilElection.minVotingStake'),
    queryToProp('query.councilElection.applicants')
  )
);
