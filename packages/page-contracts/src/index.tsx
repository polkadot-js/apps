// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/react-components/types';
import { TabItem } from '@polkadot/react-components/Tabs';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useContracts, useToggle } from '@polkadot/react-hooks';

import introMd from './md/intro.md';
import store from './store';
import Contracts from './Contracts';
import Codes from './Codes';
import Deploy from './Deploy';
import { useTranslation } from './translate';

interface Props extends AppProps, RouteComponentProps {}

function ContractsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { allContracts, hasContracts } = useContracts();
  const [codeHash, setCodeHash] = useState<string | undefined>();
  const [constructorIndex, setConstructorIndex] = useState(0);
  const [isDeployOpen, toggleIsDeployOpen] = useToggle();
  const [updated, setUpdated] = useState(0);

  const [allCodes, setAllCodes] = useState(store.getAllCode());

  const _triggerUpdate = useCallback(
    (): void => {
      setUpdated(Date.now());
      setAllCodes(store.getAllCode());
    },
    []
  );

  const _onShowDeploy = useCallback(
    (codeHash: string, constructorIndex = 0): () => void =>
      (): void => {
        setCodeHash(codeHash || (allCodes && allCodes[0] ? allCodes[0].json.codeHash : undefined));
        setConstructorIndex(constructorIndex);
        toggleIsDeployOpen();
      },
    [allCodes, toggleIsDeployOpen]
  );

  const componentProps = useMemo(
    (): any => ({
      accounts: allAccounts,
      basePath,
      contracts: allContracts,
      hasCode: store.hasCode,
      onShowDeploy: _onShowDeploy,
      onStatusChange,
      updated
    }),
    [allAccounts, allContracts, basePath, _onShowDeploy, onStatusChange, updated]
  );

  useEffect(
    (): void => {
      store.on('new-code', _triggerUpdate);
      store.on('removed-code', _triggerUpdate);

      store.loadAll()
        .then((): void => setAllCodes(store.getAllCode()))
        .catch((): void => {
          // noop, handled internally
        });
    },
    [_triggerUpdate]
  );

  const hidden: string[] = [];

  console.log(componentProps);

  return (
    <main className='contracts--App'>
      <HelpOverlay md={introMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={[
            {
              name: 'code',
              text: 'Code'
            },
            {
              isRoot: true,
              name: 'contracts',
              text: 'Contracts'
            }
          ].map((tab): TabItem => ({ ...tab, text: t(tab.text) }))
          }
        />
      </header>
      <Switch>
        <Route path={`${basePath}/code`}>
          <Codes {...componentProps} />
        </Route>
        <Route exact>
          <Contracts {...componentProps} />
        </Route>
      </Switch>
      {codeHash && (
        <Deploy
          allCodes={allCodes}
          basePath={basePath}
          codeHash={codeHash}
          constructorIndex={constructorIndex}
          isOpen={isDeployOpen}
          onClose={toggleIsDeployOpen}
          setCodeHash={setCodeHash}
          setConstructorIndex={setConstructorIndex}
        />
      )}
    </main>
  );
}

// class ContractsApp2 extends React.PureComponent<Props, State> {
//   public state: State = {
//     constructorIndex: 0,
//     hasContracts: false,
//     isDeployOpen: false,
//     updated: 0
//   };

//   constructor (props: Props) {
//     super(props);

//     store.on('new-code', this.triggerUpdate);
//     store.on('removed-code', this.triggerUpdate);

//     // since we have a dep on the async API, we load here
//     store.loadAll().catch((): void => {
//       // noop, handled internally
//     });
//   }

//   public static getDerivedStateFromProps ({ contracts }: Props): Pick<State, never> {
//     const hasContracts = !!contracts && Object.keys(contracts).length >= 1;

//     return {
//       hasContracts
//     };
//   }

//   public render (): React.ReactNode {
//     const { basePath, t } = this.props;
//     const { codeHash, constructorIndex, isDeployOpen } = this.state;
//     const hidden: string[] = [];

//     return (
//       <main className='contracts--App'>
//         <HelpOverlay md={introMd} />
//         <header>
//           <Tabs
//             basePath={basePath}
//             hidden={hidden}
//             items={[
//               {
//                 name: 'code',
//                 text: 'Code'
//               },
//               {
//                 isRoot: true,
//                 name: 'contracts',
//                 text: 'Contracts'
//               }
//             ].map((tab): TabItem => ({ ...tab, text: t(tab.text) }))
//             }
//           />
//         </header>
//         <Switch>
//           <Route
//             path={`${basePath}/code`}
//             render={this.renderComponent(Codes)}
//           />
//           <Route
//             exact
//             render={this.renderComponent(Contracts)}
//           />
//         </Switch>
//         <Deploy
//           basePath={basePath}
//           codeHash={codeHash}
//           constructorIndex={constructorIndex}
//           isOpen={isDeployOpen}
//           onClose={this.hideDeploy}
//         />
//       </main>
//     );
//   }

//   private renderComponent (Component: React.ComponentType<ComponentProps>): () => React.ReactNode {
//     return (): React.ReactNode => {
//       const { accounts, basePath, contracts, onStatusChange } = this.props;
//       const { updated } = this.state;

//       if (!contracts) {
//         return null;
//       }

//       return (
//         <Component
//           accounts={accounts}
//           basePath={basePath}
//           contracts={contracts}
//           hasCode={store.hasCode}
//           onStatusChange={onStatusChange}
//           showDeploy={this.showDeploy}
//           updated={updated}
//         />
//       );
//     };
//   }

//   private showDeploy = (codeHash?: string, constructorIndex = 0): () => void =>
//     (): void => {
//       this.setState({
//         codeHash: codeHash || undefined,
//         constructorIndex,
//         isDeployOpen: true
//       });
//     }

//   private hideDeploy = (): void => {
//     this.setState({ isDeployOpen: false });
//   }

//   private triggerUpdate = (): void => {
//     this.setState({ updated: Date.now() });
//   }
// }

export default React.memo(ContractsApp);
