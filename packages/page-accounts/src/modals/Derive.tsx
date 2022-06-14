// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AddressRow, Button, Input, InputAddress, MarkError, Modal, Password, StatusContext } from '@polkadot/react-components';
import { useApi, useDebounce, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { keyExtractPath } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import { tryCreateAccount } from '../util';
import CreateAccountInputs from './CreateAccountInputs';
import CreateConfirmation from './CreateConfirmation';

interface Props {
  className?: string;
  from: string;
  onClose: () => void;
}

interface DeriveAddress {
  address: string | null;
  deriveError: string | null;
}

interface LockState {
  isLocked: boolean;
  lockedError: string | null;
}

function deriveValidate (suri: string, pairType: KeypairType): string | null {
  if (suri.includes('///')) {
    return 'Password paths are not supported on keys derived from others';
  }

  try {
    const { path } = keyExtractPath(suri);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'Soft derivation paths are not allowed on ed25519';
    }
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

function createAccount (source: KeyringPair, suri: string, name: string, password: string, success: string, genesisHash?: string): ActionStatus {
  const commitAccount = () => {
    const derived = source.derive(suri);

    derived.setMeta({ ...derived.meta, genesisHash, name, parentAddress: source.address, tags: [] });

    return keyring.addPair(derived, password || '');
  };

  return tryCreateAccount(commitAccount, success);
}

function Derive ({ className = '', from, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const { queueAction } = useContext(StatusContext);
  const [source] = useState(() => keyring.getPair(from));
  const [isBusy, setIsBusy] = useState(false);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPasswordValid, password }, setPassword] = useState({ isPasswordValid: false, password: '' });
  const [{ address, deriveError }, setDerive] = useState<DeriveAddress>({ address: null, deriveError: null });
  const [isConfirmationOpen, toggleConfirmation] = useToggle();
  const [{ isLocked, lockedError }, setIsLocked] = useState<LockState>({ isLocked: source.isLocked, lockedError: null });
  const [{ isRootValid, rootPass }, setRootPass] = useState({ isRootValid: false, rootPass: '' });
  const [suri, setSuri] = useState('');
  const debouncedSuri = useDebounce(suri);
  const isValid = !!address && !deriveError && isNameValid && isPasswordValid;

  useEffect((): void => {
    setIsLocked({ isLocked: source.isLocked, lockedError: null });
  }, [source]);

  useEffect((): void => {
    !isLocked && setDerive((): DeriveAddress => {
      let address: string | null = null;
      const deriveError = deriveValidate(debouncedSuri, source.type);

      if (!deriveError) {
        const result = source.derive(debouncedSuri);

        address = result.address;
      }

      return { address, deriveError };
    });
  }, [debouncedSuri, isLocked, source]);

  const _onChangeRootPass = useCallback(
    (rootPass: string): void => {
      setRootPass({ isRootValid: !!rootPass, rootPass });
      setIsLocked(({ isLocked }) => ({ isLocked, lockedError: null }));
    },
    []
  );

  const _onUnlock = useCallback(
    (): void => {
      setIsBusy(true);
      setTimeout((): void => {
        try {
          source.decodePkcs8(rootPass);
          setIsLocked({ isLocked: source.isLocked, lockedError: null });
        } catch (error) {
          console.error(error);
          setIsLocked({ isLocked: true, lockedError: (error as Error).message });
        }

        setIsBusy(false);
      }, 0);
    },
    [rootPass, source]
  );

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const status = createAccount(source, suri, name, password, t<string>('created account'), isDevelopment ? undefined : api.genesisHash.toString());

        queueAction(status);
        setIsBusy(false);
        onClose();
      }, 0);
    },
    [api, isDevelopment, isValid, name, onClose, password, queueAction, source, suri, t]
  );

  const sourceStatic = (
    <InputAddress
      help={t<string>('The selected account to perform the derivation on.')}
      isDisabled
      label={t<string>('derive root account')}
      value={from}
    />
  );

  return (
    <Modal
      className={className}
      header={t<string>('Derive account from pair')}
      onClose={onClose}
    >
      {address && isConfirmationOpen
        ? (
          <CreateConfirmation
            address={address}
            derivePath={suri}
            isBusy={isBusy}
            name={name}
            pairType={source.type}
          />
        )
        : (
          <Modal.Content>
            {isLocked && (
              <>
                {sourceStatic}
                <Password
                  autoFocus
                  help={t<string>('The password to unlock the selected account.')}
                  isError={!!lockedError}
                  label={t<string>('password')}
                  onChange={_onChangeRootPass}
                  value={rootPass}
                />
              </>
            )}
            {!isLocked && (
              <AddressRow
                defaultName={name}
                noDefaultNameOpacity
                value={deriveError ? '' : address}
              >
                {sourceStatic}
                <Input
                  autoFocus
                  help={t<string>('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>///<password>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`.')}
                  label={t<string>('derivation path')}
                  onChange={setSuri}
                  placeholder={t<string>('//hard/soft')}
                />
                {deriveError && (
                  <MarkError content={deriveError} />
                )}
                <CreateAccountInputs
                  name={{ isNameValid, name }}
                  onCommit={_onCommit}
                  setName={setName}
                  setPassword={setPassword}
                />;
              </AddressRow>
            )}
          </Modal.Content>
        )
      }
      <Modal.Actions>
        {isLocked
          ? (
            <Button
              icon='lock'
              isBusy={isBusy}
              isDisabled={!isRootValid}
              label={t<string>('Unlock')}
              onClick={_onUnlock}
            />
          )
          : (isConfirmationOpen
            ? (
              <>
                <Button
                  icon='step-backward'
                  label={t<string>('Prev')}
                  onClick={toggleConfirmation}
                />
                <Button
                  icon='plus'
                  isBusy={isBusy}
                  label={t<string>('Save')}
                  onClick={_onCommit}
                />
              </>
            )
            : (
              <Button
                icon='step-forward'
                isDisabled={!isValid}
                label={t<string>('Next')}
                onClick={toggleConfirmation}
              />
            )
          )
        }
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Derive);
