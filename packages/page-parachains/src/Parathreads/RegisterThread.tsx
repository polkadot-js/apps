// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeParachainsConfigurationHostConfiguration } from '@polkadot/types/lookup';
import type { OwnedId, OwnerInfo } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { InputAddress, InputBalance, InputFile, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, compactAddLength } from '@polkadot/util';

import InputOwner from '../InputOwner.js';
import { useTranslation } from '../translate.js';
import { LOWEST_INVALID_ID } from './constants.js';

interface Props {
  className?: string;
  nextParaId?: BN;
  onClose: () => void;
  ownedIds: OwnedId[];
}

function RegisterThread ({ className, nextParaId, onClose, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [paraId, setParaId] = useState<BN | undefined>();
  const [wasm, setWasm] = useState<Uint8Array | null>(null);
  const [genesisState, setGenesisState] = useState<Uint8Array | null>(null);
  const paraConfig = useCall<PolkadotRuntimeParachainsConfigurationHostConfiguration>(api.query.configuration?.activeConfig);

  const _setGenesisState = useCallback(
    (data: Uint8Array) => setGenesisState(compactAddLength(data)),
    []
  );

  const _setWasm = useCallback(
    (data: Uint8Array) => setWasm(compactAddLength(data)),
    []
  );

  const _setOwner = useCallback(
    ({ accountId, paraId }: OwnerInfo) => {
      setAccountId(accountId);
      setParaId(new BN(paraId));
    },
    []
  );

  const reservedDeposit = useMemo(
    () => (api.consts.registrar.paraDeposit as BalanceOf)
      .add((api.consts.registrar.dataDepositPerByte as BalanceOf).muln(
        paraConfig?.maxCodeSize
          ? paraConfig.maxCodeSize.toNumber()
          : wasm
            ? wasm.length
            : 0
      ))
      .iadd((api.consts.registrar.dataDepositPerByte as BalanceOf).muln(genesisState ? genesisState.length : 0)),
    [api, wasm, genesisState, paraConfig]
  );

  const isIdError = !paraId || !paraId.gt(LOWEST_INVALID_ID);

  return (
    <Modal
      className={className}
      header={t('Register parathread')}
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
        <Modal.Columns hint={t('The WASM validation function for this parachain.')}>
          <InputFile
            isError={!wasm}
            label={t('code')}
            onChange={_setWasm}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The genesis state for this parachain.')}>
          <InputFile
            isError={!genesisState}
            label={t('initial state')}
            onChange={_setGenesisState}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The reservation fee for this parachain, including base fee and per-byte fees')}>
          <InputBalance
            defaultValue={reservedDeposit}
            isDisabled
            label={t('reserved deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!wasm || !genesisState || isIdError}
          onStart={onClose}
          params={[paraId, genesisState, wasm]}
          tx={api.tx.registrar.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterThread);
