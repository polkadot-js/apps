// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import withObservableDiv from '@polkadot/ui-react-rx/with/observableDiv';

const Comp: React.ComponentType<any> = withObservableDiv('stakingIntentions')(
  (value: Uint8Array[]): string => {
    if (!value || !value.length) {
      return 'No intentions found';
    }

    return value.join(', ');
  }
);

export default Comp;
