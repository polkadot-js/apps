import React from 'react';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import Summary from './Summary';
import ApplyForm from './ApplyForm';
import translate from './translate';
import Applicants from './Applicants';

type Props = AppProps & I18nProps;

type State = {
  accountId?: string
};

export class App extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    return (
      <div>
        <Summary />
        <ApplyForm />
        <section style={{ margin: '1rem 0' }}>
          <h2>Applicants</h2>
          <Applicants />
        </section>
      </div>
    );
  }
}

export default translate(App);
