// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '../types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
// import { RouteComponentProps } from 'react-router';
// import { withRouter } from 'react-router-dom';
import { Button, Card, Expander, Forget } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { ABI, CodeRow } from '../shared';
import RemoveABI from '../RemoveABI';
import store from '../store';
import useAbi from '../useAbi';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  code: CodeStored;
  onShowDeploy: (codeHash?: string, constructorIndex?: number) => () => void;
}

// interface State {
//   isAbiOpen: boolean;
//   isForgetOpen: boolean;
//   isRemoveABIOpen: boolean;
// }

// const CodeCard = styled(Card)`
//   && {
//     max-width: 100%;
//     min-width: 100%;
//   }
// `;

function Code ({ className, code, onShowDeploy }: Props): React.ReactElement<Props> {
  const { json: { codeHash } } = code;
  const { t } = useTranslation();
  const [isAbiOpen, toggleIsAbiOpen, setIsAbiOpen] = useToggle();
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();
  const [isRemoveABIOpen, toggleIsRemoveABIOpen] = useToggle();
  const { contractAbi, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code.json.abi || null, code.contractAbi || null], codeHash, true);

  // const _onChangeAbi = useCallback(
  //   (abi: string | null = null): void => {
  //     setIsAbiOpen(true);
  //     contracts.saveCode(
  //       codeHash,
  //       { abi }
  //     );
  //   },
  //   [codeHash, setIsAbiOpen]
  // );

  const _onShowDeploy = useCallback(
    onShowDeploy(codeHash),
    [codeHash]
  );

  const _onDeployConstructor = useCallback(
    (constructorIndex = 0): void => {
      codeHash && onShowDeploy && onShowDeploy(codeHash, constructorIndex)();
    },
    [codeHash, onShowDeploy]
  );

  const _onForget = useCallback(
    (): void => {
      if (!codeHash) {
        return;
      }

      try {
        store.forgetCode(codeHash);
      } catch (error) {
        console.error(error);
      } finally {
        toggleIsForgetOpen();
      }
    },
    [codeHash, toggleIsForgetOpen]
  );

  const abiNode = (
    <ABI
      contractAbi={contractAbi}
      isError={isAbiError}
      isSupplied={isAbiSupplied}
      isValid={isAbiValid}
      onChange={onChangeAbi}
      onRemove={toggleIsRemoveABIOpen}
      onSelectConstructor={_onDeployConstructor}
    />
  );

  return (
    <Card className={className}>
      <CodeRow
        buttons={
          <>
            <Button
              icon='trash'
              isNegative
              onClick={toggleIsForgetOpen}
              size='small'
              tooltip={t('Forget this code hash')}
            />
            <Button
              icon='cloud upload'
              isPrimary
              label={t('deploy')}
              onClick={_onShowDeploy}
              size='small'
              tooltip={t('Deploy this code hash as a smart contract')}
            />
          </>
        }
        code={code}
        withTags
      >
        {contractAbi
          ? (
            <Expander
              isOpen={isAbiOpen}
              onClick={toggleIsAbiOpen}
              summary={t('ABI')}
            >
              {abiNode}
            </Expander>
          )
          : abiNode
        }
      </CodeRow>
      {isForgetOpen && (
        <Forget
          key='modal-forget-account'
          mode='code'
          onClose={toggleIsForgetOpen}
          onForget={_onForget}
        >
          <CodeRow
            code={code || ''}
            isInline
          >
            <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
            <p>{t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
          </CodeRow>
        </Forget>
      )}
      {isRemoveABIOpen && (
        <RemoveABI
          code={code}
          key='modal-remove-abi'
          onClose={toggleIsRemoveABIOpen}
          onRemove={onRemoveAbi}
        />
      )}
    </Card>
  );
}

// class Code2 extends React.PureComponent<Props, State> {
//   public state: State = {
//     isAbiOpen: false,
//     isForgetOpen: false,
//     isRemoveABIOpen: false
//   };

