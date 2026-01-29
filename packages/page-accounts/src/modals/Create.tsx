// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AddressState, CreateOptions, CreateProps, DeriveValidationOutput, PairType, SeedType } from '../types.js';

import React, { useCallback, useRef, useState } from 'react';

import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { AddressRow, Button, Checkbox, CopyButton, Dropdown, Expander, Input, MarkError, MarkWarning, Modal, styled, TextArea } from '@polkadot/react-components';
import { useApi, useLedger, useStepper } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { isHex, nextTick, u8aToHex } from '@polkadot/util';
import { hdLedger, hdValidatePath, keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import { useTranslation } from '../translate.js';
import { tryCreateAccount } from '../util.js';
import CreateAccountInputs from './CreateAccountInputs.js';
import CreateConfirmation from './CreateConfirmation.js';
import CreateEthDerivationPath, { ETH_DEFAULT_PATH } from './CreateEthDerivationPath.js';
import CreateSuriLedger from './CreateSuriLedger.js';
import ExternalWarning from './ExternalWarning.js';

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
  let isSeedValid = false;

  if (seedType === 'raw') {
    isSeedValid = rawValidate(seed);
  } else {
    const words = seed.split(' ');

    if (pairType === 'ed25519-ledger' && words.length === 25) {
      words.pop();

      isSeedValid = mnemonicValidate(words.join(' '));
    } else {
      isSeedValid = mnemonicValidate(seed);
    }
  }

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

function createAccount (seed: string, derivePath: string, pairType: PairType, { genesisHash, name, tags = [] }: CreateOptions, password: string, success: string): ActionStatus {
  const commitAccount = () =>
    keyring.addUri(getSuri(seed, derivePath, pairType), password, { genesisHash, isHardware: false, name, tags }, pairType === 'ed25519-ledger' ? 'ed25519' : pairType);

  return tryCreateAccount(commitAccount, success);
}

function Create ({ className = '', onClose, onStatusChange, seed: propsSeed, type: propsType }: CreateProps): React.ReactElement<CreateProps> {
  const { t } = useTranslation();
  const { api, isDevelopment, isEthereum } = useApi();
  const { isLedgerEnabled } = useLedger();
  const [{ address, derivePath, deriveValidation, isSeedValid, pairType, seed, seedType }, setAddress] = useState<AddressState>(() => generateSeed(
    propsSeed,
    isEthereum ? ETH_DEFAULT_PATH : '',
    propsSeed ? 'raw' : 'bip',
    isEthereum ? 'ethereum' : propsType
  ));
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [step, nextStep, prevStep] = useStepper();
  const [isBusy, setIsBusy] = useState(false);
  const [{ isNameValid, name }, setName] = useState(() => ({ isNameValid: false, name: '' }));
  const [{ isPasswordValid, password }, setPassword] = useState(() => ({ isPasswordValid: false, password: '' }));
  const isFirstStepValid = !!address && isMnemonicSaved && !deriveValidation?.error && isSeedValid;
  const isSecondStepValid = isNameValid && isPasswordValid;
  const isValid = isFirstStepValid && isSecondStepValid;

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t('This is an invalid derivation path.'),
    PASSWORD_IGNORED: t('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  });

  const seedOpt = useRef((
    isDevelopment
      ? [{ text: t('Development'), value: 'dev' }]
      : []
  ).concat(
    { text: t('Mnemonic'), value: 'bip' },
    isEthereum
      ? { text: t('Private Key'), value: 'raw' }
      : { text: t('Raw seed'), value: 'raw' }
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

  const _toggleMnemonicSaved = useCallback(
    () => setIsMnemonicSaved(!isMnemonicSaved),
    [isMnemonicSaved]
  );

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      nextTick((): void => {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(), isHardware: false, name: name.trim() };
        const status = createAccount(seed, derivePath, pairType, options, password, t('created account'));

        onStatusChange(status);
        setIsBusy(false);
        onClose();
      });
    },
    [api, derivePath, isDevelopment, isValid, name, onClose, onStatusChange, pairType, password, seed, t]
  );

  return (
    <StyledModal
      className={className}
      header={t('Add an account via seed {{step}}/{{STEPS_COUNT}}', { replace: { STEPS_COUNT, step } })}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <AddressRow
            defaultName={name}
            fullLength
            isEditableName={false}
            noDefaultNameOpacity
            value={(isSeedValid && address) || null}
          />
        </Modal.Columns>
        {step === 1 && <>
          <Modal.Columns hint={t('The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.')}>
            <TextArea
              isError={!isSeedValid}
              isReadOnly={seedType === 'dev'}
              label={
                seedType === 'bip'
                  ? t('mnemonic seed')
                  : seedType === 'dev'
                    ? t('development seed')
                    : isEthereum
                      ? t('ethereum private key')
                      : t('seed (hex or string)')
              }
              onChange={_onChangeSeed}
              seed={seed}
              withLabel
            >
              <CopyButton
                className='copyMoved'
                type={seedType === 'bip' ? t('mnemonic') : seedType === 'raw' ? isEthereum ? t('private key') : 'seed' : t('raw seed')}
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
            summary={t('Advanced creation options')}
          >
            {pairType !== 'ethereum' && (
              <Modal.Columns hint={t('If you are moving accounts between applications, ensure that you use the correct type.')}>
                <Dropdown
                  defaultValue={pairType}
                  label={t('keypair crypto type')}
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
              </Modal.Columns>
            )}
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
                  <Modal.Columns hint={t('The derivation path allows you to create different accounts from the same base mnemonic.')}>
                    <Input
                      isDisabled={seedType === 'raw'}
                      isError={!!deriveValidation?.error}
                      label={t('secret derivation path')}
                      onChange={_onChangePath}
                      placeholder={
                        seedType === 'raw'
                          ? pairType === 'sr25519'
                            ? t('//hard/soft')
                            : t('//hard')
                          : pairType === 'sr25519'
                            ? t('//hard/soft///password')
                            : t('//hard///password')
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
                label={<>{t('I have saved my mnemonic seed safely')}</>}
                onChange={_toggleMnemonicSaved}
                value={isMnemonicSaved}
              />
            </div>
          </Modal.Columns>
        </>}
        {step === 2 && <>
          <CreateAccountInputs
            name={{ isNameValid, name }}
            onCommit={_onCommit}
            setName={setName}
            setPassword={setPassword}
          />;
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
      <Modal.Actions>
        {step === 1 &&
          <Button
            activeOnEnter
            icon='step-forward'
            isDisabled={!isFirstStepValid}
            label={t('Next')}
            onClick={nextStep}
          />
        }
        {step === 2 && (
          <>
            <Button
              icon='step-backward'
              label={t('Prev')}
              onClick={prevStep}
            />
            <Button
              activeOnEnter
              icon='step-forward'
              isDisabled={!isSecondStepValid}
              label={t('Next')}
              onClick={nextStep}
            />
          </>
        )}
        {step === 3 && (
          <>
            <Button
              icon='step-backward'
              label={t('Prev')}
              onClick={prevStep}
            />
            <Button
              activeOnEnter
              icon='plus'
              isBusy={isBusy}
              label={t('Save')}
              onClick={_onCommit}
            />
          </>
        )}
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
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
`;

export default React.memo(Create);
