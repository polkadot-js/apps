// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import translate from './translate';

type Props = I18nProps & {
  value: any
};

class Referendum extends React.PureComponent<Props> {
  render () {
    const { className, style, t, value } = this.props;

    return (
      <div
        className={classes('democracy--Referendum', className)}
        style={style}
      >
        {JSON.stringify(value)}
      </div>
    );
  }
}

export default withMulti(
  Referendum,
  translate,
  withObservable('democracyProposals')
);
