// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';

import Hash from './Hash';
import Sign from './Sign';
import Verify from './Verify';
import translate from './translate';

type Actions = 'hash' | 'sign' | 'verify';

type Props = I18nProps & {};

type State = {
  action: Actions
}

// FIXME React-router would probably be the best route, not home-grown
// flowlint-next-line unclear-type:off
const Components: { [Actions]: React$ComponentType<any> } = {
  'hash': Hash,
  'sign': Sign,
  'verify': Verify
};

class App extends React.PureComponent<Props, State> {
  state: State = {
    action: 'hash'
  };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <div
        className={classes('toolbox--App', className)}
        style={style}
      >
        <Button.Group className='accounts--App-navigation'>
          <Button
            isPrimary={action === 'hash'}
            onClick={this.selectHash}
            text={t('app.hash', {
              defaultValue: 'Hash data'
            })}
          />
          <Button.Or />
          <Button
            isPrimary={action === 'sign'}
            onClick={this.selectSign}
            text={t('app.sign', {
              defaultValue: 'Sign message'
            })}
          />
          <Button.Or />
          <Button
            isPrimary={action === 'verify'}
            onClick={this.selectVerify}
            text={t('app.verify', {
              defaultValue: 'Verify signature'
            })}
          />
        </Button.Group>
        <Component />
      </div>
    );
  }

  selectHash = (): void => {
    this.setState({ action: 'hash' });
  }

  selectSign = (): void => {
    this.setState({ action: 'sign' });
  }

  selectVerify = (): void => {
    this.setState({ action: 'verify' });
  }
}

export default translate(App);
