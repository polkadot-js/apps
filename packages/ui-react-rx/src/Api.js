// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ProviderInterface } from '@polkadot/api-provider/types';
import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { EncodingVersions } from '@polkadot/extrinsics-codec/types';
import type { ApiProps } from './types';

import React from 'react';
import semver from 'semver';
import createWsProvider from '@polkadot/api-provider/ws';
import createApi from '@polkadot/api-rx';
import defaults from '@polkadot/api-rx/defaults';

type Props = {
  api?: RxApiInterface,
  children: React$Node,
  provider?: ProviderInterface,
  url?: string
};

type State = ApiProps & {
  subscriptions: Array<rxjs$ISubscription | null>;
};

const { Consumer, Provider } = React.createContext();

function apiSupport (version?: string): EncodingVersions {
  return version === undefined || semver.lt(version, '0.2.0')
    ? 'poc-1'
    : 'latest';
}

export default class Api extends React.Component<Props, State> {
  static Provider = Provider;
  static Consumer = Consumer

  state: State;

  constructor (props: Props) {
    super(props);

    const { provider, url = '' } = props;
    const api = props.api || createApi(
      url && url.length
        ? createWsProvider(url)
        : provider
    );
    const setApi = (api: RxApiInterface): void => {
      this.setState({ api }, () => {
        this.updateSubscriptions();
      });
    };
    const setApiProvider = (provider?: ProviderInterface): void =>
      setApi(createApi(provider));
    const setApiWsUrl = (url?: string = defaults.WS_URL): void =>
      setApiProvider(createWsProvider(url));

    this.state = {
      api,
      apiConnected: false,
      apiSupport: 'poc-1',
      setApi,
      setApiProvider,
      setApiWsUrl,
      subscriptions: []
    };
  }

  componentDidMount () {
    this.updateSubscriptions();
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  updateSubscriptions () {
    const { api } = this.state;

    this.unsubscribe();
    this.setState({
      subscriptions:
        [
          () => api.isConnected().subscribe((isConnected?: boolean) => {
            this.setState({ apiConnected: !!isConnected });
          }),
          () => api.system.version().subscribe((version?: string) => {
            this.setState({ apiSupport: apiSupport(version) });
          })
        ].map((fn: () => rxjs$ISubscription): rxjs$ISubscription | null => {
          try {
            return fn();
          } catch (error) {
            console.error(error);
            return null;
          }
        })
    });
  }

  unsubscribe (): void {
    const { subscriptions } = this.state;

    subscriptions.forEach((subscription) => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  render () {
    const { api, apiConnected, apiSupport, setApi, setApiProvider, setApiWsUrl } = this.state;

    return (
      <Provider value={{
        api,
        apiConnected,
        apiSupport,
        setApi,
        setApiProvider,
        setApiWsUrl
      }}>
        {this.props.children}
      </Provider>
    );
  }
}
