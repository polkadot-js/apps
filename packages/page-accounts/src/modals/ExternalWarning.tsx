// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

function ExternalWarning (): React.ReactElement | null {
  const { t } = useTranslation();

  if (isElectron) {
    return null;
  }

  return (
    <MarkWarning content={<>{t('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security.')}&nbsp;{t('Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.')}</>} />
  );
}

export default React.memo(ExternalWarning);
