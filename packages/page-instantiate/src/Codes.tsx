// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, CodeCard } from '@canvas-ui/react-components';
import { useAppNavigation, useHasInstantiateWithCode } from '@canvas-ui/react-hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useTranslation } from './translate';
import { ComponentProps as Props } from './types';

function Codes ({ allCodes, basePath, className, hasCodes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { navigateTo, pathTo } = useAppNavigation();
  const hasInstantiateWithCode = useHasInstantiateWithCode();

  const uploadPath = hasInstantiateWithCode ? pathTo.instantiateNew() : pathTo.upload;

  return (
    <div className={className}>
      <header>
        <h1>{t(hasCodes ? 'Instantiate New Contract' : 'No code bundle available')}</h1>
        <div className='instructions'>
          {hasCodes
            ? (
              <>
                {t<string>('Choose an on-chain code bundle to instantiate from below. Don’t see what you’re looking for?')}
                {' '}
                <Link to={pathTo.instantiateAdd}>
                  {t<string>('Add an existing code hash')}
                </Link>

                {` ${t<string>('or')} `}
                <Link to={uploadPath}>
                  {t<string>('upload a new contract bundle')}
                </Link>
                {'.'}
              </>
            )
            : (
              <>
                {t<string>('You can add an existing code bundle by')}
                {' '}
                <Link to={pathTo.instantiateAdd}>
                  {t<string>('using its code hash')}
                </Link>
                {` ${t<string>('or by')} `}
                <Link to={uploadPath}>
                  {t<string>('uploading a new contract bundle')}
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
              key={code.codeHash}
            />
          )))}
          <Button.Group>
            {hasInstantiateWithCode
              ? (
                <Button
                  isPrimary
                  label={t<string>('Upload & Instantiate Contract')}
                  onClick={navigateTo.instantiateNew()}
                />
              )
              : (
                <Button
                  label={t<string>('Upload New Contract Bundle')}
                  onClick={navigateTo.upload}
                />
              )}
            <Button
              label={t<string>('Add Existing Code Hash')}
              onClick={navigateTo.instantiateAdd}
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
