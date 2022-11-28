// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate';

const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

function ExternalWarning (): React.ReactElement | null {
  const { t } = useTranslation();

  if (isElectron) {
    return null;
  }

  return (
    <MarkWarning content={<>{t<string>('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security.')}&nbsp;{t<string>('Future versions of this web app will only support these external sources')}</>} />
  );
}

export default React.memo(ExternalWarning);
