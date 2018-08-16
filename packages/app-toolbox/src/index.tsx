// Copyright 2017-2018 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import Navigation from '@polkadot/ui-app/Navigation';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';

import Hash from './Hash';
import Sign from './Sign';
import Verify from './Verify';
import translate from './translate';

type Actions = 'hash' | 'sign' | 'verify';

type Props = I18nProps & {
  basePath: string
};

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = { // Actions
  'hash': Hash,
  'sign': Sign,
  'verify': Verify
};

class ToolboxApp extends React.PureComponent<Props, State> {
  state: State = {
    action: 'hash'
  };

  render () {
    const { className, style } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <Page
        className={classes('toolbox--App', className)}
        style={style}
      >
        {this.renderButtons()}
        <Component />
      </Page>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { action } = this.state;

    return (
      <Navigation>
        <Button.Group>
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
      </Navigation>
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

export default translate(ToolboxApp);
