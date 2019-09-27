// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useEffect } from 'react';

export default function Null ({ onChange }: Props): React.ReactElement<Props> | null {
  useEffect((): void => {
    onChange && onChange({
      isValid: true,
      value: null
    });
  }, []);

  return null;
}
