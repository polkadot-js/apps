// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import store from '@polkadot/apps/store';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { ABI, Button, Input, InputName } from '@polkadot/react-components';
import { useAbi } from '@polkadot/react-hooks';
import { isNull } from '@polkadot/util';

import ValidateCode from './ValidateCode';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
}

function Add ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [codeHash, setCodeHash] = useState('');
  const [isCodeHashValid, setIsCodeHashValid] = useState(false);
  const [name, setName] = useState<StringOrNull>(null);
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const isNameValid = useMemo(
    (): boolean => !isNull(name) && name.length > 0,
    [name]
  );

  const isValid = useMemo(
    (): boolean => isCodeHashValid && isNameValid,
    [isCodeHashValid, isNameValid]
  );

  const _onSave = useCallback(
    (): void => {
      if (!codeHash || !name) {
        return;
      }

      store
        .saveCode(createType(registry, 'Hash', codeHash), { abi, name, tags: [] })
        .catch((error): void => {
          console.error('Unable to save code', error);
        });
    },
    [abi, codeHash, name]
  );

  return (
    <>
      <header>
        <h1>{t<string>('Add Existing Code Hash')}</h1>
        <div className='instructions'>
          {t<string>('You can add a previously uploaded WASM blob here.')}
          <Link to={basePath}>
            {t<string>('Upload a new code hash.')}
          </Link>
        </div>
      </header>
      <Input
        autoFocus
        help={t('The code hash for the on-chain deployed code.')}
        isError={codeHash.length > 0 && !isCodeHashValid}
        label={t('code hash')}
        onChange={setCodeHash}
        value={codeHash}
      />
      <ValidateCode
        codeHash={codeHash}
        onChange={setIsCodeHashValid}
      />
      <InputName
        isError={!isNameValid}
        onChange={setName}
        value={name || undefined}
      />
      <ABI
        contractAbi={contractAbi}
        errorText={errorText}
        isError={isAbiError}
        isSupplied={isAbiSupplied}
        isValid={isAbiValid}
        onChange={onChangeAbi}
        onRemove={onRemoveAbi}
        withLabel
      />
      <Button.Group>
        <Button
          icon='save'
          isDisabled={!isValid}
          isPrimary
          label={t('Save')}
          onClick={_onSave}
        />
      </Button.Group>
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

export default React.memo(Add);
