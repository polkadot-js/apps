// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParam } from '@polkadot/react-params/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { PalletReferenda, TrackDescription } from '../../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Dropdown, Input, InputAddress, InputBalance, InputNumber, Modal, styled, ToggleGroup, TxButton } from '@polkadot/react-components';
import { useApi, useBestNumber, usePreimage, useToggle } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { Available } from '@polkadot/react-query';
import { getTypeDef } from '@polkadot/types/create';
import { BN_HUNDRED, BN_ONE, BN_THOUSAND, BN_ZERO, isHex } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import { getTrackInfo } from '../../util.js';
import TrackDropdown from './TrackDropdown.js';

interface Props {
  className?: string;
  isMember: boolean;
  members?: string[];
  palletReferenda: PalletReferenda;
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

function Submit ({ className = '', isMember, members, palletReferenda, tracks }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, specName } = useApi();
  const bestNumber = useBestNumber();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [trackId, setTrack] = useState<number | undefined>(undefined);
  const [origin, setOrigin] = useState<RawParam['value']>(null);
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

  const trackInfo = useMemo(
    () => getTrackInfo(api, specName, palletReferenda, tracks, trackId),
    [api, palletReferenda, specName, trackId, tracks]
  );

  const isInvalidAt = useMemo(
    () => !bestNumber || (
      enactIndex === 0
        ? afterBlocks?.lt(BN_ONE)
        : atBlock?.lt(bestNumber)
    ),
    [afterBlocks, atBlock, bestNumber, enactIndex]
  );

  const originType = useMemo(
    () => [{
      name: 'origin',
      type: getTypeDef(api.tx[palletReferenda as 'referenda'].submit.meta.args[0].type.toString())
    }],
    [api, palletReferenda]
  );

  const originOptions = useMemo(
    () => trackInfo && Array.isArray(trackInfo.origin)
      ? trackInfo.origin.map((records, index) => ({
        text: Object.values(records)[0],
        value: index + 1
      }))
      : null,
    [trackInfo]
  );

  const selectedOrigin = useMemo(
    () => !trackInfo?.origin || Array.isArray(trackInfo?.origin)
      ? origin
      : trackInfo.origin,
    [origin, trackInfo]
  );

  const enactOpts = useMemo(
    () => [
      { text: t('After delay'), value: 'after' },
      { text: t('At block'), value: 'at' }
    ],
    [t]
  );

  const _onChangeOriginMulti = useCallback(
    (value: number) => setOrigin(
      trackInfo && Array.isArray(trackInfo.origin)
        ? trackInfo.origin[value - 1]
        : null
    ),
    [trackInfo]
  );

  const _onChangeOrigin = useCallback(
    ([{ isValid, value }]: RawParam[]) =>
      setOrigin(isValid ? value : null),
    []
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

  return (
    <>
      {isOpen && (
        <StyledModal
          className={className}
          header={t('Submit proposal')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The proposal will be registered from this account and the balance lock will be applied here.')}>
              <InputAddress
                filter={members}
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
            <Modal.Columns hint={t('The origin (and by extension track) that you wish to submit for, each has a different period, different root and acceptance criteria.')}>
              <TrackDropdown
                onChange={setTrack}
                palletReferenda={palletReferenda}
                tracks={tracks}
              />
              {!trackInfo?.origin && (
                <Params
                  className='originSelect'
                  onChange={_onChangeOrigin}
                  params={originType}
                />
              )}
              {originOptions && (
                <Dropdown
                  defaultValue={originOptions[0].value}
                  label={t('track origin')}
                  onChange={_onChangeOriginMulti}
                  options={originOptions}
                />
              )}
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
                defaultValue={api.consts[palletReferenda as 'referenda'].submissionDeposit}
                isDisabled
                label={t('submission deposit')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!selectedOrigin || !isImageHashValid || !isImageLenValid || !accountId || isInvalidAt || !preimage?.proposalHash}
              label={t('Submit proposal')}
              onStart={toggleOpen}
              params={[
                selectedOrigin,
                {
                  Lookup: preimage
                    ? { hash: preimage.proposalHash, len: imageLen }
                    : { hash: imageHash, len: imageLen }
                },
                enactIndex === 0
                  ? { After: afterBlocks }
                  : { At: atBlock }
              ]}
              tx={api.tx[palletReferenda as 'referenda'].submit}
            />
          </Modal.Actions>
        </StyledModal>
      )}
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t('Submit proposal')}
        onClick={toggleOpen}
      />
    </>
  );
}

const StyledModal = styled(Modal)`
  .originSelect, .timeSelect {
    > .ui--Params-Content {
      padding-left: 0;
    }
  }
`;

export default React.memo(Submit);
