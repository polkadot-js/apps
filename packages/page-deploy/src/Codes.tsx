// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, CodeCard } from '@polkadot/react-components';

import { useTranslation } from './translate';

function Codes ({ allCodes, basePath, className, hasCodes, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const onDeploy = useCallback(
    (id: string): () => void => navigateTo.deployNew(id),
    [navigateTo]
  )

  return (
    <div className={className}>
      <header>
        <h1>{t(hasCodes ?  'Deploy New Contract' : 'No code bundle available')}</h1>
        <div className='instructions'>
          {hasCodes
            ? (
              <>
                {t('Choose an on-chain code bundle to deploy from below. Don’t see what you’re looking for?')}
                {' '}
                <Link to={'/upload/add'}>
                  {t('Add an existing code hash')}
                </Link>
                {` ${t('or')} `}
                <Link to={'/upload'}>
                  {t('upload a new Wasm blob')}
                </Link>
                {'.'}
              </>
            )
            : (
              <>
                {t('You can add an existing code bundle by')}
                {' '}
                <Link to={'/upload/add'}>
                  {t('using its code hash')}
                </Link>
                {` ${t('or by')} `}
                <Link to={'/upload'}>
                  {t('uploading a new Wasm blob')}
                </Link>
                {'.'}
              </>
            )
          }
        </div>
      </header>
      <section>
        <div className='content'>
          {hasCodes && (
            <h3>{t('Code Bundles')}</h3>
          )}
          {allCodes.map((code): React.ReactNode => ((
            <CodeCard
              code={code}
              key={code.json.codeHash}
              onDeploy={onDeploy(code.id)}
              onForget={() => {}}
            />
          )))}
          <Button.Group>
            <Button
              label={t('Upload New Wasm Blob')}
              onClick={navigateTo.upload}
            />
            <Button
              label={t('Add Existing Code Hash')}
              onClick={navigateTo.addCode}
            />
          </Button.Group>
        </div>
      </section>
    </div>
  );
}

export default styled(React.memo(Codes))`
  .content {
    > :not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }
`
