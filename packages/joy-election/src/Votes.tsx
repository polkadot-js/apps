import React from 'react';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import translate from './translate';
import SealedVotes from './SealedVotes';
import Section from '@polkadot/joy-utils/Section';
import { withMyAccount, MyAccountProps } from '@polkadot/joy-utils/MyAccount';
import { getVotesByVoter } from './myVotesStore';
import VoteForm from './VoteForm';

type Props = AppProps & ApiProps & I18nProps & MyAccountProps & {};

class Component extends React.PureComponent<Props> {
  render () {
    const { myAddress } = this.props;
    const myVotes = myAddress ? getVotesByVoter(myAddress) : [];

    return <>
      <Section title='My vote'>
        <VoteForm {...this.props} myAddress={myAddress} />
      </Section>
      <SealedVotes myAddress={myAddress} myVotes={myVotes} />
    </>;
  }
}

export default translate(
  withMyAccount(Component)
);
