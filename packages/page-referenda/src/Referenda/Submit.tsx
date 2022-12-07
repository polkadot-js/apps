// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParam } from '@polkadot/react-params/types';
import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { PalletReferenda } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { Button, Dropdown, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useBestNumber, useToggle } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { Available } from '@polkadot/react-query';
import { getTypeDef } from '@polkadot/types/create';
import { BN_HUNDRED, BN_ONE, formatNumber, isHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import { getTrackInfo, getTrackName } from '../util';

interface Props {
  className?: string;
  isMember: boolean;
  members?: string[];
  palletReferenda: PalletReferenda;
  tracks?: [BN, PalletReferendaTrackInfo][];
}

interface HashState {
  imageHash?: HexString | null;
  isImageHashValid: boolean;
}

interface ImageState {
  imageLen: number;
  isImageLenValid: boolean;
}

interface DefaultAtAfter {
  defaults: [{ isValid: boolean, value: { After: BN } }];
  trackId: number;
}

function getDefaultEnactment (prev: DefaultAtAfter | null, trackId: number): DefaultAtAfter {
  if (prev && prev.trackId === trackId) {
    return prev;
  }

  return {
    defaults: [{
      isValid: true,
      value: {
        After: BN_HUNDRED
      }
    }],
    trackId
  };
}

function Submit ({ className = '', isMember, members, palletReferenda, tracks }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, specName } = useApi();
  const bestNumber = useBestNumber();
  const [isSubmitOpen, toggleSubmit] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [trackId, setTrack] = useState<number | undefined>(undefined);
  const [origin, setOrigin] = useState<RawParam['value'] | null>(null);
  const [atAfter, setAtAfter] = useState<RawParam['value'] | null>(null);
  const [defaultAtAfter, setDefaultAtAfter] = useState<DefaultAtAfter | null>(null);
  const [{ imageHash, isImageHashValid }, setImageHash] = useState<HashState>({ imageHash: null, isImageHashValid: false });
  const [{ imageLen, isImageLenValid }, setImageLen] = useState<ImageState>({ imageLen: 0, isImageLenValid: false });
  const preimage = usePreimage(imageHash);

  useEffect((): void => {
    trackId !== undefined && setDefaultAtAfter((prev) =>
      getDefaultEnactment(prev, trackId)
    );
  }, [trackId]);

  useEffect((): void => {
    preimage?.proposalLength && setImageLen({ imageLen: preimage?.proposalLength.toNumber(), isImageLenValid: true });
  }, [preimage]);

  const trackInfo = useMemo(
    () => getTrackInfo(api, specName, palletReferenda, tracks, trackId),
    [api, palletReferenda, specName, trackId, tracks]
  );

  const isInvalidAt = useMemo(
    () => !bestNumber || !atAfter || (
      (atAfter as { At: BN }).At
        ? (atAfter as { At: BN }).At.lte(bestNumber)
        : (atAfter as { After: BN }).After.lt(BN_ONE)
    ),
    [atAfter, bestNumber]
  );

  const [originType, atAfterType] = useMemo(
    () => [
      [{
        name: 'origin',
        type: getTypeDef(api.tx[palletReferenda as 'referenda'].submit.meta.args[0].type.toString())
      }],
      [{
        name: 'enact',
        type: getTypeDef(api.tx[palletReferenda as 'referenda'].submit.meta.args[2].type.toString())
      }]
    ],
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

  const trackOpts = useMemo(
    () => tracks && tracks.map(([id, track]) => ({
      text: getTrackName(id, track),
      value: id.toNumber()
    })),
    [tracks]
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

  const _onChangeAtAfter = useCallback(
    ([{ isValid, value }]: RawParam[]) =>
      setAtAfter(isValid ? value : null),
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
    (l?: string): void => {
      try {
        const imageLen = parseInt(l || '0', 10);

        setImageLen({
          imageLen,
          isImageLenValid: Number.isInteger(imageLen)
        });
      } catch {
        setImageLen({
          imageLen: 0,
          isImageLenValid: false
        });
      }
    },
    []
  );

  return (
    <>
      {trackOpts && isSubmitOpen && (
        <Modal
          className={className}
          header={t<string>('Submit proposal')}
          onClose={toggleSubmit}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The proposal will be registered from this account and the balance lock will be applied here.')}>
              <InputAddress
                filter={members}
                help={t<string>('The account you want to propose from')}
                label={t<string>('propose from account')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t<string>('transferrable')}</span>}
                    params={accountId}
                  />
                }
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The hash of the preimage for the proposal as previously submitted or intended.')}>
              <Input
                autoFocus
                help={t<string>('The preimage hash of the proposal')}
                isError={!isImageHashValid}
                label={t<string>('preimage hash')}
                onChange={_onChangeImageHash}
                value={imageHash || ''}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The value will be populated when a valid on-chain hash exists in preimages')}>
              <Input
                help={t<string>('The preimage length of the proposal')}
                key='inputLength'
                label={t<string>('preimage length')}
                onChange={_onChangeImageLen}
                value={imageLen.toString()}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The origin (and by extension track) that you wish to submit for, each has a different period, different root and acceptance criteria.')}>
              <Dropdown
                defaultValue={trackOpts[0] && trackOpts[0].value}
                label={t<string>('submission track')}
                onChange={setTrack}
                options={trackOpts}
              />
              {false && trackInfo?.text && (
                <Input
                  isDisabled
                  label={t<string>('track overview')}
                  value={trackInfo?.text}
                />
              )}
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
                  label={t<string>('track origin')}
                  onChange={_onChangeOriginMulti}
                  options={originOptions}
                />
              )}
            </Modal.Columns>
            {bestNumber && defaultAtAfter && (
              <Modal.Columns hint={t<string>('The moment of enactment, either at a specific block, or after a specific number of blocks.', { replace: { bestNumber: formatNumber(bestNumber) } })}>
                <Params
                  className='timeSelect'
                  isError={isInvalidAt}
                  key={`after:${defaultAtAfter.trackId.toString()}`}
                  onChange={_onChangeAtAfter}
                  params={atAfterType}
                  values={defaultAtAfter.defaults}
                />
              </Modal.Columns>
            )}
            <Modal.Columns hint={t<string>('The deposit for this proposal will be locked for the referendum duration.')}>
              <InputBalance
                defaultValue={api.consts[palletReferenda as 'referenda'].submissionDeposit}
                isDisabled
                label={t<string>('submission deposit')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!selectedOrigin || !atAfter || !isImageHashValid || !isImageLenValid || !accountId || isInvalidAt || !preimage?.proposalHash}
              label={t<string>('Submit proposal')}
              onStart={toggleSubmit}
              params={[
                selectedOrigin,
                {
                  Lookup: preimage
                    ? { hash: preimage.proposalHash, len: imageLen }
                    : { hash: imageHash, len: imageLen }
                },
                atAfter
              ]}
              tx={api.tx[palletReferenda as 'referenda'].submit}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        isDisabled={!isMember || !trackOpts}
        label={t<string>('Submit proposal')}
        onClick={toggleSubmit}
      />
    </>
  );
}

export default React.memo(styled(Submit)`
  .originSelect, .timeSelect {
    > .ui--Params-Content {
      padding-left: 0;
    }
  }
`);
