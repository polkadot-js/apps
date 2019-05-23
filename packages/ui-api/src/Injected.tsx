// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInjected, ApiInjectedProps, Subtract, WindowInjected } from './types';

import React from 'react';

const objmap = (window as WindowInjected).injectedWeb3;
const injectedAvailable = !!objmap && Object.keys(objmap).length !== 0;
const injectedPromise = !injectedAvailable
  ? Promise.resolve([] as Array<ApiInjected>)
  : Promise.all(Object.values(objmap).map(({ name, version, enable }) =>
      Promise.all([
        Promise.resolve({ name, version }),
        enable('polkadot-js/apps').catch(() => null)
      ])))
      .then((values) => values.filter(([, result]) => result !== null))
      .then((values) => values.map(([info, result]) => ({ ...info, ...result })))
      .catch(() => [] as Array<ApiInjected>);

const InjectedContext = React.createContext({ injectedAvailable, injectedPromise });
const InjectedConsumer = InjectedContext.Consumer;

export {
  InjectedConsumer
};

export function withInjected<P extends ApiInjectedProps> (Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ApiInjectedProps>> {
  return class extends React.PureComponent<Subtract<P, ApiInjectedProps>> {
    render () {
      return (
        <InjectedContext.Consumer>
          {(injected) => (
            // @ts-ignore Something here with the props are going wonky
            <Component
              {...this.props}
              {...injected}
            />
          )}
        </InjectedContext.Consumer>
      );
    }
  };
}
