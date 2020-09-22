// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import NewPasswordInput from '@polkadot/app-accounts/Accounts/NewPasswordInput';
import CreateConfirmation from '@polkadot/app-accounts/modals/CreateConfirmation';
import ExternalWarning from '@polkadot/app-accounts/modals/ExternalWarning';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { ModalProps } from '@polkadot/app-accounts/types';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { getEnvironment } from '@polkadot/react-api/util';
import { AddressRow,
  BackButton,
  Button,
  Checkbox,
  CopyToClipboard,
  DropdownNew,
  Expander,
  Icon,
  InputAddress,
  InputNew,
  InputSection,
  Modal } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import TextAreaWithLabel from '@polkadot/react-components/TextAreaWithLabel';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { CreateResult } from '@polkadot/ui-keyring/types';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';
import FileSaver from 'file-saver';
import print from 'print-js';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
  seed?: string;
  type?: KeypairType;
}

type SeedType = 'bip' | 'raw' | 'dev';

interface AddressState {
  address: string | null;
  derivePath: string;
  deriveValidation? : DeriveValidationOutput
  isSeedValid: boolean;
  pairType: KeypairType;
  seed: string;
  seedType: SeedType;
}

interface CreateOptions {
  genesisHash?: string;
  name: string;
  tags?: string[];
}

interface DeriveValidationOutput {
  error?: string;
  warning?: string;
}

const DEFAULT_PAIR_TYPE = 'sr25519';
const NUM_STEPS = 3;

