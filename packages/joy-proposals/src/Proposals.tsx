import React from 'react';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import NewProposal from './NewForm';
import translate from './translate';
import List from './List';

type Props = AppProps & I18nProps;

type State = {};

export class App extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    return (
      <div>
        <NewProposal />
        <section style={{ margin: '1rem 0' }}>
          <h2>Proposals</h2>
          <List />
        </section>
      </div>
    );
  }
}

export default translate(App);
