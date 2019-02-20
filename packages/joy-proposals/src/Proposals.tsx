import React from 'react';
import { I18nProps } from '@polkadot/ui-app/types';

import Section from '@polkadot/joy-utils/Section';
import translate from './translate';
import List from './List';

type Props = I18nProps & {
  title: string,
  showActive?: boolean,
  showAccepted?: boolean,
  showRejected?: boolean,
  showSlashed?: boolean
};

type State = {};

export class App extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { title } = this.props;
    return (
      <Section title={title || 'Proposals'}>
        <List />
      </Section>
    );
  }
}

export default translate(App);
