// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import store from '@polkadot/apps/store';
import { InputABI, InputAddress, InputFile, InputName, TxButton } from '@polkadot/react-components';
import { useAccountId, useAbi, useApi, useNonEmptyString } from '@polkadot/react-hooks';
import { compactAddLength, isNull } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
}

function Upload ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, isNameValid, setName] = useNonEmptyString();
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const isSubmittable = useMemo(
    (): boolean => !!accountId && (!isNull(name) && isNameValid) && isWasmValid && (!isAbiSupplied || isAbiValid),
    [accountId, name, isAbiSupplied, isAbiValid, isNameValid, isWasmValid]
  );

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([compactAddLength(wasm), wasm.subarray(0, 4).toString() === '0,97,115,109']);
      setName(name);
    },
    [setName]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';
      const record = result.findRecord(section, 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi, name, tags: [] })
          .then()
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }
    },
    [api, abi, name]
  );

  return (
    <>
      <header>
        <h1>{t<string>('Upload WASM Code Blob')}</h1>
        <div className='instructions'>
          {t<string>('You can upload an existing Wasm blob here. Already have a blob on chain? ')}
          <Link to={`${basePath}/add`}>
            {t<string>('Add an existing code hash.')}
          </Link>
        </div>
      </header>
      <InputAddress
        help={t('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
        isInput={false}
        label={t('Account')}
        onChange={setAccountId}
        type='account'
        value={accountId}
      />
      <InputName
        isError={!isNameValid}
        onChange={setName}
        value={name || undefined}
      />
      <InputFile
        help={t<string>('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
        isError={!isWasmValid}
        label={t<string>('Upload Wasm Blob')}
        onChange={_onAddWasm}
        placeholder={
          wasm && !isWasmValid
            ? t<string>('The code is not recognized as being in valid WASM format')
            : null
        }
      />
      <InputABI
        contractAbi={contractAbi}
        errorText={errorText}
        isError={isAbiError}
        isSupplied={isAbiSupplied}
        isValid={isAbiValid}
        onChange={onChangeAbi}
        onRemove={onRemoveAbi}
        withLabel
      />
      <TxButton
        accountId={accountId}
        isDisabled={!isSubmittable}
        label={t('Upload')}
        onSuccess={_onSuccess}
        params={[wasm]}
        tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
      />
    </>
  );
}

// function ContractsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
//   const { t } = useTranslation();
//   const { allAccounts } = useAccounts();
//   const { allContracts } = useContracts();
//   const [codeHash, setCodeHash] = useState<string | undefined>();
//   const [constructorIndex, setConstructorIndex] = useState(0);
//   const [isDeployOpen, toggleIsDeployOpen, setIsDeployOpen] = useToggle();
//   const [updated, setUpdated] = useState(0);

//   const [allCodes, setAllCodes] = useState(store.getAllCode());

//   const _triggerUpdate = useCallback(
//     (): void => {
//       setUpdated(Date.now());
//       setAllCodes(store.getAllCode());
//     },
//     []
//   );

//   const _onShowDeploy = useCallback(
//     (codeHash?: string, constructorIndex = 0): () => void =>
//       (): void => {
//         setCodeHash(codeHash || (allCodes && allCodes[0] ? allCodes[0].json.codeHash : undefined));
//         setConstructorIndex(constructorIndex);
//         toggleIsDeployOpen();
//       },
//     [allCodes, toggleIsDeployOpen]
//   );

//   const componentProps = useMemo(
//     (): ComponentProps => ({
//       accounts: allAccounts,
//       basePath,
//       contracts: allContracts,
//       hasCode: store.hasCode,
//       onShowDeploy: _onShowDeploy,
//       onStatusChange,
//       updated
//     }),
//     [allAccounts, allContracts, basePath, _onShowDeploy, onStatusChange, updated]
//   );

//   useEffect(
//     (): void => {
//       store.on('new-code', _triggerUpdate);
//       store.on('removed-code', _triggerUpdate);

//       store.loadAll()
//         .then((): void => setAllCodes(store.getAllCode()))
//         .catch((): void => {
//           // noop, handled internally
//         });
//     },
//     [_triggerUpdate]
//   );

//   const hidden: string[] = [];

//   const _onCloseDeploy = (): void => setIsDeployOpen(false);

//   return (
//     <main className='contracts--App'>
//       <HelpOverlay md={introMd as string} />
//       <header>
//         <Tabs
//           basePath={basePath}
//           hidden={hidden}
//           items={[
//             {
//               name: 'code',
//               text: 'Code'
//             },
//             {
//               isRoot: true,
//               name: 'contracts',
//               text: 'Contracts'
//             }
//           ].map((tab): TabItem => ({ ...tab, text: t(tab.text) }))
//           }
//         />
//       </header>
//       <Switch>
//         <Route path={`${basePath}/code`}>
//           <Codes {...componentProps} />
//         </Route>
//         <Route exact>
//           <Contracts {...componentProps} />
//         </Route>
//       </Switch>
//       {codeHash && (
//         <Deploy
//           allCodes={allCodes}
//           basePath={basePath}
//           codeHash={codeHash}
//           constructorIndex={constructorIndex}
//           isOpen={isDeployOpen}
//           onClose={_onCloseDeploy}
//           setCodeHash={setCodeHash}
//           setConstructorIndex={setConstructorIndex}
//         />
//       )}
//     </main>
//   );
// }

export default React.memo(Upload);
