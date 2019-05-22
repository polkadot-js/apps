// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { ApiInjected, ApiInjectedProps, Subtract } from './types';

import React, { useEffect, useState } from 'react';

type ProviderProps = {
  children: React.ReactNode
};

const InjectedContext = React.createContext([] as Array<ApiInjected>);
const InjectedConsumer = InjectedContext.Consumer;

export {
  InjectedConsumer
};

export function withInjected<P extends ApiInjectedProps> (Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ApiInjectedProps>> {
  return (props: Subtract<P, ApiInjectedProps>) => {
    return (
      <InjectedContext.Consumer>
        {(injected) => (
          // @ts-ignore Something here with the props are going wonky
          <Component
            {...props}
            injected={injected}
          />
        )}
      </InjectedContext.Consumer>
    );
  };
}

type WindowInjected = Window & {
  injectedWeb3: {
    [index: string]: {
      name: string,
      version: string,
      enable: (origin: string) => Promise<{
        accounts: {
          get: () => Promise<Array<{ address: string, name: string }>>
        },
        signer: Signer
      }>
    }
  }
};


export function InjectedProvider ({ children }: ProviderProps) {
  const objmap = (window as WindowInjected).injectedWeb3;
  const loadInjected = !!objmap && Object.keys(objmap).length !== 0;
  const [{ hasInjected, injected, waitInjected }, setInjected] = useState({ hasInjected: !loadInjected, injected: [], waitInjected: loadInjected } as ApiInjectedProps);

  useEffect(() => {
    if (!loadInjected) {
      return;
    }

    Promise
      .all(
        Object.values(objmap).map(({ name, version, enable }) =>
          Promise.all([
            Promise.resolve({ name, version }),
            enable('polkadot-js/apps').catch(() => null)
          ])
        )
      )
      .catch(() => [])
      .then((values) => values.filter(([, result]) => !!result))
      .then((values) => values.map(([info, result]) => ({ ...info, ...result })))
      .then((injected) => console.error(injected))  // setInjected({ hasInjected: true, injected, waitInjected: false }))
      .catch(() => void 0);
  }, []);

  return (
    <InjectedContext.Provider value={injected}>
      {children}
    </InjectedContext.Provider>
  );
}
