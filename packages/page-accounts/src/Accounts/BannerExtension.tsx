// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { detect } from 'detect-browser';
import React from 'react';
import { availableExtensions } from '@polkadot/apps-config/extensions';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { stringUpperFirst } from '@polkadot/util';

import { useTranslation } from '../translate';
import Banner from './Banner';

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && Object.keys(availableExtensions).includes(browserName);

function BannerExtension (): React.ReactElement | null {
  const { t } = useTranslation();

  if (isWeb3Injected || !isSupported || !browserName) {
    return null;
  }

  return (
    <Banner type='warning'>
      <p>{t<string>('It is recommended that you create/store your accounts securely and externally from the app. On {{yourBrowser}} the following browser extensions are available for use -', {
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
      <p>{t<string>('Accounts injected from any of these extensions will appear in this application and be available for use. The above list is updated as more extensions with external signing capability become available.')}&nbsp;<a
        href='https://github.com/polkadot-js/extension'
        rel='noopener noreferrer'
        target='_blank'
      >{t<string>('Learn more...')}</a></p>
    </Banner>
  );
}

export default React.memo(BannerExtension);
