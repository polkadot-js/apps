// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '@canvas-ui/react-components/types';
import { Button, ContractCard } from '@canvas-ui/react-components';
import { useAppNavigation, useContract } from '@canvas-ui/react-hooks';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useTranslation } from './translate';

function Success ({ basePath }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { address }: { address: string } = useParams();
  const { navigateTo } = useAppNavigation();
  const contract = useContract(address);

  useEffect(
    (): void => {
      if (!contract) {
        navigateTo.instantiate();
      }
    },
    [contract, navigateTo]
  );

  if (!contract) {
    return null;
  }

  return (
    <>
      <header>
        <h1>{t<string>('Contract successfully instantiated')}</h1>
        <div className='instructions'>
          {t<string>('Your contract has been successfully instantiated on chain.')}
        </div>
      </header>
      <section>
        <ContractCard
          basePath={basePath}
          contract={contract}
        />
        <Button.Group>
          <Button
            isPrimary
            label={t<string>('Execute Contract')}
            onClick={navigateTo.executeCall(address)}
          />
          <Button
            label={t<string>('Instantiate Another Contract')}
            onClick={navigateTo.instantiate}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Success);
