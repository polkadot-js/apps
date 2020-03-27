// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import PreImage from './PreImage';

interface Props {
  hash: Hash;
  isImminent?: boolean;
  withoutOr?: boolean;
}

function PreImageButton ({ hash, isImminent, withoutOr }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isPreimageOpen, togglePreimage] = useToggle();

  return (
    <>
      {!withoutOr && <Button.Or />}
      <Button
        icon='plus'
        label={t('Preimage')}
        onClick={togglePreimage}
      />
      {isPreimageOpen && (
        <PreImage
          isImminent={isImminent}
          matchHash={hash}
          onClose={togglePreimage}
        />
      )}
    </>
  );
}

export default React.memo(PreImageButton);
