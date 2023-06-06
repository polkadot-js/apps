// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { detect } from 'detect-browser';
import React, { useRef } from 'react';
import { Trans } from 'react-i18next';

import useExtensionCounter from '@polkadot/app-settings/useCounter';
import { availableExtensions } from '@polkadot/apps-config';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { onlyOnWeb } from '@polkadot/react-api/hoc';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Banner from './Banner.js';

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && Object.keys(availableExtensions).includes(browserName);

function BannerExtension (): React.ReactElement | null {
  const { t } = useTranslation();
  const { hasInjectedAccounts } = useApi();
  const upgradableCount = useExtensionCounter();
  const phishing = useRef<string>(t<string>('Since some extensions, such as the polkadot-js extension, protects you against all community reported phishing sites, there are valid reasons to use them for additional protection, even if you are not storing accounts in it.'));

  if (!isSupported || !browserName) {
    return null;
  }

  if (isWeb3Injected) {
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
        <p>{t<string>('One or more extensions are detected in your browser, however no accounts has been injected.')}</p>
        <p>{t<string>('Ensure that the extension has accounts, some accounts are visible globally and available for this chain and that you gave the application permission to access accounts from the extension to use them.')}</p>
        <p>{phishing.current}</p>
      </Banner>
    );
  }

  return (
    <Banner type='warning'>
      <p><b>Action needed: Move you accounts to a browser extension</b></p>
      <p>
        {t<string>('Managing accounts directly via {{host}} is being phased out, to encourage more', { replace: { host: window.location.host } })}&nbsp;
        {t<string>('secure ways to manage your keys. We recommend, that you use one of the supported')}&nbsp;
        {t<string>('browser extensions. You can learn')}&nbsp;
        <a
          href='https://support.alephzero.org/en/collections/3749726-setting-up-or-restoring-a-wallet'
          rel='noreferrer'
          target='_blank'
        >{t<string>('how to migrate you accounts here')}</a>.
        &nbsp;{t<string>('If you want to learn more about upcoming changes, you can')}&nbsp;
        <a
          href='https://alephzero.org/blog/testnet-11-release/'
          rel='noreferrer'
          target='_blank'
        >{t<string>('read our announcement here')}</a>.
      </p>
    </Banner>
  );
}

export default onlyOnWeb(React.memo(BannerExtension));
