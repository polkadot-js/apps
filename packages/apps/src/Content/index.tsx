// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';
import { withApi, withMulti } from '@polkadot/ui-react-rx/with/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { Status } from '@polkadot/ui-app/index';

import routing from '../routing';
import translate from '../translate';
import NotFound from './NotFound';

type Props = I18nProps & ApiProps & {
  location: Location
};

type State = {
  status?: ActionStatus
};

const unknown = {
  isApiGated: false,
  Component: NotFound,
  name: ''
};

class Content extends React.Component<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {};
  }

  render () {
    const { isApiConnected, isApiReady, location, t } = this.props;
    const { status } = this.state;

    const app = location.pathname.slice(1) || '';
    const { Component, isApiGated, name } = routing.routes.find((route) =>
      !!(route && app.indexOf(route.name) === 0)
    ) || unknown;

    if (isApiGated && (!isApiReady || !isApiConnected)) {
      return (
        <div className='apps--Content-body'>
          <main>{t('content.gated', {
            defaultValue: 'Waiting for API to be ready'
          })}</main>
        </div>
      );
    }

    return (
      <div className='apps--Content'>
        <Component basePath={`/${name}`} onStatusChange={this.updateStatus} />
        <Status status={status} />
      </div>
    );
  }

  private updateStatus = ({ action, success, value, message }: ActionStatus): void => {
    this.setState({ status: { action, success, value, message } });

    setTimeout(() => {
      this.setState({
        status: undefined
      });
    }, 5000);
  }

}

export default withMulti(
  Content,
  translate,
  withApi,
  withRouter
);
