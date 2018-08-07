// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from '@polkadot/ui-app/Button/types';

import React from 'react';

import UploadButton from '@polkadot/ui-app/UploadButton';

export default function showUploadButton (size?: Button$Sizes, handleChangeAccount?: any): any {
  return (
    <div className='accounts--Address-file'>
      <UploadButton size={size} handleChangeAccount={handleChangeAccount} />
    </div>
  );
}
