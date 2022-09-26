// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import NewSupersig from './NewSupersig';

interface Props {
  imageHash: Hash;
  isImminent?: boolean;
}

function NewSupersigButton ({ imageHash, isImminent }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isNewSupersigOpen, toggleNewSupersig] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('NewSupersig')}
        onClick={toggleNewSupersig}
      />
      {isNewSupersigOpen && (
        <NewSupersig
          imageHash={imageHash}
          isImminent={isImminent}
          onClose={toggleNewSupersig}
        />
      )}
    </>
  );
}

export default React.memo(NewSupersigButton);
