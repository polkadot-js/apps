// Copyright 2017-2021 @canvas-ui/app-upload authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/react-store/types';
import { Button, CodeCard } from '@canvas-ui/react-components';
import { useAppNavigation } from '@canvas-ui/react-hooks';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useTranslation } from './translate';
import { ComponentProps as Props } from './types';

function Success ({ allCodes, basePath }: Props): React.ReactElement<Props> | null {
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();

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
          onForget={navigateTo.upload}
        />
        <Button.Group>
          <Button
            isPrimary
            label={t<string>('Instantiate This Code Bundle')}
            onClick={navigateTo.instantiateNew(id)}
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
