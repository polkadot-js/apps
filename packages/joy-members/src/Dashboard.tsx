import React from 'react';
import BN from 'bn.js';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Bubble } from '@polkadot/ui-app/index';
import { formatNumber } from '@polkadot/ui-app/util';

import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import { queryMembershipToProp } from './utils';

type Props = ApiProps & I18nProps & {
  minHandleLength?: BN,
  maxHandleLength?: BN,
  maxAvatarUriLength?: BN,
  maxAboutTextLength?: BN
};

type State = {};

class Dashboard extends React.PureComponent<Props, State> {

  state: State = {};

  renderConfig () {
    const p = this.props;
    return <Section title='Configuration'>
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
        {this.renderConfig()}
      </div>
    );
  }
}

export default translate(
  withCalls<Props>(
    queryMembershipToProp('minHandleLength'),
    queryMembershipToProp('maxHandleLength'),
    queryMembershipToProp('maxAvatarUriLength'),
    queryMembershipToProp('maxAboutTextLength')
  )(Dashboard)
);
