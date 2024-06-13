// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import CoreDescriptor from './CoreDescriptor.js';

interface Props {
  className?: string;
  coreInfos?: CoreDescription;
}

function CoreDescriptors({ className, coreInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('core'), 'start', 1],
    [],
    []
  ]);

  return (
    <Table
      className={className}
      empty={coreInfos && t('No core description found')}
      header={headerRef.current}
    >
      {coreInfos && <CoreDescriptor value={coreInfos} />}
    </Table>
  );
}

export default React.memo(CoreDescriptors);
