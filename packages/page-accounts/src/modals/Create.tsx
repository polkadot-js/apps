// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import NewPasswordInput from '@polkadot/app-accounts/modals/PasswordInputNew';
import CreateConfirmation from '@polkadot/app-accounts/modals/CreateConfirmation';
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
  Modal,
  Toggle } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import TextAreaWithLabel from '@polkadot/react-components/TextAreaWithLabel';
import InfoBox from '@polkadot/app-accounts/modals/InfoBox';
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
  const isFirstStepValid = !!address && isMnemonicSaved && !deriveValidation?.error && isSeedValid;
  const isSecondStepValid = isNameValid && isPasswordValid;
  const isValid = isFirstStepValid && isSecondStepValid;
  const errorIndex: Record<string, string> = useMemo(() => ({
    PASSWORD_IGNORED: t<string>('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t<string>('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t<string>('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  }), [t]);
  const [areHintsVisible, setAreHintsVisible] = useState(false);

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
      className={`${className} ui--CreateAccount-new-create-modal ui--Modal-Wrapper ${!areHintsVisible ? 'medium' : 'mediumWithHints'}`}
      header={t<string>('Add an account via seed {{step}}/{{NUM_STEPS}}', {
        replace: {
          NUM_STEPS,
          step
        }
      })}
      size='large'
    >
      <Toggle
        label='Hints'
        onChange={setAreHintsVisible}
        value={areHintsVisible}
      />
      <Button
        icon='times'
        onClick={onClose}
      />
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <AddressRow
              className='ui--AddressRow-new-create-modal'
              defaultName={name}
              isEditableName={false}
              noDefaultNameOpacity
              value={isSeedValid ? address : ''}
            />
          </Modal.Column>
        </Modal.Columns>
        {step === 1 && <>
          <Modal.Columns>
            <Modal.Column>
              <InfoBox
                icon='exclamation-triangle'
                type='alert'
                upperCase
                value={t<string>("Please write down your wallet's mnemonic seed and keep it in a safe place")}
              /></Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <TextAreaWithLabel
                className='ui--TextArea-lineHeight'
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
            </Modal.Column>
            <Modal.Column>
              <p className='ui--Hint'>{t<string>('The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.')}</p>
            </Modal.Column>
          </Modal.Columns>
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
          <Modal.Columns>
            <Modal.Column>
              <InfoBox
                icon='exclamation-triangle'
                type='alert'
                value={t<string>('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security. Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.')}
              />
            </Modal.Column>
          </Modal.Columns>
          <Expander
            className='accounts--Creator-advanced'
            iconPlacement='left'
            isOpen={false}
            summary={t<string>('Advanced creation options')}
          >
            <Modal.Columns>
              <Modal.Column>
                <InputSection>
                  <DropdownNew
                    defaultValue={pairType}
                    help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
                    label={t<string>('keypair crypto type')}
                    onChange={_onChangePairType}
                    options={uiSettings.availableCryptos}
                  />
                </InputSection>
              </Modal.Column>
              <Modal.Column>
                <p className='ui--Hint'>{t<string>('If you are moving accounts between applications, ensure that you use the correct type.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
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
                    <InfoBox
                      icon='exclamation-triangle'
                      type='error'
                      value={errorIndex[deriveValidation.error] || deriveValidation.error}
                    />
                  )}
                  {deriveValidation?.warning && (
                    <InfoBox
                      icon='exclamation-triangle'
                      type='alert'
                      value={errorIndex[deriveValidation.warning]}
                    />
                  )}
                </InputSection>
              </Modal.Column>
              <Modal.Column>
                <p className='ui--Hint'>{t<string>('The derivation path allows you to create different accounts from the same base mnemonic.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Expander>
          <Checkbox
            label={<>{t<string>('I have saved my mnemonic seed safely')}</>}
            onChange={_toggleMnemonicSaved}
            value={isMnemonicSaved}
          />
        </>}
        {step === 2 && <>
          <Modal.Columns>
            <Modal.Column>
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
            </Modal.Column>
            <Modal.Column>
              <p className='ui--Hint'>{t<string>('The name for this account and how it will appear under your addresses. With an on-chain identity, it can be made available to others.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <InputSection>
                <NewPasswordInput
                  onChange={_onPasswordChange}
                  onEnter={_onCommit}
                  password={password}
                />
              </InputSection>
            </Modal.Column>
            <Modal.Column>
              <p className='ui--Hint'>{t<string>('The password and password confirmation for this account. This is required to authenticate any transactions made and to encrypt the keypair. Ensure you are using a strong password for proper account protection.')}</p>
            </Modal.Column>
          </Modal.Columns>
        </>}
        {step === 3 && address && <CreateConfirmation
          derivePath={derivePath}
          isBusy={isBusy}
          modalNew
          pairType={pairType}
          seed={seed}
        />}
      </Modal.Content>

      {step === 1 &&
      <div className='ui--Modal-Footer'>
        <Button
          className='ui--Icon-right'
          icon='arrow-right'
          iconPlacement='right'
          isDisabled={!isFirstStepValid}
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
          className='ui--Icon-right'
          icon='arrow-right'
          iconPlacement='right'
          isDisabled={!isSecondStepValid}
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

const ICON_PADDING = 0.5;

export default styled(Create)`
  & * {
    font-family: 'Nunito Sans', sans-serif;
  }

  &.ui.modal > .header:not(.ui) {
    font-family: 'Nunito Sans', sans-serif;
    text-transform: initial;
  }
  &.ui.modal > .ui--Toggle {
    position: absolute;
    top: 1.72rem;
    right: 5rem;
  }
  &.ui--Modal-Wrapper.medium {
    width: 655px;
    .ui--Modal-Column {
      &:nth-child(1) {
        flex: 100%;
        max-width: 100%;
      }
    
      &:nth-child(2) {
        display: none;
        flex: 0%;
      }
    }
  }
  &.ui--Modal-Wrapper.mediumWithHints {
    width: 1031px;
    .ui--Modal-Column {
      &:nth-child(1) {
        flex: 65%;
        max-width: 65%;
      }
    
      &:nth-child(2) {
        display: flex;
        flex: 35%;
      }
    }
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
  .ui--Hint {
    background: #ECECEC;
    border-radius: 4px;
    padding: 8px 8px;
    margin-left: 8px;
  }
  .ui--Modal-Footer {
    display: flex;
    justify-content: flex-end;
    padding: 1.1rem 1.7rem;
    background: #ECECEC;
    border-top: 1px solid #DFDFDF; 
  }
  .ui--Modal-Footer > .ui--Button.ui--Icon-right.hasLabel {
    padding: 0.65rem ${1.1 - ICON_PADDING}rem 0.65rem 1.1rem;
  }

  .ui--Modal-Footer > .ui--Button.ui--Icon-right.hasLabel  > .ui--Icon {
    margin-left: 0.425rem !important;
    margin-right: 0 !important;
  }

  .ui--Modal-Footer .ui--Modal-back-button {
    margin-right: auto;
  }

  .ui--TextArea-lineHeight > div > div > textarea {
    line-height: 1.6rem;
    padding: 0.6rem 1.15rem 0.6rem 1.15rem;
  }

   .ui--TextArea-lineHeight .ui--Labelled-content .TextAreaWithDropdown .dropdown.icon {
    top: 2.3rem!important;
  }

  .ui--Flex-column {
    flex-direction: column;
  }
`;
