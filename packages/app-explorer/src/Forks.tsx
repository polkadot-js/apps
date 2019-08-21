/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Header } from '@polkadot/types/interfaces';

import React from 'react';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from './translate';

const MAX_HEADS = 150;

interface Props extends ApiProps, I18nProps {
  subscribeFinalizedHeads?: Header;
  subscribeNewHead?: Header;
}

interface ForkHeader {
  header: Header;
  isFinalized: boolean;
}

interface State {
  all: Record<number, ForkHeader[]>;
  finHeads: Header[];
  newHeads: Header[];
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {
    all: [],
    newHeads: [],
    finHeads: []
  };

  public static getDerivedStateFromProps ({ subscribeFinalizedHeads, subscribeNewHead }: Props, prevState: State): Pick<State, any> | null {
    if (!subscribeFinalizedHeads && !subscribeNewHead) {
      return null;
    }

    subscribeFinalizedHeads && prevState.finHeads.push(subscribeFinalizedHeads);
    subscribeNewHead && prevState.newHeads.push(subscribeNewHead);

    const finHeads = prevState.finHeads.slice(0, MAX_HEADS);
    const newHeads = prevState.newHeads.slice(0, MAX_HEADS);

    return {
      finHeads,
      newHeads
    };
  }

  public render (): React.ReactNode {
    return 'check the console';
  }
}

export default withMulti(
  Forks,
  translate,
  withCalls<Props>(
    ['rpc.chain.subscribeNewHead', { propName: 'subscribeNewHead' }],
    ['rpc.chain.subscribeFinalizedHeads', { propName: 'subscribeFinalizedHeads' }]
  )
);
