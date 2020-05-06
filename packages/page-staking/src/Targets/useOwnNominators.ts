// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import { useEffect, useState } from 'react';

export default function useOwnNominators (ownStashes?: StakerState[]): StakerState[] | undefined {
  const [state, setState] = useState<StakerState[] | undefined>();

  useEffect((): void => {
    ownStashes && setState(
      ownStashes.filter(({ isOwnController, isStashValidating }) => isOwnController && !isStashValidating)
    );
  }, [ownStashes]);

  return state;
}
