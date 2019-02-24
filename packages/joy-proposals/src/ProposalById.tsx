import BN from 'bn.js';
import React from 'react';
import { I18nProps } from '@polkadot/ui-app/types';

import translate from './translate';
import Details from './Details';

type Props = I18nProps & {
  match: {
    params: {
      id: string
    }
  }
};

type State = {};

export class Component extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { match: { params: { id } } } = this.props;
    return <Details id={new BN(id)} />;
  }
}

export default translate(Component);
