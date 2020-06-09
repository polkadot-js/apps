// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
