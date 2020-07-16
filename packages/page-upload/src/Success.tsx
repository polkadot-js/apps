// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/apps/types';
import { ComponentProps as Props } from './types';

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import store from '@polkadot/apps/store';
import { Button, CodeCard } from '@polkadot/react-components';

import { useTranslation } from './translate';

function Success ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const { id } = useParams();
  const { t } = useTranslation();

  const code = useMemo(
    (): CodeStored => store.getCode(id),
    [id]
  );

  return (
    <>
      <header>
        <h1>{t('Code successfully put on chain')}</h1>
        <div className='instructions'>
          {t<string>('Your code bundle has been put succesfully in the chain’s storage. A unique code hash has been returned.')}
        </div>
      </header>
      <section>
        <CodeCard code={code} />
        <Button.Group>
          <Button
            isPrimary
            label={t('Deploy Code')}
            onClick={navigateTo.deployNew(id)}
          />
          <Button
            label={t('Upload Another Code Bundle')}
            onClick={navigateTo.upload}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Success);
