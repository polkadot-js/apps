// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useEffect } from 'react';

function Null ({ onChange }: Props): React.ReactElement<Props> | null {
  useEffect((): void => {
    onChange && onChange({
      isValid: true,
      value: null
    });
  }, [onChange]);

  return null;
}

export default React.memo(Null);
