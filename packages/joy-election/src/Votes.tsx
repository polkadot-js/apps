import BN from 'bn.js';
import uuid from 'uuid/v4';

import React from 'react';
import { Message } from 'semantic-ui-react';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import { AccountId, Balance } from '@polkadot/types';
import { Button, Input, Labelled, InputAddress } from '@polkadot/ui-app/index';

import translate from './translate';
import { accountIdsToOptions, hashVote } from './utils';
import { queryToProp, ZERO, getUrlParam } from '@polkadot/joy-utils/index';
import SealedVotes from './SealedVotes';
import AccountSelector from '@polkadot/joy-utils/AccountSelector';
import TxButton from '@polkadot/joy-utils/TxButton';
import InputStake from '@polkadot/joy-utils/InputStake';
import Section from '@polkadot/joy-utils/Section';

// TODO use a crypto-prooven generator instead of UUID 4.
function randomSalt () {
  return uuid().replace(/-/g, '');
}

// AppsProps is needed to get a location from the route.
type Props = AppProps & ApiProps & I18nProps & {
  accountId?: string,
  applicantId?: string,
  minVotingStake?: Balance,
  applicants?: AccountId[]
};

type State = {
  accountId?: string,
  applicantId?: string,
  stake?: BN,
  salt?: string,
  isStakeValid?: boolean,
  isFormValid?: boolean
};

class Component extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);

    let { accountId, applicantId, location } = this.props;
    applicantId = applicantId ? applicantId : getUrlParam(location, 'applicantId');

    this.state = {
      accountId,
      applicantId,
      stake: ZERO,
      salt: randomSalt()
    };
  }

  render () {
    const { accountId, applicantId, stake, salt, isStakeValid, isFormValid } = this.state;
    const applicantOpts = accountIdsToOptions(this.props.applicants || []);
    const hashedVote = hashVote(applicantId, salt);

    return (
      <div>
        <AccountSelector onChange={this.onChangeAccount} />
        <div className='ui--row'>
          <InputAddress
            label='Applicant to vote for:'
            onChange={this.onChangeApplicant}
            type='address'
            addresses={applicantOpts}
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
            accountId={accountId}
            label='Submit my vote'
            params={[hashedVote, stake]}
            tx='election.vote'
            onAfterClick={this.newRandomSalt}
            // TODO save to unstated or local storage the next values: hashedVote, applicantId, salt
          />
        </Labelled>
        <Section title='Submitted votes'>
          <SealedVotes />
        </Section>
      </div>
    );
  }

  private newRandomSalt = (): void => {
    this.setState({ salt: randomSalt() });
  }

  private minStake = (): BN => {
    return this.props.minVotingStake || new BN(1);
  }

  private onChangeStake = (stake?: BN) => {
    const isStakeValid = stake && stake.gte(this.minStake());
    const isFormValid = isStakeValid;
    this.setState({ stake, isStakeValid, isFormValid });
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  private onChangeApplicant = (applicantId?: string) => {
    this.setState({ applicantId });
  }

  private onChangeSalt = (salt?: string) => {
    // TODO check that salt is unique by checking Substrate store.
    this.setState({ salt });
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    queryToProp('query.councilElection.minVotingStake'),
    queryToProp('query.councilElection.applicants')
  )(Component)
);
