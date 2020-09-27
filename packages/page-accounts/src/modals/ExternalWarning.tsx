// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTranslation } from '../translate';

const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

function ExternalWarning (): React.ReactElement | null {
  const { t } = useTranslation();

  if (isElectron) {
    return null;
  }

  return (
    <article className='warning'>
      <p>{t<string>('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security.')}&nbsp;{t<string>('Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.')}</p>
    </article>
  );
}

export default React.memo(ExternalWarning);
