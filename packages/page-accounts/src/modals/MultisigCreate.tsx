// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { HexString } from '@polkadot/util/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { AddressMini, Button, IconLink, Input, InputAddressMulti, InputFile, InputNumber, Labelled, MarkError, Modal, styled, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { assert, BN, u8aToString } from '@polkadot/util';
import { validateAddress } from '@polkadot/util-crypto';

import useKnownAddresses from '../Accounts/useKnownAddresses.js';
import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  genesisHash?: HexString;
  name: string;
  tags?: string[];
}

interface UploadedFileData {
  isUploadedFileValid: boolean;
  uploadedFileError: string;
  uploadedSignatories: string[];
}

const MAX_SIGNATORIES = 100;
const BN_TWO = new BN(2);

const acceptedFormats = ['application/json'];

function parseFile (file: Uint8Array): UploadedFileData {
  let uploadError = '';
  let items: string[];

  try {
    items = JSON.parse(u8aToString(file)) as string[];
    assert(Array.isArray(items) && !!items.length, 'JSON file should contain an array of signatories');

    items = items.filter((item) => validateAddress(item));
    items = [...new Set(items)]; // remove duplicates

    assert(items.length <= MAX_SIGNATORIES, `Maximum you can have ${MAX_SIGNATORIES} signatories`);
  } catch (error) {
    items = [];
    uploadError = (error as Error).message ? (error as Error).message : (error as Error).toString();
  }

  return {
    isUploadedFileValid: !uploadError,
    uploadedFileError: uploadError,
    uploadedSignatories: items
  };
}

function createMultisig (signatories: string[], threshold: BN | number, { genesisHash, name, tags = [] }: CreateOptions, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const result = keyring.addMultisig(signatories, threshold, { genesisHash, name, tags });
    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;

    console.error(error);
  }

  return status;
}

function Multisig ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();
  const availableSignatories = useKnownAddresses();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isUploadedFileValid, uploadedFileError, uploadedSignatories }, setUploadedFile] = useState<UploadedFileData>({
    isUploadedFileValid: true,
    uploadedFileError: '',
    uploadedSignatories: []
  });
  const [signatories, setSignatories] = useState<string[]>(['']);
  const [showSignaturesUpload, setShowSignaturesUpload] = useState(false);
  const [{ isThresholdValid, threshold }, setThreshold] = useState({ isThresholdValid: true, threshold: BN_TWO });

  const _createMultisig = useCallback(
    (): void => {
      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(), name: name.trim() };
      const status = createMultisig(signatories, threshold, options, t('created multisig'));

      onStatusChange(status);
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, signatories, t, threshold]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: (name.trim().length >= 3), name }),
    []
  );

  const _onChangeThreshold = useCallback(
    (threshold: BN | undefined) =>
      threshold && setThreshold({ isThresholdValid: threshold.gte(BN_TWO) && threshold.lten(signatories.length), threshold }),
    [signatories]
  );

  const _onChangeFile = useCallback(
    (file: Uint8Array) => {
      const fileData = parseFile(file);

      setUploadedFile(fileData);

      if (fileData.isUploadedFileValid || uploadedSignatories.length) {
        setSignatories(fileData.uploadedSignatories.length ? fileData.uploadedSignatories : ['']);
      }
    },
    [uploadedSignatories]
  );

  const resetFileUpload = useCallback(
    () => {
      setUploadedFile({
        isUploadedFileValid,
        uploadedFileError,
        uploadedSignatories: []
      });
    },
    [uploadedFileError, isUploadedFileValid]
  );

  const _onChangeAddressMulti = useCallback(
    (items: string[]) => {
      resetFileUpload();
      setSignatories(items);
    },
    [resetFileUpload]
  );

  const isValid = isNameValid && isThresholdValid;

  return (
    <StyledModal
      className={className}
      header={t('Add multisig')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Toggle
            className='signaturesFileToggle'
            label={t('Upload JSON file with signatories')}
            onChange={setShowSignaturesUpload}
            value={showSignaturesUpload}
          />
        </Modal.Columns>
        {!showSignaturesUpload && (
          <Modal.Columns
            hint={
              <>
                <p>{t('The signatories has the ability to create transactions using the multisig and approve transactions sent by others.Once the threshold is reached with approvals, the multisig transaction is enacted on-chain.')}</p>
                <p>{t('Since the multisig function like any other account, once created it is available for selection anywhere accounts are used and needs to be funded before use.')}</p>
              </>
            }
          >
            <InputAddressMulti
              available={availableSignatories}
              availableLabel={t('available signatories')}
              maxCount={MAX_SIGNATORIES}
              onChange={_onChangeAddressMulti}
              valueLabel={t('selected signatories')}
            />
          </Modal.Columns>
        )}
        {showSignaturesUpload && (
          <Modal.Columns hint={t('Supply a JSON file with the list of signatories.')}>
            <InputFile
              accept={acceptedFormats}
              className='full'
              clearContent={!uploadedSignatories.length && isUploadedFileValid}
              isError={!isUploadedFileValid}
              label={t('upload signatories list')}
              onChange={_onChangeFile}
              withLabel
            />
            {!!uploadedSignatories.length && (
              <Labelled
                label={t('found signatories')}
                labelExtra={(
                  <IconLink
                    icon='sync'
                    label={t('Reset')}
                    onClick={resetFileUpload}
                  />
                )}
              >
                <div className='ui--Static ui dropdown selection'>
                  {uploadedSignatories.map((address): React.ReactNode => (
                    <div key={address}>
                      <AddressMini
                        value={address}
                        withSidebar={false}
                      />
                    </div>
                  ))}
                </div>
              </Labelled>
            )}
            {uploadedFileError && (
              <MarkError content={uploadedFileError} />
            )}
          </Modal.Columns>
        )}
        <Modal.Columns hint={t('The threshold for approval should be less or equal to the number of signatories for this multisig.')}>
          <InputNumber
            isError={!isThresholdValid}
            label={t('threshold')}
            onChange={_onChangeThreshold}
            value={threshold}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The name is for unique identification of the account in your owner lists.')}>
          <Input
            autoFocus
            className='full'
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            placeholder={t('multisig name')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='plus'
          isDisabled={!isValid}
          label={t('Create')}
          onClick={_createMultisig}
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .signaturesFileToggle {
    width: 100%;
    text-align: right;
  }
`;

export default React.memo(Multisig);
