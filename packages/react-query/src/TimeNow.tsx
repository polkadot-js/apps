// Copyright 2017-2023 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Moment } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Elapsed from './Elapsed.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  value?: Moment;
}

function TimeNow ({ children, className = '', label, value }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const timestamp = useCall<Moment>(!value && api.query.timestamp?.now);

  const [now, hasValue] = useMemo(
    () => [value || timestamp, !!(value || timestamp)],
    [timestamp, value]
  );

  return (
    <div className={`${className} ${hasValue ? '' : '--tmp'}`}>
      {label || ''}
      <Elapsed value={hasValue ? now : Date.now()} />
      {children}
    </div>
  );
}

export default React.memo(TimeNow);
