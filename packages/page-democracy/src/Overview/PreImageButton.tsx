// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import PreImage from './PreImage.js';

interface Props {
  imageHash: Hash | HexString;
  isImminent?: boolean;
}

function PreImageButton ({ imageHash, isImminent }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isPreimageOpen, togglePreimage] = useToggle();

  return (
    api.tx.democracy.notePreimage
      ? (
        <>
          <Button
            icon='plus'
            label={t('Image')}
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
      )
      : null
  );
}

export default React.memo(PreImageButton);
