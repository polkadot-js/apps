// Copyright 2017-2018 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import './index.css';
import React from 'react';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';
import translate from './translate';
import Endpoint from './Endpoint';

type Props = I18nProps & {};

type Actions = 'endpoint' ;

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'endpoint': Endpoint
};

class SettingsApp extends React.PureComponent<Props, State> {
  state: State = {
    action: 'endpoint'
  };

  render () {
    const { className, style } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <div
        className={classes('settings--App', className)}
        style={style}
      >
        {this.renderButtons()}
        <Component />
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { action } = this.state;

    return (
      <Button.Group className='accounts--App-navigation'>
        <Button
          isPrimary={action === 'endpoint'}
          onClick={this.selectEndpoint}
          text={t('app.endpoint', {
            defaultValue: 'Endpoint'
          })}
        />
      </Button.Group>
    );
  }

  selectEndpoint = (): void => {
    this.setState({ action: 'endpoint' });
  }
}

export default translate(SettingsApp);
