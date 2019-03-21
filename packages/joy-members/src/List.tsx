import BN from 'bn.js';
import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import Details from './Details';
import { MemberId } from './types';

type Props = ApiProps & I18nProps & {
  firstMemberId: BN,
  nextMemberId: BN
};

type State = {};

class Component extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const {
      firstMemberId,
      nextMemberId
    } = this.props;

    const membersCount = nextMemberId.sub(firstMemberId).toNumber();
    const ids: MemberId[] = [];
    if (membersCount > 0) {
      const firstId = firstMemberId.toNumber();
      const lastId = nextMemberId.toNumber();
      for (let i = firstId; i < lastId; i++) {
        ids.push(new MemberId(i));
      }
    }

    return (
      <Section title={`Members (${membersCount})`}>{
        ids.length === 0
          ? <em>No registered members yet.</em>
          : <div className='ui huge relaxed middle aligned divided list ProfilePreviews'>
              {ids.map((id, i) =>
                <Details {...this.props} key={i} memberId={id} preview />
              )}
            </div>
      }</Section>
    );
  }
}

export default translate(Component);
