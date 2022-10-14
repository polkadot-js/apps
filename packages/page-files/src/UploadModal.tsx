// Copyright 2017-2022 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer } from '@polkadot/api/types';

import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { createAuthIpfsEndpoints } from '@polkadot/apps-config';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Available, Button, Dropdown, InputAddress, Label, MarkError, Modal, Password } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';
import { isFunction, nextTick, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';

import Progress from './Progress';
import { useTranslation } from './translate';
import { DirFile, FileInfo, SaveFile, UploadRes } from './types';

export interface Props {
  className?: string;
  file: FileInfo,
  onClose?: () => void,
  onSuccess?: (res: SaveFile) => void,
}

function ShowFile (p: { file: DirFile | File }) {
  const f = p.file as DirFile;

  return (
    <div className='file'>
      <Label label={f.webkitRelativePath || p.file.name} />
      <span>{`${f.size} bytes`}</span>
    </div>
  );
}

interface AccountState {
  isExternal: boolean;
  isHardware: boolean;
  isInjected: boolean;
}

interface SignerState {
  isUsable: boolean;
  signer: Signer | null;
}

const NOOP = (): void => undefined;

function UploadModal ({ className, file, onClose = NOOP, onSuccess = NOOP }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const endpoints = useMemo(
    () => createAuthIpfsEndpoints(t)
      .sort(() => Math.random() > 0.5 ? -1 : 1)
      .map((item) => ({ ...item, text: `${item.text ?? ''}(${item.location ?? ''})` })),
    [t]
  );
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoints[0]);
  const pinEndpoints = useMemo(() => [
    {
      text: t<string>('Crust Pinner'),
      value: 'https://pin.crustcode.com'
    }
  ], [t]);
  const [currentPinEndpoint, setCurrentPinEndpoint] = useState(pinEndpoints[0]);
  const [currentPair, setCurrentPair] = useState(() => keyring.getPairs()[0] || null);
  const [account, setAccount] = useState('');
  const [{ isInjected }, setAccountState] = useState<AccountState>({
    isExternal: false,
    isHardware: false,
    isInjected: false
  });
  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState<SignerState>({ isUsable: true, signer: null });
  const [password, setPassword] = useState('');
  const [isBusy, setBusy] = useState(false);
  const fileSizeError = useMemo(() => {
    const MAX = 100 * 1024 * 1024;

    if (file.file) {
      return file.file.size > MAX;
    } else if (file.files) {
      let sum = 0;

      for (const f of file.files) {
        sum += f.size;
      }

      return sum > MAX;
    }

    return false;
  }, [file]);
  const [error, setError] = useState('');
  const errorText = fileSizeError ? t<string>('Do not upload files larger than 100MB!') : error;
  const [upState, setUpState] = useState({ progress: 0, up: false });
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);

  const onAccountChange = useCallback((nAccount: string | null) => {
    if (nAccount) {
      setAccount(nAccount);
      setCurrentPair(keyring.getPair(nAccount));
    }
  }, [setAccount, setCurrentPair]);

  useEffect(() => {
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
    setSigner({ isUsable, signer: null });

    // for injected, retrieve the signer
    if (meta.source && isInjected) {
      web3FromSource(meta.source as string)
        .catch(() => null)
        .then((injected) => setSigner({
          isUsable: isFunction(injected?.signer?.signRaw),
          signer: injected?.signer || null
        }))
        .catch(console.error);
    }
  }, [currentPair]);

  const unLock = useCallback(() => {
    return new Promise((resolve, reject) => {
      nextTick((): void => {
        try {
          currentPair.decodePkcs8(password);
          resolve(1);
        } catch (error) {
          reject(error);
        }
      });
    });
  }, [currentPair, password]);

  const _onClose = useCallback(() => {
    if (cancelUp) {
      cancelUp.cancel();
    }

    onClose();
  }, [cancelUp, onClose]);

  const _onClickUp = useCallback(async () => {
    setError('');

    if (!isUsable || !currentPair) {
      return;
    }

    try {
      // 1: sign
      setBusy(true);

      if (isLocked) {
        await unLock();
      }

      let signature = '';

      if (signer && isFunction(signer.signRaw)) {
        const res = await signer.signRaw({
          address: currentPair.address,
          data: stringToHex(currentPair.address),
          type: 'bytes'
        });

        signature = res.signature;
      } else {
        signature = u8aToHex(currentPair.sign(stringToU8a(currentPair.address)));
      }

      const perSignData = `${currentPair.address}:${signature}`;
      const base64Signature = Buffer.from(perSignData).toString('base64');
      const AuthBasic = `Basic ${base64Signature}`;
      const AuthBearer = `Bearer ${base64Signature}`;
      const cancel = axios.CancelToken.source();

      setCancelUp(cancel);
      setUpState({ progress: 0, up: true });

      const form = new FormData();

      if (file.file) {
        form.append('file', file.file, file.file.name);
      } else if (file.files) {
        for (const f of file.files) {
          form.append('file', f, f.webkitRelativePath);
        }
      }

      const UpEndpoint = currentEndpoint.value;
      const upResult = await axios.request<UploadRes | string>({
        cancelToken: cancel.token,
        data: form,
        headers: { Authorization: AuthBasic },
        maxContentLength: 100 * 1024 * 1024,
        method: 'POST',
        onUploadProgress: (p: { loaded: number, total: number }) => {
          const percent = p.loaded / p.total;

          setUpState({ progress: Math.round(percent * 99), up: true });
        },
        params: { pin: true },
        url: `${UpEndpoint}/api/v0/add`
      });

      let upRes: UploadRes;

      if (typeof upResult.data === 'string') {
        const jsonStr = upResult.data.replaceAll('}\n{', '},{');
        const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
        const folder = items.length - 1;

        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }

      console.info('upResult:', upResult);
      setCancelUp(null);
      setUpState({ progress: 100, up: false });
      // remote pin order
      const PinEndpoint = currentPinEndpoint.value;

      await axios.request({
        data: {
          cid: upRes.Hash,
          name: upRes.Name
        },
        headers: { Authorization: AuthBearer },
        method: 'POST',
        url: `${PinEndpoint}/psa/pins`
      });
      onSuccess({
        ...upRes,
        PinEndpoint,
        UpEndpoint
      });
    } catch (e) {
      setUpState({ progress: 0, up: false });
      setBusy(false);
      console.error(e);
      setError((e as Error).message);
    }
  }, [file, unLock, signer, isLocked, isUsable, currentPair, currentPinEndpoint, currentEndpoint, onSuccess]);

  const _onChangeGateway = useCallback((value: string) => {
    const find = endpoints.find((item) => item.value === value);

    if (find) {
      setCurrentEndpoint(find);
    }
  }, [endpoints, setCurrentEndpoint]);

  const _onChangePinner = useCallback((value: string) => {
    const find = pinEndpoints.find((item) => item.value === value);

    if (find) {
      setCurrentPinEndpoint(find);
    }
  }, [pinEndpoints, setCurrentPinEndpoint]);

  return (
    <Modal
      className={className}
      header={t<string>('Upload File')}
      onClose={_onClose}
      open={true}
      size={'medium'}
    >
      <Modal.Content>
        <Modal.Columns>
          <div className='files'>
            {file.file && <ShowFile file={file.file} />}
            {file.files && file.files.map((f, i) =>
              <ShowFile
                file={f}
                key={`file_item:${i}`}
              />
            )}
          </div>
        </Modal.Columns>
        <Modal.Columns>
          <Dropdown
            help={t<string>('File streaming and wallet authentication will be processed by the chosen gateway.')}
            isDisabled={isBusy}
            label={t<string>('Select a Web3 IPFS Gateway')}
            onChange={_onChangeGateway}
            options={endpoints}
            value={currentEndpoint.value}
          />
        </Modal.Columns>
        <Modal.Columns>
          <Dropdown
            help={t<string>('Your file will be pinned to IPFS for long-term storage.')}
            isDisabled={true}
            label={t<string>('Select a Web3 IPFS Pinner')}
            onChange={_onChangePinner}
            options={pinEndpoints}
            value={currentPinEndpoint.value}
          />
        </Modal.Columns>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            isDisabled={isBusy}
            label={t<string>('Please choose account')}
            labelExtra={
              <Available
                label={t<string>('transferrable')}
                params={account}
              />
            }
            onChange={onAccountChange}
            type='account'
          />
          {
            !upState.up && isLocked && !isInjected &&
            <Password
              help={t<string>('The account\'s password specified at the creation of this account.')}
              isError={false}
              label={t<string>('password')}
              onChange={setPassword}
              value={password}
            />
          }
          <Progress
            className='progress'
            progress={upState.progress}
          />
          {errorText && (
            <MarkError content={errorText} />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon={'arrow-circle-up'}
          isBusy={isBusy}
          isDisabled={fileSizeError}
          label={t<string>('Sign and Upload')}
          onClick={_onClickUp}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(UploadModal)`
  .files {
    max-height: 300;
    overflow: auto;
    padding-left: 2rem;
    width: 100%;

    .file {
      background-color: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      padding: 5px 2rem;
    }
  }

  .progress {
    margin-left: 2rem;
    margin-top: 2rem;
    width: calc(100% - 2rem);
  }
`);
