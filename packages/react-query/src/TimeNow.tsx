// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Moment } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Elapsed from './Elapsed';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  value?: Moment;
}

function TimeNow ({ children, className = '', label, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const timestamp = useCall<Moment>(!value && api.query.timestamp?.now);
  const [now, setNow] = useState<BN | undefined>();

  useEffect((): void => {
    setNow(value || timestamp);
  }, [timestamp, value]);

  if (!now) {
    return null;
  }

  return (
    <div className={className}>
      {label || ''}
      <Elapsed value={now} />
      {children}
    </div>
  );
}

export default React.memo(TimeNow);
