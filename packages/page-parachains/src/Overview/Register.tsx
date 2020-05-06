// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ParaInfo } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import React, { useMemo, useRef } from 'react';
import { useApi, useFormField, useModal } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';
import { u8aToHex, u8aToString } from '@polkadot/util';

import { Button, Dropdown, InputFile, InputNumber, InputWasm, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  nextFreeId?: BN;
  sudoKey: string;
}

type Scheduling = 'Always' | 'Dynamic';

const schedulingOptions = [{
  text: 'Always',
  value: 'Always'
}, {
  text: 'Dynamic',
  value: 'Dynamic'
}];

const ONE_THOUSAND = new BN(1000);

function Register ({ nextFreeId = ONE_THOUSAND, sudoKey }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isOpen, onClose, onOpen } = useModal();
  const onSendRef = useRef<() => void>();
  const isWasmValidRef = useRef(false);

  const [id, isIdValid, setId] = useFormField<BN>(
    nextFreeId,
    (id) => !!id && id.gte(nextFreeId)
  );
  const [code, isCodeValid, setCode] = useFormField<Uint8Array>(
    null,
    (code): boolean => !!code && isWasmValidRef.current
  );
  const [initialHeadState, isInitialHeadStateValid, setInitialHeadState] = useFormField<Uint8Array>(
    null
  );
  const [scheduling, , setScheduling] = useFormField<Scheduling>('Always');

  const info = useMemo(
    (): ParaInfo => {
      return createType(api.registry, 'ParaInfo', { scheduling });
    },
    [api, scheduling]
  );
  const extrinsic = useMemo(
    (): SubmittableExtrinsic | null => {
      try {
        return api.tx.registrar.registerPara(
          id,
          info,
          code ? u8aToHex(code) : null,
          initialHeadState ? u8aToString(initialHeadState) : null
        );
      } catch (error) {
        console.log(error);

        return null;
      }
    },
    [api, id, info, code, initialHeadState]
  );

  return (
    <>
      <div className='ui--Row-buttons'>
        <Button
          icon='add'
          label={t('Register a parachain')}
          onClick={onOpen}
        />
      </div>
      {isOpen && (
        <Modal
          header={t('Register a parachain')}
          onClose={onClose}
          small
        >
          <Modal.Content>
            <InputNumber
              defaultValue={nextFreeId.toString()}
              help={t('The id number to assign to this parachain.')}
              isError={!isIdValid}
              label={t('parachain id')}
              onChange={setId}
              onEnter={onSendRef.current}
              onEscape={onClose}
              placeholder={
                t(
                  'Positive number greater than or equal to {{nextFreeId}}',
                  { replace: { nextFreeId: nextFreeId.toString() } }
                )
              }
            />
            <Dropdown
              help={t('The scheduling preference for this parachain.')}
              label={t('scheduling')}
              onChange={setScheduling}
              options={schedulingOptions}
              value={scheduling}
            />
            <InputWasm
              help={t('The compiled runtime WASM for the parachain you wish to register.')}
              isError={!!code && code.length > 0 && !isCodeValid}
              isValidRef={isWasmValidRef}
              label={t('code')}
              onChange={setCode}
              placeholder={
                code && code.length > 0 && !isCodeValid
                  ? t('The code is not recognized as being in valid WASM format')
                  : null
              }
            />
            <InputFile
              help={t('The initial head state for the parachain.')}
              isError={!!initialHeadState && !isInitialHeadStateValid}
              label={t('initial head state')}
              onChange={setInitialHeadState}
              placeholder={
                initialHeadState && !isInitialHeadStateValid
                  ? t('The initial head state is invalid.')
                  : null
              }
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={sudoKey}
              isDisabled={!isIdValid || !isCodeValid || !isInitialHeadStateValid}
              onClick={onClose}
              onSendRef={onSendRef}
              params={[extrinsic]}
              tx={'sudo.sudo'}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Register);
