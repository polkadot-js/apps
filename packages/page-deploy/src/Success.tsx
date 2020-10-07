// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '@canvas-ui/apps/types';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ContractCard } from '@canvas-ui/react-components';
import { useContract } from '@canvas-ui/react-hooks';

import { useTranslation } from './translate';

function Success ({ basePath, navigateTo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { address }: { address: string } = useParams();
  const contract = useContract(address);

  useEffect(
    (): void => {
      if (!contract) {
        navigateTo.deploy();
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
        <h1>{t<string>('Contract successfully deployed')}</h1>
        <div className='instructions'>
          {t<string>('Your contract has been successfully deployed on chain.')}
        </div>
      </header>
      <section>
        <ContractCard
          basePath={basePath}
          contract={contract}
          navigateTo={navigateTo}
        />
        <Button.Group>
          <Button
            isPrimary
            label={t<string>('Execute Contract')}
            onClick={navigateTo.executeCall(address)}
          />
          <Button
            label={t<string>('Deploy Another Contract')}
            onClick={navigateTo.deploy}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Success);
