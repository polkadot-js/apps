// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import UploadButton from '@polkadot/ui-app/UploadButton';

export default function showUploadButton (size?: string): any {
  return (
    <div className='accounts--Address-file'>
      <UploadButton size={size}/>
    </div>
  );
}
