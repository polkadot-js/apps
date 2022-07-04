// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, useCallback, useState } from 'react';

import { appName, Browsers, extensionLogos, getExtensionLink, getUserInstalledExtensions } from '@polkadot/apps-config';

interface ConnectExtension {
  browsers: Browsers;
  name: string;
  isInstalled: boolean;
}

const ConnectExtension = ({ browsers, isInstalled, name: extensionName }: ConnectExtension) => {
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const connectToExtension = useCallback(async () => {
    const { injectedWeb3, userExtensions } = getUserInstalledExtensions();

    if (userExtensions.includes(extensionName) && !isBusy) {
      try {
        setIsBusy(true);
        await injectedWeb3[extensionName].enable(appName);

        const enabledExtensions = localStorage.getItem('enabledExtensions');

        if (enabledExtensions === null) {
          localStorage.setItem('enabledExtensions', JSON.stringify([extensionName]));
          location.reload();
        } else {
          const storageEnabledExtensions: string[] = JSON.parse(enabledExtensions) as string[];

          if (!storageEnabledExtensions.includes(extensionName)) {
            storageEnabledExtensions.push(extensionName);
            localStorage.setItem('enabledExtensions', JSON.stringify(storageEnabledExtensions));
            location.reload();
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsBusy(false);
      }
    }
  }, [extensionName, isBusy, setIsBusy]);

  return (
    <li
      onClick={connectToExtension}
    >
      <img
        alt={`${extensionName} logo`}
        src={extensionLogos[extensionName] as string}
      />
      <span>{extensionName}</span>
      {!isInstalled && (
        <a
          className='extension-link'
          href={getExtensionLink(browsers)}
          rel='noreferrer'
          target='_blank'
        >
          install, then reload
        </a>
      )}
    </li>
  );
};

export default memo(ConnectExtension);
