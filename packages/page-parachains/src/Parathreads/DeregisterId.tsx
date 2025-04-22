// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId, OwnerInfo } from '../types.js';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';

import { InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-params';

import InputOwner from '../InputOwner.js';
import { useTranslation } from '../translate.js';
import { LOWEST_INVALID_ID } from './constants.js';

interface Props {
  className?: string;
  onClose: () => void;
  nextParaId?: BN;
  ownedIds: OwnedId[];
}

function DeregisterId ({ className, nextParaId, onClose, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [paraId, setParaId] = useState<BN | undefined>();

  const _setOwner = useCallback(
    ({ accountId, paraId }: OwnerInfo) => {
      setAccountId(accountId);
      setParaId(new BN(paraId));
    },
    []
  );

  const isIdError = !paraId || !paraId.gt(LOWEST_INVALID_ID);

  const extrinsic = useMemo(() => api.tx.registrar.deregister(paraId), [api.tx.registrar, paraId]);

  return (
    <Modal
      className={className}
      header={t('Deregister ParaId')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        {api.tx.registrar.reserve
          ? (
            <InputOwner
              noCodeCheck
              onChange={_setOwner}
              ownedIds={ownedIds}
            />
          )
          : (
            <>
              <Modal.Columns hint={t('This account will be associated with the parachain and pay the deposit.')}>
                <InputAddress
                  label={t('register from')}
                  onChange={setAccountId}
                  type='account'
                  value={accountId}
                />
              </Modal.Columns>
              <Modal.Columns hint={t('The id of this parachain as known on the network')}>
                <InputNumber
                  autoFocus
                  defaultValue={nextParaId}
                  isError={isIdError}
                  isZeroable={false}
                  label={t('parachain id')}
                  onChange={setParaId}
                />
              </Modal.Columns>
            </>
          )
        }
        <Modal.Columns>
          <CallExpander
            isExpanded
            isHeader
            value={extrinsic}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='minus'
          isDisabled={isIdError}
          label={t('Deregister')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(DeregisterId);
