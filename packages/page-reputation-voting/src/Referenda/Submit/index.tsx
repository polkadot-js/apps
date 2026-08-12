// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { TrackDescription } from '../../useTracks.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Dropdown, Input, InputAddress, InputBalance, InputNumber, Modal, ToggleGroup, TxButton } from '@polkadot/react-components';
import { useApi, useBestNumber, usePreimage, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_HUNDRED, BN_ONE, BN_THOUSAND, BN_ZERO, isHex } from '@polkadot/util';

import { useTranslation } from '../../translate.js';

interface Props {
  className?: string;
  tracks: TrackDescription[];
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

function Submit ({ className = '', tracks }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [trackId, setTrack] = useState<number | undefined>(tracks[0]?.id?.toNumber());
  const [{ imageHash, isImageHashValid }, setImageHash] = useState<HashState>({ imageHash: null, isImageHashValid: false });
  const [{ imageLen, imageLenDefault, isImageLenValid }, setImageLen] = useState<ImageState>({ imageLen: BN_ZERO, isImageLenValid: false });
  const [enactIndex, setEnactIndex] = useState(0);
  const [afterBlocks, setAfterBlocks] = useState<BN | undefined>(BN_HUNDRED);
  const [atBlock, setAtBlock] = useState<BN | undefined>(BN_ONE);
  const [initialAt, setInitialAt] = useState<BN | undefined>();
  const preimage = usePreimage(imageHash);

  useEffect((): void => {
    bestNumber && setInitialAt((prev) =>
      prev || bestNumber.add(BN_THOUSAND)
    );
  }, [bestNumber]);

  useEffect((): void => {
    preimage?.proposalLength && setImageLen((prev) => ({
      imageLen: prev.imageLen,
      imageLenDefault: preimage.proposalLength,
      isImageLenValid: prev.isImageLenValid
    }));
  }, [preimage]);

  const isInvalidAt = useMemo(
    () => !bestNumber || (
      enactIndex === 0
        ? afterBlocks?.lt(BN_ONE)
        : atBlock?.lt(bestNumber)
    ),
    [afterBlocks, atBlock, bestNumber, enactIndex]
  );

  const trackOptions = useMemo(
    () => tracks.map(({ id, name }) => ({
      text: name,
      value: id.toNumber()
    })),
    [tracks]
  );

  const enactOpts = useMemo(
    () => [
      { text: t('After delay'), value: 'after' },
      { text: t('At block'), value: 'at' }
    ],
    [t]
  );

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

  if (!tracks.length) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t('Submit proposal')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The proposal will be registered from this account and the balance lock will be applied here.')}>
              <InputAddress
                label={t('propose from account')}
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
            <Modal.Columns hint={t('The track for this proposal. Each track has different parameters.')}>
              <Dropdown
                label={t('track')}
                onChange={setTrack}
                options={trackOptions}
                value={trackId}
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
            <Modal.Columns
              align='center'
              hint={t('The moment of enactment, either at a specific block, or after a specific number of blocks.')}
            >
              <ToggleGroup
                onChange={setEnactIndex}
                options={enactOpts}
                value={enactIndex}
              />
            </Modal.Columns>
            {enactIndex === 0
              ? (
                <Modal.Columns hint={t('The number of blocks to delay enactment after proposal approval.')}>
                  <InputNumber
                    defaultValue={BN_HUNDRED}
                    isError={isInvalidAt}
                    label={t('after number of blocks')}
                    onChange={setAfterBlocks}
                    value={afterBlocks}
                  />
                </Modal.Columns>
              )
              : (
                <Modal.Columns hint={t('A specific block to enact the proposal at.')}>
                  <InputNumber
                    defaultValue={initialAt}
                    isError={isInvalidAt}
                    label={t('at specific block')}
                    onChange={setAtBlock}
                    value={atBlock}
                  />
                </Modal.Columns>
              )
            }
            <Modal.Columns hint={t('The deposit for this proposal will be locked for the referendum duration.')}>
              <InputBalance
                defaultValue={api.consts.referenda?.submissionDeposit}
                isDisabled
                label={t('submission deposit')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={trackId === undefined || !isImageHashValid || !isImageLenValid || !accountId || isInvalidAt || !preimage?.proposalHash}
              label={t('Submit proposal')}
              onStart={toggleOpen}
              params={[
                trackId,
                {
                  Lookup: preimage
                    ? { hash: preimage.proposalHash, len: imageLen }
                    : { hash: imageHash, len: imageLen }
                },
                enactIndex === 0
                  ? { After: afterBlocks }
                  : { At: atBlock }
              ]}
              tx={api.tx.referenda.submit}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t('Submit proposal')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Submit);
