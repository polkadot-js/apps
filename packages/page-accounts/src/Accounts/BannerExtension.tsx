// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { detect } from 'detect-browser';
import React from 'react';
import { Trans } from 'react-i18next';

import useExtensionCounter from '@polkadot/app-settings/useCounter';
import { availableExtensions } from '@polkadot/apps-config';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { onlyOnWeb } from '@polkadot/react-api/hoc';
import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Banner from './Banner.js';

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && Object.keys(availableExtensions).includes(browserName);

function ExtensionWarning (): React.ReactElement | null {
  const { t } = useTranslation();
  const { hasInjectedAccounts } = useApi();
  const upgradableCount = useExtensionCounter();

  if (!isSupported || !browserName || !isWeb3Injected) {
    return null;
  }

  if (hasInjectedAccounts) {
    if (!upgradableCount) {
      return null;
    }

    return (
      <Banner type='warning'>
        <p>
          {upgradableCount === 1
            ? t<string>('You have 1 extension that needs to be updated with the latest chain properties in order to display the correct information for the chain you are connected to.')
            : t<string>('You have {{upgradableCount}} extensions that need to be updated with the latest chain properties in order to display the correct information for the chain you are connected to.', { replace: { upgradableCount } })
          }
          {t<string>(' This update includes chain metadata and chain properties.')}
        </p>
        <p><Trans key='extensionUpgrade'>Visit your <a href='#/settings/metadata'>settings page</a> to apply the updates to the injected extensions.</Trans></p>
      </Banner>
    );
  }

  return (
    <Banner type='warning'>
      <p>{t<string>('One or more extensions are detected in your browser, however no accounts have been injected.')}</p>
      <p>
        {t<string>('Ensure that:')}
        <SafetyInfoList>
          <li>{t<string>('the extension has accounts,')}</li>
          <li>{t<string>('at least one account is available for this chain,')}</li>
          <li>{t<string>('the extension allows azero.dev to access accounts')}</li>
        </SafetyInfoList>
      </p>
    </Banner>
  );
}

function BannerExtension () {
  const { t } = useTranslation();

  return (
    <>
      <ExtensionWarning />
      <Banner type='warning'>
        <p>
          {t<string>('For extra protection, consider using the')}
          &nbsp;
          <a
            href='https://chrome.google.com/webstore/detail/threatslayer/mgcmocglffknmbhhfjihifeldhghihpj'
            rel='noreferrer'
            target='_blank'
          >
            Threat Slayer
          </a>
          &nbsp;
          {t<string>('extension which protects you from dangerous websites in real-time.')}
        </p>

      </Banner>
    </>
  );
}

export default onlyOnWeb(React.memo(BannerExtension));

const SafetyInfoList = styled.ul`
  margin-block: 0;
  padding-left: 20px;
  list-style-type: '- ';
`;
