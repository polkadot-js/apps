// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import DownloadButton from '@polkadot/ui-app/DownloadButton';
import UploadButton from '@polkadot/ui-app/UploadButton';

export default function showUploadAndDownloadButtons (address: string, handleChangeAccount?: any): any {
  return (
    <div className='accounts--Address-file'>
      <DownloadButton address={address} />
      <UploadButton handleChangeAccount={handleChangeAccount} />
    </div>
  );
}
