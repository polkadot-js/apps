// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import RegisterId from './RegisterId';
import RegisterThread from './RegisterThread';

interface Props {
  className?: string;
  ownedIds: OwnedId[];
}

function Actions ({ className, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isRegisterOpen, toggleRegisterOpen] = useToggle();
  const [isReserveOpen, toggleReserveOpen] = useToggle();

  return (
    <Button.Group className={className}>
      <Button
        icon='plus'
        isDisabled={!api.tx.registrar.reserve}
        label={t<string>('ParaId')}
        onClick={toggleReserveOpen}
      />
      {isReserveOpen && (
        <RegisterId onClose={toggleReserveOpen} />
      )}
      <Button
        icon='plus'
        isDisabled={api.tx.registrar.reserve ? !ownedIds.length : false}
        label={t<string>('ParaThread')}
        onClick={toggleRegisterOpen}
      />
      {isRegisterOpen && (
        <RegisterThread
          onClose={toggleRegisterOpen}
          ownedIds={ownedIds}
        />
      )}
    </Button.Group>
  );
}

export default React.memo(Actions);
