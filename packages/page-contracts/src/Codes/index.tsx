// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '../types';

import React from 'react';
import { Button, CardGrid } from '@polkadot/react-components';

import contracts from '../store';
import { useTranslation } from '../translate';

import Code from './Code';
import Upload from './Upload';
import Add from './Add';

function Codes ({ onShowDeploy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <CardGrid
        buttons={
          <Button.Group isCentered>
            <Upload />
            <Add />
          </Button.Group>
        }
        emptyText={t('No code hashes available')}
      >
        {contracts.getAllCode().map((code): React.ReactNode => {
          return (
            <Code
              code={code}
              key={code.json.codeHash}
              onShowDeploy={onShowDeploy}
            />
          );
        })}
      </CardGrid>
    </>
  );
}

export default React.memo(Codes);
