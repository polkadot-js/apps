// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';


import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BalanceFree } from '@polkadot/react-query';


import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
  proposal: object;
  pair: KeyringPair | null;
}

function SignatureDIDs ({ onClose, proposal, pair }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [pairCount, setPairCount] = useState(1);
  const [requiredMembersCount, setRequiredMembersCount] = useState(0);
  const [didSignaturePairs, setDidSignaturePairs] = useState([]);

  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) => setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) => setError(error ? error.message : null),
    []
  );

  const _setMasterReqs = async () => {
    const members = await api.query.master.members();
    const reqCount = parseInt(members.vote_requirement);
    const curLen = didSignaturePairs.length;
    for (let i = curLen; i < reqCount; i++) {
      didSignaturePairs.push({
        did: '',
        signature: '',
      })
    }

    setRequiredMembersCount(reqCount);
    setPairCount(didSignaturePairs.length);
  };

  useEffect((): void => {
    if (requiredMembersCount === 0) {
      _setMasterReqs();
    }
  }, [requiredMembersCount]);

  useEffect((): void => {
    setAddress(pair?.address || '');
  }, [pair?.address]);

  useEffect((): void => {
    setUnlockError(null);
  }, [password]);

  useEffect((): void => {
    const call = api.createType('Call', proposal);

    // setProposal(() => proposal);

    // // parse votes
    // const mpauth = toPMAuth(api, votes);
    //
    // // verify votes are valid and sufficient before submitting
    // await assertValidAuth(api, call, mpauth);

    // combine signatures and encoded call into a single "execute" extrinsic
    const extrinsic = api.tx.master.execute(call, null);
    setExtrinsic(() => extrinsic);
  }, [proposal]);

  const _onAddDIDPair = useCallback(
    (): void => {
      didSignaturePairs.push({
        did: '',
        signature: '',
      });
      setDidSignaturePairs(didSignaturePairs);
      setPairCount(didSignaturePairs.length);
    },
    [didSignaturePairs]
  );


  if (!pair) {
    return null;
  }

  return (
    <Modal
      className='toolbox--Unlock'
      header={t<string>('execute proposal')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('using the selected account')}
              labelExtra={
                <BalanceFree
                  label={<label>{t<string>('free balance')}</label>}
                  params={address}
                />
              }
              onChange={setAccountId}
              type='account'
              value={address}
              isDisabled
            />

          </Modal.Column>
          <Modal.Column>
            <p>{t<string>(`This account will used to pay for and submit the proposal. It requires at least ${requiredMembersCount} master member DID/signature pairs to execute successfully.`)}</p>
          </Modal.Column>
        </Modal.Columns>

        <Button.Group>
          <Button
            icon='plus'
            label={t<string>('Add DID/Signature pair')}
            onClick={_onAddDIDPair}
          />
        </Button.Group>

        {didSignaturePairs.map((didSigPair, index) => {
          return (
            <Modal.Columns key={index}>
              <Modal.Column>
                <Input
                  help={t<string>('The master member\'s vote signature.')}
                  isError={!!unlockError}
                  label={t<string>('signature')}
                  onChange={(value) => {
                    didSigPair.signature = value;
                    setDidSignaturePairs([...didSignaturePairs]);
                  }}
                  value={didSigPair.signature}
                />
              </Modal.Column>
              <Modal.Column>
                <Input
                  autoFocus
                  help={t<string>('The master member\'s associated DID.')}
                  isError={!!unlockError}
                  label={t<string>('DID')}
                  onChange={(value) => {
                    didSigPair.did = value;
                    setDidSignaturePairs([...didSignaturePairs]);
                  }}
                  value={didSigPair.did}
                />
              </Modal.Column>
            </Modal.Columns>
          );
        })}

        <div className='extrinsics--Selection'>
          <Extrinsic
            defaultValue={api.tx.master.execute}
            label={t<string>('submit the following extrinsic')}
            onError={_onExtrinsicError}
            isDisabled={true}
          />
          {error && (
            <article className='error'>{error}</article>
          )}
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isBasic
          isDisabled={!extrinsic}
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!extrinsic || !accountId}
          isPrimary={false}
          label={t<string>('Submit Transaction')}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SignatureDIDs);
