// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { LOWEST_PUBLIC_ID } from './constants';
import RegisterId from './RegisterId';
import RegisterThread from './RegisterThread';

interface Props {
  className?: string;
  ownedIds: OwnedId[];
}

const transformId = {
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
  const nextParaId = useCall<ParaId | BN>(api.query.registrar.nextFreeParaId, [], transformId);

  return (
    <Button.Group className={className}>
      <Button
        icon='plus'
        isDisabled={!api.tx.registrar.reserve}
        label={t<string>('ParaId')}
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
        label={t<string>('ParaThread')}
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
