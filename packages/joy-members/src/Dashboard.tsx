import React from 'react';
import BN from 'bn.js';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Bubble } from '@polkadot/ui-app/index';
import { formatNumber } from '@polkadot/util';
import { Bool } from '@polkadot/types';

import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import { queryMembershipToProp } from './utils';

type Props = ApiProps & I18nProps & {
  newMembershipsAllowed?: Bool,
  firstMemberId?: BN,
  nextMemberId?: BN,
  minHandleLength?: BN,
  maxHandleLength?: BN,
  maxAvatarUriLength?: BN,
  maxAboutTextLength?: BN
};

class Dashboard extends React.PureComponent<Props> {

  renderGeneral () {
    const p = this.props;
    const { newMembershipsAllowed: isAllowed } = p;
    let isAllowedColor = '';
    if (isAllowed) {
      isAllowedColor = isAllowed.eq(true) ? 'green' : 'red';
    }
    return <Section title='General'>
      <Bubble label='New memberships allowed?' className={isAllowedColor}>
        {isAllowed && (isAllowed.eq(true) ? 'Yes' : 'No')}
      </Bubble>
      <Bubble label='Next member ID'>
        {formatNumber(p.nextMemberId)}
      </Bubble>
      <Bubble label='First member ID'>
        {formatNumber(p.firstMemberId)}
      </Bubble>
    </Section>;
  }

  renderValidation () {
    const p = this.props;
    return <Section title='Validation'>
      <Bubble label='Min. length of handle'>
        {formatNumber(p.minHandleLength)} chars
      </Bubble>
      <Bubble label='Max. length of handle'>
        {formatNumber(p.maxHandleLength)} chars
      </Bubble>
      <Bubble label='Max. length of avatar URI'>
        {formatNumber(p.maxAvatarUriLength)} chars
      </Bubble>
      <Bubble label='Max. length of about'>
        {formatNumber(p.maxAboutTextLength)} chars
      </Bubble>
    </Section>;
  }

  render () {
    return (
      <div className='JoySections'>
        {this.renderGeneral()}
        {this.renderValidation()}
      </div>
    );
  }
}

export default translate(
  withCalls<Props>(
    queryMembershipToProp('newMembershipsAllowed'),
    queryMembershipToProp('firstMemberId'),
    queryMembershipToProp('nextMemberId'),
    queryMembershipToProp('minHandleLength'),
    queryMembershipToProp('maxHandleLength'),
    queryMembershipToProp('maxAvatarUriLength'),
    queryMembershipToProp('maxAboutTextLength')
  )(Dashboard)
);
