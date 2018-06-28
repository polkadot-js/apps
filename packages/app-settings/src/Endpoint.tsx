// Copyright 2017-2018 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';
import React from 'react';
import Input from '@polkadot/ui-app/Input';
import Static from '@polkadot/ui-app/Static';
import classes from '@polkadot/ui-app/util/classes';

import translate from './translate';

type State = {
  endpoint: string,
  endpoints: Array<string>,
};

class Endpoint extends React.PureComponent<Props, State> {
  state: State = {
    endpoint: 'wss://poc-1.polkadot.io:9944',
    endpoints: [
      'wss://poc-1.polkadot.io:9944',
      'ws://127.0.0.1:9944'
     ],
  };

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('settings--Endpoint', className)}
        style={style}
      >
        {this.renderInput()}
      </div>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { endpoint, endpoints } = this.state;

    return (
      <div className='ui--row'>
        <Input
          className='large'
          label={t('endpoint.data', {
            defaultValue: 'the endpoint (ws/wss) the UI should connect to'
          })}
          onChange={this.onChangeData}
          value={endpoint}
        />
      </div>
    );
  }

  onChangeData = (endpoint: string): void => {
    this.setState({ endpoint });
  }
}

export default translate(Endpoint);
