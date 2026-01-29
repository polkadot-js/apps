// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useEffect, useState } from 'react';

import { Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, usePreimage } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction, isHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  onClose: () => void;
}

interface HashState {
  imageHash?: HexString | null;
  isImageHashValid: boolean;
}

interface ImageState {
  imageLen: BN;
  imageLenDefault?: BN;
  isImageLenValid: boolean;
}

function Propose ({ className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ imageHash, isImageHashValid }, setImageHash] = useState<HashState>({ imageHash: null, isImageHashValid: false });
  const [{ imageLen, imageLenDefault, isImageLenValid }, setImageLen] = useState<ImageState>({ imageLen: BN_ZERO, isImageLenValid: false });
  const publicProps = useCall<unknown[]>(api.query.democracy.publicProps);
  const preimage = usePreimage(imageHash);

  useEffect((): void => {
    preimage?.proposalLength && setImageLen((prev) => ({
      imageLen: prev.imageLen,
      imageLenDefault: preimage.proposalLength,
      isImageLenValid: prev.isImageLenValid
    }));
  }, [preimage]);

  const _onChangeImageHash = useCallback(
    (h?: string) =>
      setImageHash({
        imageHash: h as HexString,
        isImageHashValid: isHex(h, 256)
      }),
    []
  );

  const _onChangeImageLen = useCallback(
    (value?: BN): void => {
      value && setImageLen((prev) => ({
        imageLen: value,
        imageLenDefault: prev.imageLenDefault,
        isImageLenValid: !value.isZero()
      }));
    },
    []
  );

  const hasMinLocked = balance?.gte(api.consts.democracy.minimumDeposit);

  return (
    <Modal
      className={className}
      header={t('Submit proposal')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The proposal will be registered from this account and the balance lock will be applied here.')}>
          <InputAddress
            label={t('send from account')}
            labelExtra={
              <Available
                label={<span className='label'>{t('transferable')}</span>}
                params={accountId}
              />
            }
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns
          hint={
            <>
              <p>{t('The hash of the preimage for the proposal as previously submitted or intended.')}</p>
              <p>{t('The length value will be auto-populated from the on-chain value if it is found.')}</p>
            </>
          }
        >
          <Input
            autoFocus
            isError={!isImageHashValid}
            label={t('preimage hash')}
            onChange={_onChangeImageHash}
            value={imageHash || ''}
          />
          <InputNumber
            defaultValue={imageLenDefault}
            isDisabled={!!preimage?.proposalLength && !preimage?.proposalLength.isZero() && isImageHashValid && isImageLenValid}
            isError={!isImageLenValid}
            key='inputLength'
            label={t('preimage length')}
            onChange={_onChangeImageLen}
            value={imageLen}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The associated deposit for this proposal should be more then the minimum on-chain deposit required. It will be locked until the proposal passes.')}>
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            isError={!hasMinLocked}
            label={t('locked balance')}
            onChange={setBalance}
          />
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            isDisabled
            label={t('minimum deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!balance || !hasMinLocked || !isImageHashValid || !accountId || !publicProps || (isFunction(api.tx.preimage?.notePreimage) && !isFunction(api.tx.democracy?.notePreimage) && !preimage)}
          label={t('Submit proposal')}
          onStart={onClose}
          params={
            api.tx.democracy.propose.meta.args.length === 3
              ? [imageHash, balance, publicProps?.length]
              : isFunction(api.tx.preimage?.notePreimage) && !isFunction(api.tx.democracy?.notePreimage)
                ? [preimage && { Lookup: { hash: preimage.proposalHash, len: imageLen } }, balance]
                : [imageHash, balance]
          }
          tx={api.tx.democracy.propose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
