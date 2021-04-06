// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import type { AddressState, CreateOptions, CreateProps, DeriveValidationOutput, PairType, SeedType } from '../types';

import FileSaver from 'file-saver';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { getEnvironment } from '@polkadot/react-api/util';
import { AddressRow, Button, Checkbox, CopyButton, Dropdown, Expander, Input, InputAddress, MarkError, MarkWarning, Modal, TextArea } from '@polkadot/react-components';
import { useApi, useLedger, useStepper } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { hdLedger, hdValidatePath, keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import CreateConfirmation from './CreateConfirmation';
import CreateEthDerivationPath, { ETH_DEFAULT_PATH } from './CreateEthDerivationPath';
import CreateSuriLedger from './CreateSuriLedger';
import ExternalWarning from './ExternalWarning';
import PasswordInput from './PasswordInput';

const DEFAULT_PAIR_TYPE = 'sr25519';
const STEPS_COUNT = 3;

function getSuri (seed: string, derivePath: string, pairType: PairType): string {
  return pairType === 'ed25519-ledger'
    ? u8aToHex(hdLedger(seed, derivePath).secretKey.slice(0, 32))
    : pairType === 'ethereum'
      ? `${seed}/${derivePath}`
      : `${seed}${derivePath}`;
}

function deriveValidate (seed: string, seedType: SeedType, derivePath: string, pairType: PairType): DeriveValidationOutput {
  try {
    const { password, path } = keyExtractSuri(pairType === 'ethereum' ? `${seed}/${derivePath}` : `${seed}${derivePath}`);
    let result: DeriveValidationOutput = {};

    // show a warning in case the password contains an unintended / character
    if (password?.includes('/')) {
      result = { warning: 'WARNING_SLASH_PASSWORD' };
    }

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return { ...result, error: 'SOFT_NOT_ALLOWED' };
    }

    // we don't allow password for hex seed
    if (seedType === 'raw' && password) {
      return { ...result, error: 'PASSWORD_IGNORED' };
    }

    if (pairType === 'ethereum' && !hdValidatePath(derivePath)) {
      return { ...result, error: 'INVALID_DERIVATION_PATH' };
    }

    return result;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

function isHexSeed (seed: string): boolean {
  return isHex(seed) && seed.length === 66;
}

function rawValidate (seed: string): boolean {
  return ((seed.length > 0) && (seed.length <= 32)) || isHexSeed(seed);
}

function addressFromSeed (seed: string, derivePath: string, pairType: PairType): string {
  return keyring
    .createFromUri(getSuri(seed, derivePath, pairType), {}, pairType === 'ed25519-ledger' ? 'ed25519' : pairType)
    .address;
}

function newSeed (seed: string | undefined | null, seedType: SeedType): string {
  switch (seedType) {
    case 'bip':
      return mnemonicGenerate();
    case 'dev':
      return DEV_PHRASE;
    default:
      return seed || u8aToHex(randomAsU8a());
  }
}

function generateSeed (_seed: string | undefined | null, derivePath: string, seedType: SeedType, pairType: PairType = DEFAULT_PAIR_TYPE): AddressState {
  const seed = newSeed(_seed, seedType);
  const address = addressFromSeed(seed, derivePath, pairType);

  return {
    address,
    derivePath,
    deriveValidation: undefined,
    isSeedValid: true,
    pairType,
    seed,
    seedType
  };
}

function updateAddress (seed: string, derivePath: string, seedType: SeedType, pairType: PairType): AddressState {
  let address: string | null = null;
  let deriveValidation: DeriveValidationOutput = deriveValidate(seed, seedType, derivePath, pairType);
  let isSeedValid = seedType === 'raw'
    ? rawValidate(seed)
    : mnemonicValidate(seed);

  if (!deriveValidation?.error && isSeedValid) {
    try {
      address = addressFromSeed(seed, derivePath, pairType);
    } catch (error) {
      console.error(error);
      deriveValidation = { error: (error as Error).message ? (error as Error).message : (error as Error).toString() };
      isSeedValid = false;
    }
  }

  return {
    address,
    derivePath,
    deriveValidation,
    isSeedValid,
    pairType,
    seed,
    seedType
  };
}

export function downloadAccount ({ json, pair }: CreateResult): void {
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

  FileSaver.saveAs(blob, `${pair.address}.json`);
}

function createAccount (seed: string, derivePath: string, pairType: PairType, { genesisHash, name, tags = [] }: CreateOptions, password: string, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const result = keyring.addUri(getSuri(seed, derivePath, pairType), password, { genesisHash, isHardware: false, name, tags }, pairType === 'ed25519-ledger' ? 'ed25519' : pairType);
    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;

    InputAddress.setLastValue('account', address);

    if (getEnvironment() === 'web') {
      downloadAccount(result);
    }
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function Create ({ className = '', onClose, onStatusChange, seed: propsSeed, type: propsType }: CreateProps): React.ReactElement<CreateProps> {
  const { t } = useTranslation();
  const { api, isDevelopment, isEthereum } = useApi();
  const { isLedgerEnabled } = useLedger();
  const [{ address, derivePath, deriveValidation, isSeedValid, pairType, seed, seedType }, setAddress] = useState<AddressState>(() => generateSeed(
    propsSeed,
    isEthereum ? ETH_DEFAULT_PATH : '',
    propsSeed ? 'raw' : 'bip', isEthereum ? 'ethereum' : propsType
  ));
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [step, nextStep, prevStep] = useStepper();
  const [isBusy, setIsBusy] = useState(false);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPasswordValid, password }, setPassword] = useState({ isPasswordValid: false, password: '' });
  const isFirstStepValid = !!address && isMnemonicSaved && !deriveValidation?.error && isSeedValid;
  const isSecondStepValid = isNameValid && isPasswordValid;
  const isValid = isFirstStepValid && isSecondStepValid;

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t<string>('This is an invalid derivation path.'),
    PASSWORD_IGNORED: t<string>('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t<string>('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t<string>('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  });

  const seedOpt = useRef((
    isDevelopment
      ? [{ text: t<string>('Development'), value: 'dev' }]
      : []
  ).concat(
    { text: t<string>('Mnemonic'), value: 'bip' },
    isEthereum
      ? { text: t<string>('Private Key'), value: 'raw' }
      : { text: t<string>('Raw seed'), value: 'raw' }
  ));

  const _onChangePath = useCallback(
    (newDerivePath: string) => setAddress(
      updateAddress(seed, newDerivePath, seedType, pairType)
    ),
    [pairType, seed, seedType]
  );

  const _onChangeSeed = useCallback(
    (newSeed: string) => setAddress(
      updateAddress(newSeed, derivePath, seedType, pairType)
    ),
    [derivePath, pairType, seedType]
  );

  const _onChangePairType = useCallback(
    (newPairType: PairType) => setAddress(
      updateAddress(seed, isEthereum ? ETH_DEFAULT_PATH : '', seedType, newPairType)
    ),
    [seed, seedType, isEthereum]
  );

  const _selectSeedType = useCallback(
    (newSeedType: SeedType): void => {
      if (newSeedType !== seedType) {
        setAddress(generateSeed(null, derivePath, newSeedType, pairType));
      }
    },
    [derivePath, pairType, seedType]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onPasswordChange = useCallback(
    (password: string, isPasswordValid: boolean) => setPassword({ isPasswordValid, password }),
    []
  );

  const _toggleMnemonicSaved = () => {
    setIsMnemonicSaved(!isMnemonicSaved);
  };

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), isHardware: false, name: name.trim() };
        const status = createAccount(seed, derivePath, pairType, options, password, t<string>('created account'));

        onStatusChange(status);
        setIsBusy(false);
        onClose();
      }, 0);
    },
    [api, derivePath, isDevelopment, isValid, name, onClose, onStatusChange, pairType, password, seed, t]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add an account via seed {{step}}/{{STEPS_COUNT}}', { replace: { STEPS_COUNT, step } })}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <AddressRow
            defaultName={name}
            fullLength
            isEditableName={false}
            noDefaultNameOpacity
            value={isSeedValid ? address : ''}
          />
        </Modal.Columns>
        {step === 1 && <>
          <Modal.Columns hint={t<string>('The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.')}>
            <TextArea
              help={isEthereum
                ? t<string>("Your ethereum key pair is derived from your private key. Don't divulge this key.")
                : t<string>('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
              isAction
              isError={!isSeedValid}
              isReadOnly={seedType === 'dev'}
              label={
                seedType === 'bip'
                  ? t<string>('mnemonic seed')
                  : seedType === 'dev'
                    ? t<string>('development seed')
                    : isEthereum
                      ? t<string>('ethereum private key')
                      : t<string>('seed (hex or string)')
              }
              onChange={_onChangeSeed}
              seed={seed}
              withLabel
            >
              <CopyButton
                className='copyMoved'
                type={seedType === 'bip' ? t<string>('mnemonic') : seedType === 'raw' ? isEthereum ? t<string>('private key') : 'seed' : t<string>('raw seed')}
                value={seed}
              />
              <Dropdown
                defaultValue={seedType}
                isButton
                onChange={_selectSeedType}
                options={seedOpt.current}
              />
            </TextArea>
          </Modal.Columns>
          <Expander
            className='accounts--Creator-advanced'
            isPadded
            summary={t<string>('Advanced creation options')}
          >
            {
              pairType !== 'ethereum' && <Modal.Columns hint={t<string>('If you are moving accounts between applications, ensure that you use the correct type.')}>
                <Dropdown
                  defaultValue={pairType}
                  help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
                  label={t<string>('keypair crypto type')}
                  onChange={_onChangePairType}
                  options={
                    isEthereum
                      ? settings.availableCryptosEth
                      : isLedgerEnabled
                        ? settings.availableCryptosLedger
                        : settings.availableCryptos
                  }
                  tabIndex={-1}
                />
              </Modal.Columns>}
            {pairType === 'ed25519-ledger'
              ? (
                <CreateSuriLedger
                  onChange={_onChangePath}
                  seedType={seedType}
                />
              )
              : pairType === 'ethereum'
                ? (
                  <CreateEthDerivationPath
                    derivePath={derivePath}
                    deriveValidation={deriveValidation}
                    onChange={_onChangePath}
                    seed={seed}
                    seedType={seedType}
                  />
                )
                : (
                  <Modal.Columns hint={t<string>('The derivation path allows you to create different accounts from the same base mnemonic.')}>
                    <Input
                      help={(t<string>('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. An optional "///<password>" can be used with a mnemonic seed, and may only be specified once.'))}
                      isDisabled={seedType === 'raw'}
                      isError={!!deriveValidation?.error}
                      label={t<string>('secret derivation path')}
                      onChange={_onChangePath}
                      placeholder={
                        seedType === 'raw'
                          ? pairType === 'sr25519'
                            ? t<string>('//hard/soft')
                            : t<string>('//hard')
                          : pairType === 'sr25519'
                            ? t<string>('//hard/soft///password')
                            : t<string>('//hard///password')
                      }
                      tabIndex={-1}
                      value={derivePath}
                    />
                    {deriveValidation?.error && (
                      <MarkError content={errorIndex.current[deriveValidation.error] || deriveValidation.error} />
                    )}
                    {deriveValidation?.warning && (
                      <MarkWarning content={errorIndex.current[deriveValidation.warning]} />
                    )}
                  </Modal.Columns>
                )}
          </Expander>
          <Modal.Columns>
            <ExternalWarning />
            <div className='saveToggle'>
              <Checkbox
                label={<>{t<string>('I have saved my mnemonic seed safely')}</>}
                onChange={_toggleMnemonicSaved}
                value={isMnemonicSaved}
              />
            </div>
          </Modal.Columns>
        </>}
        {step === 2 && <>
          <Modal.Columns hint={t<string>('The name for this account and how it will appear under your addresses. With an on-chain identity, it can be made available to others.')}>
            <Input
              autoFocus
              help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
              isError={!isNameValid}
              label={t<string>('name')}
              onChange={_onChangeName}
              onEnter={_onCommit}
              placeholder={t<string>('new account')}
              value={name}
            />
          </Modal.Columns>
          <PasswordInput
            onChange={_onPasswordChange}
            onEnter={_onCommit}
          />
          <Modal.Columns>
            <ExternalWarning />
          </Modal.Columns>
        </>}
        {step === 3 && address && (
          <CreateConfirmation
            derivePath={derivePath}
            isBusy={isBusy}
            pairType={
              pairType === 'ed25519-ledger'
                ? 'ed25519'
                : pairType
            }
            seed={seed}
          />
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {step === 1 &&
          <Button
            icon='step-forward'
            isDisabled={!isFirstStepValid}
            label={t<string>('Next')}
            onClick={nextStep}
          />
        }
        {step === 2 && (
          <>
            <Button
              icon='step-backward'
              label={t<string>('Prev')}
              onClick={prevStep}
            />
            <Button
              icon='step-forward'
              isDisabled={!isSecondStepValid}
              label={t<string>('Next')}
              onClick={nextStep}
            />
          </>
        )}
        {step === 3 && (
          <>
            <Button
              icon='step-backward'
              label={t<string>('Prev')}
              onClick={prevStep}
            />
            <Button
              icon='plus'
              isBusy={isBusy}
              label={t<string>('Save')}
              onClick={_onCommit}
            />
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Create)`
  .accounts--Creator-advanced {
    margin-top: 1rem;
    overflow: visible;
  }

  .ui--CopyButton.copyMoved {
    position: absolute;
    right: 9.25rem;
    top: 1.15rem;
  }

  && .TextAreaWithDropdown {
    textarea {
      width: 80%;
    }
    .ui.buttons {
      width: 20%;
    }
  }

  .saveToggle {
    text-align: right;

    .ui--Checkbox {
      margin: 0.8rem 0;

      > label {
        font-weight: var(--font-weight-normal);
      }
    }
  }
`);
