// Copyright 2017-2020 @polkadot/app-master-submission authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState, useEffect } from 'react';

import { Button, Extrinsic, InputAddress, TxButton, Input, Output, Static } from '@polkadot/react-components';
import { hexToU8a, isFunction, isHex, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { GenericCall, getTypeDef } from '@polkadot/types';

import { Signer } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { web3FromSource } from '@polkadot/extension-dapp';

import keyring from '@polkadot/ui-keyring';

import Unlock from '../../page-toolbox/src/Unlock';
import SignatureDIDs from './SignatureDIDs';
import { useTranslation } from './translate';

interface Props {
  className?: string;
}

interface AccountState {
  isExternal: boolean;
  isHardware: boolean;
  isInjected: boolean;
}

interface DataState {
  data: string;
  isHexData: boolean;
}

interface SignerState {
  isUsable: boolean;
  signer: Signer | null;
}

const testCallJSON = {"callIndex":[4,0],"args":{"validator_id":"5CPQTa6TShzeM5sHPbsmDAB2ZHcrvnU2sHj5xPFRUr8ov3dk","short_circuit":true}};

function Selection (): React.ReactElement {
  // TODO: cleanup these
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [defaultParams, setDefaultParams] = useState<object[] | null>(null);
  const [proposalJSON, setProposalJSON] = useState<string>('');
  const [proposal, setProposal] = useState<object>('');
  const [roundNo, setRoundNo] = useState<object>('');
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [defaultExtrinsicValue, setDefaultExtrinsic] = useState<object | null>(null);

  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(keyring.getPairs()[0] || null);
  const [{ data, isHexData }, setData] = useState<DataState>({ data: '', isHexData: false });
  const [{ isInjected }, setAccountState] = useState<AccountState>({ isExternal: false, isHardware: false, isInjected: false });
  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState<SignerState>({ isUsable: true, signer: null });
  const [signature, setSignature] = useState('');
  const [isUnlockVisible, toggleUnlock] = useToggle();
  const [isExecuteVisible, toggleExecute] = useToggle();

  useEffect((): void => {
    const meta = (currentPair && currentPair.meta) || {};
    const isExternal = (meta.isExternal as boolean) || false;
    const isHardware = (meta.isHardware as boolean) || false;
    const isInjected = (meta.isInjected as boolean) || false;
    const isUsable = !(isExternal || isHardware || isInjected);

    setAccountState({ isExternal, isHardware, isInjected });
    setIsLocked(
      isInjected
        ? false
        : (currentPair && currentPair.isLocked) || false
    );
    setSignature('');
    setSigner({ isUsable, signer: null });

    _getRoundNo();

    // for injected, retrieve the signer
    if (meta.source && isInjected) {
      web3FromSource(meta.source as string)
        .catch((): null => null)
        .then((injected) => setSigner({
          isUsable: isFunction(injected?.signer?.signRaw),
          signer: injected?.signer || null
        }))
        .catch(console.error);
    }
  }, [currentPair]);

  useEffect(() => {
    if (!proposalJSON) {
      const proposalB64 = window.location.hash.split('proposal=')[1];
      if (proposalB64) {
        const proposalJSON = atob(decodeURIComponent(proposalB64));
        setProposalJSON(proposalJSON);
        const proposal = JSON.parse(proposalJSON);
        _setProposal(proposal);
      }
    }
  }, [proposalJSON]);

  useEffect(() => {
    if (proposal) {
      _setVotePayload();
    }
  }, [proposal]);

  const _getRoundNo = async () => {
    const roundNumber = await api.query.master.round();
    setRoundNo(roundNumber);
  };

  const _setVotePayload = async () => {
    const payload = {
      proposal: [...api.createType('Call', proposal).toU8a()],
      round_no: roundNo,
    };

    console.log(`roundNo ${roundNo}`)
    console.log('payload', payload)

    const encoded_state_change = api.createType('StateChange', { MasterVote: payload }).toU8a();
    setData({ data: u8aToHex(encoded_state_change), isHexData: true });
  };

  const _encodedParamsToArgs = (extr, params) => {
    return GenericCall.filterOrigin(extr.meta).map((arg): { name: string; type: TypeDef } => ({
      value: params[arg.name.toString()],
      isValid: true
    }));
  };

  const _onChangeAccount = useCallback(
    (accountId: string | null) => setCurrentPair(keyring.getPair(accountId || '')),
    []
  );

  const _onExecute = useCallback(
    (): void => {
      if (isLocked || !isUsable || !currentPair) {
        return;
      }

      toggleExecute(true);
    },
    [currentPair, data, isHexData, isLocked, isUsable, signer]
  );

  const _onSign = useCallback(
    (): void => {
      if (isLocked || !isUsable || !currentPair) {
        return;
      }

      if (signer && isFunction(signer.signRaw)) {
        setSignature('');

        signer
          .signRaw({
            address: currentPair.address,
            data: isHexData
              ? data
              : stringToHex(data),
            type: 'bytes'
          })
          .then(({ signature }) => setSignature(signature))
          .catch(console.error);
      } else {
        setSignature(u8aToHex(
          currentPair.sign(
            isHexData
              ? hexToU8a(data)
              : stringToU8a(data)
          )
        ));
      }
    },
    [currentPair, data, isHexData, isLocked, isUsable, signer]
  );

  const _onUnlock = useCallback(
    (): void => {
      setIsLocked(false);
      toggleUnlock();
    },
    [toggleUnlock]
  );

  const _setProposal = async (proposal) => {
    const extr = api.createType('Call', proposal);
    const erxtrinsicValue = api.tx[extr.sectionName][extr.methodName];
    const defaultPs = _encodedParamsToArgs(erxtrinsicValue, proposal.args);

    setProposal(proposal);
    setDefaultParams(() => defaultPs);

    if (extrinsic != erxtrinsicValue) {
      setDefaultExtrinsic(() => erxtrinsicValue);
    }


    const extrParams = defaultPs.map(({ value }): any => value);
    setExtrinsic(() => erxtrinsicValue(...extrParams));
  };

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) => setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) => setError(error ? error.message : null),
    []
  );

  const _onJSONChanged = useCallback(
    (jsonStr?: string) => {
      setProposalJSON(() => jsonStr);

      if (jsonStr) {
        try {
          _setProposal(JSON.parse(jsonStr));
        } catch (error) {
          console.error(error);
          // TODO: set json de-serialize error
        }
      }
    },
    []
  );

  const usedExtrinsic = (defaultExtrinsicValue || apiDefaultTxSudo);
  const { meta, method, section } = usedExtrinsic;

  return (
    <div className='extrinsics--Selection'>
      <Input
        autoFocus
        className='medium'
        help={t<string>('Enter the proposal JSON here to vote on it as a master member by providing your signature')}
        label={t<string>('Proposal JSON')}
        onChange={_onJSONChanged}
        value={proposalJSON}
      />

      <br />

      <Extrinsic
        key={`${usedExtrinsic.section}.${usedExtrinsic.method}:inputyz` /* force re-render on change */}
        defaultParams={defaultParams}
        defaultValue={defaultExtrinsicValue || apiDefaultTxSudo}
        label={t<string>('vote on the following proposal')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
        isDisabled={true}
      />
      {error && (
        <article className='error'>{error}</article>
      )}

    <br />

    {proposal && (
      <>
        <div className='ui--row'>
          <InputAddress
            className='full'
            help={t<string>('select the account you wish to sign data with')}
            isInput={false}
            label={t<string>('account')}
            onChange={_onChangeAccount}
            type='account'
          />
        </div>
        <div className='toolbox--Sign-input'>
          <div className='ui--row'>
            <Output
              className='full'
              help={t<string>('The input data to sign. This can be either specified as a hex value (0x-prefix) or as a string.')}
              label={t<string>('sign the following vote payload')}
              value={data}
              isMonospace
              withCopy
            />
          </div>
          <div className='ui--row'>
            <Output
              className='full'
              help={t<string>('This is the current master voting round number')}
              label={t<string>('at the current round number:')}
              value={`${roundNo}`}
              isMonospace
            />
          </div>
          <div className='ui--row'>
            <Output
              className='full'
              help={t<string>('The resulting signature of the input data, as done with the crypto algorithm from the account. (This could be non-deterministic for some types such as sr25519).')}
              isHidden={signature.length === 0}
              isMonospace
              label={t<string>('signature for vote')}
              value={signature}
              withCopy
            />
          </div>
          <div
            className='unlock-overlay'
            hidden={!isUsable || !isLocked || isInjected}
          >
            {isLocked && (
              <div className='unlock-overlay-warning'>
                <div className='unlock-overlay-content'>
                  {t<string>('You need to unlock this account to be able to sign data and execute the proposal.')}<br/>
                  <Button.Group>
                    <Button
                      icon='unlock'
                      label={t<string>('Unlock account')}
                      onClick={toggleUnlock}
                    />
                  </Button.Group>
                </div>
              </div>
            )}
          </div>
          <div
            className='unlock-overlay'
            hidden={isUsable}
          >
            <div className='unlock-overlay-warning'>
              <div className='unlock-overlay-content'>
                {isInjected
                  ? t<string>('This injected account cannot be used to sign data since the extension does not support raw signing.')
                  : t<string>('This external account cannot be used to sign data. Only Limited support is currently available for signing from any non-internal accounts.')}
              </div>
            </div>
          </div>
          {isUnlockVisible && (
            <Unlock
              onClose={toggleUnlock}
              onUnlock={_onUnlock}
              pair={currentPair}
            />
          )}

          {isExecuteVisible && !isLocked && isUsable && (
            <SignatureDIDs
              onClose={toggleExecute}
              pair={currentPair}
              proposal={proposal}
            />
          )}
        </div>
        <Button.Group>
          <Button
            icon='key'
            isDisabled={!(isUsable && !isLocked)}
            label={t<string>('Execute Proposal')}
            onClick={_onExecute}
          />

          <Button
            icon='key'
            isDisabled={!(isUsable && !isLocked)}
            label={t<string>('Sign and Vote')}
            onClick={_onSign}
            isPrimary
          />
        </Button.Group>
      </>
    )}
    </div>
  );
}

export default React.memo(Selection);
