// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { nextTick } from '@polkadot/util';

import Spinner from './Spinner.js';

interface Props {
  children: React.ReactNode[];
  isActive?: boolean;
}

function NextTick ({ children, isActive = true }: Props): React.ReactElement<Props> {
  const [visibility, setVisibility] = useState(() => new Array<boolean>(children.length).fill(false));

  useEffect((): void => {
    if (isActive) {
      const index = visibility.findIndex((v) => !v);

      if (index !== -1) {
        nextTick(() =>
          setVisibility(
            visibility.map((v, i) => (i === index) || v)
          )
        );
      }
    }
  }, [isActive, visibility]);

  return (
    <>
      {isActive
        ? visibility.map((isVisible, index) => isVisible && children[index])
        : <Spinner />
      }
    </>
  );
}

export default React.memo(NextTick);
