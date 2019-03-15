import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';

import Section from '@polkadot/joy-utils/Section';
import translate from './translate';

type Props = ApiProps & I18nProps & {};

type State = {};

class Dashboard extends React.PureComponent<Props, State> {

  state: State = {};

  renderConfig () {
    // const p = this.props;
    return <Section title='Configuration'>
      TODO render configuration
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
    // TODO queries to get config params like min/max len, etc.
  )(Dashboard)
);
