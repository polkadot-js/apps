// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Queues ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t<string>('bids'), 'start']
  ]);

  return (
    <Table
      className={className}
      empty={t<string>('No active gilt queues found.')}
      header={headerRef.current}
    />
  );
}

export default React.memo(Queues);
