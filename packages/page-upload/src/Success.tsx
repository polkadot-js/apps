// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/apps/types';
import { ComponentProps as Props } from './types';

import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CodeCard } from '@canvas-ui/react-components';

import { useTranslation } from './translate';

function Success ({ allCodes, basePath, navigateTo }: Props): React.ReactElement<Props> | null {
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();

  const code = useMemo(
    (): Code | null => allCodes.find(({ id: codeId }) => codeId === id) || null,
    [allCodes, id]
  );

  useEffect(
    (): void => {
      if (!code) {
        navigateTo.upload();
      }
    },
    [code, navigateTo]
  );

  if (!code) {
    return null;
  }

  return (
    <>
      <header>
        <h1>{t<string>('Code successfully put on chain')}</h1>
        <div className='instructions'>
          {t<string>('Your code bundle has been put succesfully in the chain’s storage. A unique code hash has been returned.')}
        </div>
      </header>
      <section>
        <CodeCard
          basePath={basePath}
          code={code}
          navigateTo={navigateTo}
          onForget={
            (): void => navigateTo.upload()
          }
        />
        <Button.Group>
          <Button
            isPrimary
            label={t<string>('Deploy Code')}
            onClick={navigateTo.deployNew(id)}
          />
          <Button
            label={t<string>('Upload Another Code Bundle')}
            onClick={navigateTo.upload}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Success);