function deriveValidate (seed: string, seedType: SeedType, derivePath: string, pairType: KeypairType): DeriveValidationOutput {
  try {
    const { password, path } = keyExtractSuri(`${seed}${derivePath}`);
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

function addressFromSeed (phrase: string, derivePath: string, pairType: KeypairType): string {
  return keyring
    .createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType)
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

function generateSeed (_seed: string | undefined | null, derivePath: string, seedType: SeedType, pairType: KeypairType = DEFAULT_PAIR_TYPE): AddressState {
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

function updateAddress (seed: string, derivePath: string, seedType: SeedType, pairType: KeypairType): AddressState {
  const deriveValidation = deriveValidate(seed, seedType, derivePath, pairType);
  let isSeedValid = seedType === 'raw'
    ? rawValidate(seed)
    : mnemonicValidate(seed);
  let address: string | null = null;

  if (!deriveValidation?.error && isSeedValid) {
    try {
      address = addressFromSeed(seed, derivePath, pairType);
    } catch (error) {
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

function createAccount (suri: string, pairType: KeypairType, { genesisHash, name, tags = [] }: CreateOptions, password: string, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const result = keyring.addUri(suri, password, { genesisHash, name, tags }, pairType);
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

function Create ({ className = '', onClose, onStatusChange, seed: propsSeed, type: propsType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const [{ address, derivePath, deriveValidation, isSeedValid, pairType, seed, seedType }, setAddress] = useState<AddressState>(generateSeed(propsSeed, '', propsSeed ? 'raw' : 'bip', propsType));
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [isBusy, setIsBusy] = useState(false);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPasswordValid, password }, setPassword] = useState({ isPasswordValid: false, password: '' });
  const isValid = !!address && !deriveValidation?.error && isNameValid && isPasswordValid && isSeedValid;
  const errorIndex: Record<string, string> = useMemo(() => ({
    PASSWORD_IGNORED: t<string>('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t<string>('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t<string>('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  }), [t]);

  const seedOpt = useMemo(() => (
    isDevelopment
      ? [{ text: t<string>('Development'), value: 'dev' }]
      : []
  ).concat(
    { text: t<string>('Mnemonic'), value: 'bip' },
    { text: t<string>('Raw seed'), value: 'raw' }
  ), [isDevelopment, t]);

  const _onChangeDerive = useCallback(
    (newDerivePath: string) => setAddress(updateAddress(seed, newDerivePath, seedType, pairType)),
    [pairType, seed, seedType]
  );

  const _onChangeSeed = useCallback(
    (newSeed: string) => setAddress(updateAddress(newSeed, derivePath, seedType, pairType)),
    [derivePath, pairType, seedType]
  );

  const _onChangePairType = useCallback(
    (newPairType: KeypairType) => setAddress(updateAddress(seed, derivePath, seedType, newPairType)),
    [derivePath, seed, seedType]
  );

  const _selectSeedType = useCallback(
    (newSeedType: SeedType): void => {
      if (newSeedType !== seedType) {
        setAddress(generateSeed(null, derivePath, newSeedType, pairType));
      }
    },
    [derivePath, pairType, seedType]
  );

  const _toggleMnemonicSaved = () => {
    setIsMnemonicSaved(!isMnemonicSaved);
  };

  const _nextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const _previousStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onPasswordChange = useCallback(
    (password: string, isPasswordValid: boolean) => setPassword({ isPasswordValid, password }),
    []
  );

  const onPrintSeed = () => {
    print('printJS-seed', 'html');
  };

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
        const status = createAccount(`${seed}${derivePath}`, pairType, options, password, t<string>('created account'));

        onStatusChange(status);
        setIsBusy(false);
        onClose();
      }, 0);
    },
    [api, derivePath, isDevelopment, isValid, name, onClose, onStatusChange, pairType, password, seed, t]
  );

  return (
    <Modal
      className={`${className} ui--Modal-Wrapper medium`}
      header={t<string>('Add an account via seed {{step}}/{{NUM_STEPS}}', {
        replace: {
          NUM_STEPS,
          step
        }
      })}
      size='large'
    >
      <Button
        icon='times'
        onClick={onClose}
      />
      <Modal.Content>
        <AddressRow
          className='ui--AddressRow-new-create-modal'
          defaultName={name}
          isEditableName={false}
          noDefaultNameOpacity
          value={isSeedValid ? address : ''}
        />
        {step === 1 && <>
          <article className='ui--Warning'>
            <Icon icon='exclamation-triangle' />
            <div>{t<string>("Please write down your wallet's mnemonic seed and keep it in a safe place")}</div>
          </article>
          <TextAreaWithLabel
            help={t<string>('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
            isAction
            isError={!isSeedValid}
            isReadOnly={seedType === 'dev'}
            label={
              seedType === 'bip'
                ? t<string>('mnemonic seed')
                : seedType === 'dev'
                  ? t<string>('development seed')
                  : t<string>('seed (hex or string)')
            }
            onChange={_onChangeSeed}
            seed={seed}
          >
            <DropdownNew
              classNameButton='seedDropdown'
              defaultValue={seedType}
              isButton
              onChange={_selectSeedType}
              options={seedOpt}
            />
          </TextAreaWithLabel>
          <div className='ui--Buttons-row'>
            <CopyToClipboard
              className='ui--Print-btn'
              description={t<string>('seed')}
              elementId='printJS-seed' />
            <button
              className='ui--Print-btn'
              onClick={onPrintSeed}
            >
              <Icon icon='print' />
                  Print {seedType === 'bip' ? 'seed phrase' : 'seed'}
            </button>
          </div>
          <Expander
            className='accounts--Creator-advanced'
            iconPlacement='left'
            isOpen={false}
            summary={t<string>('Advanced creation options')}
          >
            <InputSection>
              <DropdownNew
                defaultValue={pairType}
                help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
                label={t<string>('keypair crypto type')}
                onChange={_onChangePairType}
                options={uiSettings.availableCryptos}
              />
            </InputSection>
            <InputSection>
              <InputNew
                help={t<string>('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. An optional "///<password>" can be used with a mnemonic seed, and may only be specified once.')}
                isError={!!deriveValidation?.error}
                label={t<string>('secret derivation path')}
                onChange={_onChangeDerive}
                onEnter={_onCommit}
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
                <article className='error'>{errorIndex[deriveValidation.error] || deriveValidation.error}</article>
              )}
              {deriveValidation?.warning && (
                <article className='warning'>{errorIndex[deriveValidation.warning]}</article>
              )}
            </InputSection>
          </Expander>
          <Checkbox
            label={<>{t<string>('I have saved my mnemonic seed safely')}</>}
            onChange={_toggleMnemonicSaved}
            value={isMnemonicSaved}
          />
        </>}
        {step === 2 && <>
          <InputSection>
            <InputNew
              autoFocus
              help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
              isError={!!name && !isNameValid}
              label={t<string>('A descriptive name for your account')}
              onChange={_onChangeName}
              placeholder={t<string>('Account Name')}
              value={name}
            />
          </InputSection>
          <InputSection>
            <NewPasswordInput
              onChange={_onPasswordChange}
              onEnter={_onCommit}
              password={password}
            />
          </InputSection>
          <ExternalWarning />
        </>}
        {step === 3 && address && <CreateConfirmation
          derivePath={derivePath}
          isBusy={isBusy}
          pairType={pairType}
          seed={seed}
        />}
      </Modal.Content>

      {step === 1 &&
      <div className='ui--Modal-Footer'>
        <Button
          isDisabled={!isMnemonicSaved}
          isSelected={true}
          label={t<string>('Next step')}
          onClick={_nextStep}
        />
      </div> }

      {step === 2 &&
      <div className='ui--Modal-Footer'>
        <BackButton className='ui--Modal-back-button'
          onClick={_previousStep}/>
        <Button
          isDisabled={!isMnemonicSaved}
          isSelected={true}
          label={t<string>('Next step')}
          onClick={_nextStep}
        />
      </div>
      }

      {step === 3 &&
      <div className='ui--Modal-Footer'>
        <BackButton className='ui--Modal-back-button'
          onClick={_previousStep}/>
        <Button
          icon='plus'
          isBusy={isBusy}
          isSelected={true}
          label={t<string>('Create an account')}
          onClick={_onCommit}
        />
      </div>
      }
    </Modal>
  );
}

export default styled(Create)`
  & * {
    font-family: 'Nunito Sans', sans-serif;
  }

  &.ui.modal > .header:not(.ui) {
    font-family: 'Nunito Sans', sans-serif;
    text-transform: initial;
  }

  &.ui--Modal-Wrapper.medium {
    width: 655px;
  }
  &&.ui--Modal-Wrapper {
    border-radius: 0;
    background: #FAFAFA;

    .ui--Button:not(.hasLabel) {
      position: absolute;
      top: 15px;
      right: 15px;

      svg {
        background: none;
        color: #000;
      }
    }
    .ui--Warning {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.7rem 0.9rem 0.6rem;
      margin: 0 0 16px;
      background: rgba(232, 111, 0, 0.08);
      border: 0;
      border-radius: 4px;
      font-weight: 800;
      font-size: 10px;
      line-height: 14px;
      color: #E86F00;
      text-transform: uppercase;

      svg {
        margin-right: 12px;
      }
    }
    .ui--Buttons-row {
      display: flex;
      align-items: center;
      margin: 0.45rem 0 1.1rem;

      button + button {
        margin-left: 24px;
      }
    }
    .ui--Print-btn {
      padding: 0;
      background: none;
      border: none;
      font-size: 14px;
      line-height: 22px;
      text-decoration: underline;
      color: #4D4D4D;
      cursor: pointer;

      svg {
        margin-right: 12px;
      }
    }
    .accounts--Creator-advanced {
      margin: 1rem 0;
    }
  }
  &&.ui--Modal-Wrapper > div.header {
    padding: 1.5rem 2.60rem 0 1.75rem;
    font-size: 1.45rem;
    line-height: 1.75rem;
    color: #000000;
  }
  .ui--Modal-Footer {
    display: flex;
    justify-content: flex-end;
    padding: 1.1rem 1.7rem;
    background: #ECECEC;
    border-top: 1px solid #DFDFDF;

  }
  .ui--Modal-Footer .ui--Modal-back-button {
    margin-right: auto;
  }
`;
