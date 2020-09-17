// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import PreImage from './PreImage';

interface Props {
  imageHash: Hash;
  isImminent?: boolean;
}

function PreImageButton ({ imageHash, isImminent }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isPreimageOpen, togglePreimage] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Image')}
        onClick={togglePreimage}
      />
      {isPreimageOpen && (
        <PreImage
          imageHash={imageHash}
          isImminent={isImminent}
          onClose={togglePreimage}
        />
      )}
    </>
  );
}

export default React.memo(PreImageButton);
