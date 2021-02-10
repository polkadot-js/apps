// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import contracts from '../store';
import { useTranslation } from '../translate';
import Code from './Code';

interface Props {
  onShowDeploy: (codeHash: string, constructorIndex: number) => void;
  updated: number;
}

function Codes ({ onShowDeploy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('code hashes'), 'start'],
    [],
    [],
    [t('status'), 'start'],
    []
  ]);

  return (
    <Table
      empty={t<string>('No code hashes available')}
      header={headerRef.current}
    >
      {contracts.getAllCode().map((code): React.ReactNode => (
        <Code
          code={code}
          key={code.json.codeHash}
          onShowDeploy={onShowDeploy}
        />
      ))}
    </Table>
  );
}

export default React.memo(Codes);
