// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, CodeCard } from '@canvas-ui/react-components';

import { useTranslation } from './translate';

function Codes ({ allCodes, basePath, className, hasCodes, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <header>
        <h1>{t(hasCodes ? 'Deploy New Contract' : 'No code bundle available')}</h1>
        <div className='instructions'>
          {hasCodes
            ? (
              <>
                {t<string>('Choose an on-chain code bundle to deploy from below. Don’t see what you’re looking for?')}
                {' '}
                <Link to={'/upload/add'}>
                  {t<string>('Add an existing code hash')}
                </Link>
                {` ${t<string>('or')} `}
                <Link to={'/upload'}>
                  {t<string>('upload a new Wasm blob')}
                </Link>
                {'.'}
              </>
            )
            : (
              <>
                {t<string>('You can add an existing code bundle by')}
                {' '}
                <Link to={'/upload/add'}>
                  {t<string>('using its code hash')}
                </Link>
                {` ${t<string>('or by')} `}
                <Link to={'/upload'}>
                  {t<string>('uploading a new Wasm blob')}
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
            <h3>{t<string>('Code Bundles')}</h3>
          )}
          {allCodes.map((code): React.ReactNode => ((
            <CodeCard
              basePath={basePath}
              code={code}
              key={code.json.codeHash}
              navigateTo={navigateTo}
            />
          )))}
          <Button.Group>
            <Button
              label={t<string>('Upload New Wasm Blob')}
              onClick={navigateTo.upload}
            />
            <Button
              label={t<string>('Add Existing Code Hash')}
              onClick={navigateTo.uploadAdd}
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
`;
