// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { OwnedId } from '../types.js';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { LOWEST_PUBLIC_ID } from './constants.js';
import DeregisterId from './DeregisterId.js';
import RegisterId from './RegisterId.js';
import RegisterThread from './RegisterThread.js';

interface Props {
  className?: string;
  ownedIds: OwnedId[];
}

const OPT_NEXT = {
  transform: (nextId: ParaId) =>
    nextId.isZero()
      ? LOWEST_PUBLIC_ID
      : nextId
};

function Actions ({ className, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isRegisterOpen, toggleRegisterOpen] = useToggle();
  const [isReserveOpen, toggleReserveOpen] = useToggle();
  const [isDeregisterOpen, toggleDeregisterOpen] = useToggle();
  const nextParaId = useCall<ParaId | BN>(api.query.registrar.nextFreeParaId, [], OPT_NEXT);

  return (
    <Button.Group className={className}>
      <Button
        icon='minus'
        isDisabled={api.tx.registrar.deregister ? !ownedIds.length : false}
        label={t('Deregister')}
        onClick={toggleDeregisterOpen}
      />
      {isDeregisterOpen && (
        <DeregisterId
          nextParaId={nextParaId}
          onClose={toggleDeregisterOpen}
          ownedIds={ownedIds}
        />
      )}
      <Button
        icon='plus'
        isDisabled={!api.tx.registrar.reserve}
        label={t('ParaId')}
        onClick={toggleReserveOpen}
      />
      {isReserveOpen && (
        <RegisterId
          nextParaId={nextParaId}
          onClose={toggleReserveOpen}
        />
      )}
      <Button
        icon='plus'
        isDisabled={api.tx.registrar.reserve ? !ownedIds.length : false}
        label={t('ParaThread')}
        onClick={toggleRegisterOpen}
      />
      {isRegisterOpen && (
        <RegisterThread
          nextParaId={nextParaId}
          onClose={toggleRegisterOpen}
          ownedIds={ownedIds}
        />
      )}
    </Button.Group>
  );
}

export default React.memo(Actions);
