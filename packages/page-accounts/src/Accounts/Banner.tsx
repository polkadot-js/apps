// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { detect } from 'detect-browser';
import React from 'react';
import styled from 'styled-components';
import { availableExtensions } from '@polkadot/apps-config/extensions';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { stringUpperFirst } from '@polkadot/util';

import { useTranslation } from '../translate';

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

interface Props {
  className?: string;
}

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && Object.keys(availableExtensions).includes(browserName);

function Banner ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (isWeb3Injected || !isSupported || !browserName) {
    return null;
  }

  return (
    <div className={className}>
      <div className='box'>
        <div className='info'>
          <p>{t('It is recommended that you create/store your accounts securely and externally from the app. On {{yourBrowser}} the following browser extensions are available for use -', {
            replace: {
              yourBrowser: stringUpperFirst(browserName)
            }
          })}</p>
          <ul>{availableExtensions[browserName].map(({ desc, link, name }): React.ReactNode => (
            <li key={name}>
              <a
                href={link}
                rel='noopener noreferrer'
                target='_blank'
              >
                {name}
              </a> ({t(desc)})
            </li>
          ))
          }</ul>
          <p>{t('Accounts injected from any of these extensions will appear in this application and be available for use. The above list is updated as more extensions with external signing capability become available.')}&nbsp;<a
            href='https://github.com/polkadot-js/extension'
            rel='noopener noreferrer'
            target='_blank'
          >{t('Learn more...')}</a></p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(Banner)`
  padding: 0 0.5rem 0.5rem;

  .box {
    background: #fff6e5;
    border-left: 0.25rem solid darkorange;
    border-radius: 0 0.25rem 0.25rem 0;
    box-sizing: border-box;
    padding: 1rem 1.5rem;

    .info {
      max-width: 50rem;
    }
  }
`);