//   public render (): React.ReactNode {
//     const { code, code: { contractAbi }, t } = this.props;
//     const { isAbiOpen } = this.state;

//     const abi = (
//       <ABI
//         contractAbi={contractAbi}
//         onChange={this.onChangeABI}
//         onRemove={this.toggleRemoveABI}
//         onSelectConstructor={this.onDeployConstructor}
//       />
//     );

//     return (
//       <CodeCard>
//         {this.renderModals()}
//         <CodeRow
//           buttons={this.renderButtons()}
//           code={code}
//           withTags
//         >
//           {contractAbi
//             ? (
//               <Expander
//                 isOpen={isAbiOpen}
//                 onClick={this.toggleAbi}
//                 summary={t('ABI')}
//               >
//                 {abi}
//               </Expander>
//             )
//             : abi
//           }
//         </CodeRow>
//       </CodeCard>
//     );
//   }

//   private renderButtons (): React.ReactNode {
//     const { code: { json: { codeHash } }, showDeploy, t } = this.props;

//     return (
//       <>
//         <Button
//           icon='trash'
//           isNegative
//           onClick={this.toggleForget}
//           size='small'
//           tooltip={t('Forget this code hash')}
//         />
//         <Button
//           icon='cloud upload'
//           isPrimary
//           label={t('deploy')}
//           onClick={showDeploy(codeHash)}
//           size='small'
//           tooltip={t('Deploy this code hash as a smart contract')}
//         />
//       </>
//     );
//   }

//   private renderModals (): React.ReactNode {
//     const { code, t } = this.props;
//     const { isForgetOpen, isRemoveABIOpen } = this.state;

//     if (!code) {
//       return null;
//     }

//     const modals = [];

//     if (isForgetOpen) {
//       modals.push(
//         <Forget
//           key='modal-forget-account'
//           mode='code'
//           onClose={this.toggleForget}
//           onForget={this.onForget}
//         >
//           <CodeRow
//             code={code || ''}
//             isInline
//           >
//             <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
//             <p>{t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
//           </CodeRow>
//         </Forget>
//       );
//     }

//     if (isRemoveABIOpen) {
//       modals.push(
//         <RemoveABI
//           code={code}
//           key='modal-remove-abi'
//           onClose={this.toggleRemoveABI}
//           onRemove={this.onChangeABI}
//         />
//       );
//     }

//     return modals;
//   }

//   private toggleAbi = (event: React.MouseEvent): () => void => {
//     return (): void => {
//       event.preventDefault();
//       const { isAbiOpen } = this.state;

//       this.setState({
//         isAbiOpen: !isAbiOpen
//       });
//     };
//   }

//   private toggleForget = (): void => {
//     const { isForgetOpen } = this.state;

//     this.setState({
//       isForgetOpen: !isForgetOpen
//     });
//   }

//   private toggleRemoveABI = (): void => {
//     const { isRemoveABIOpen } = this.state;

//     this.setState({
//       isRemoveABIOpen: !isRemoveABIOpen
//     });
//   }

//   private onDeployConstructor = (constructorIndex = 0): void => {
//     const { code: { json: { codeHash } }, showDeploy } = this.props;

//     codeHash && showDeploy && showDeploy(codeHash, constructorIndex)();
//   }

//   private onForget = (): void => {
//     const { code: { json: { codeHash } } } = this.props;

//     if (!codeHash) {
//       return;
//     }

//     try {
//       contracts.forgetCode(codeHash);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       this.toggleForget();
//     }
//   }

//   private onChangeABI = (abi: string | null = null): void => {
//     const { code: { json: { codeHash } } } = this.props;

//     this.setState(
//       { isAbiOpen: true },
//       (): void => {
//         contracts.saveCode(
//           codeHash,
//           { abi }
//         );
//       }
//     );
//   }
// }

export default styled(Code)`
  max-width: 100%;
  min-width: 100%;
`;
