// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { CodeStored } from '../types';

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button, Card, Expander, Forget } from '@polkadot/react-components';

import ABI from '../ABI';
import CodeRow from '../CodeRow';
import RemoveABI from '../RemoveABI';
import contracts from '../store';
import translate from '../translate';

interface Props extends I18nProps, RouteComponentProps<{}> {
  code: CodeStored;
  showDeploy: (codeHash?: string, constructorIndex?: number) => () => void;
}

interface State {
  isAbiOpen: boolean;
  isForgetOpen: boolean;
  isRemoveABIOpen: boolean;
}

const CodeCard = styled(Card)`
  && {
    max-width: 100%;
    min-width: 100%;
  }
`;

class Code extends React.PureComponent<Props, State> {
  public state: State = {
    isAbiOpen: false,
    isForgetOpen: false,
    isRemoveABIOpen: false
  };

  public render (): React.ReactNode {
    const { code, code: { contractAbi }, t } = this.props;
    const { isAbiOpen } = this.state;

    const abi = (
      <ABI
        contractAbi={contractAbi}
        onChange={this.onChangeABI}
        onRemove={this.toggleRemoveABI}
        onSelectConstructor={this.onDeployConstructor}
      />
    );

    return (
      <CodeCard>
        {this.renderModals()}
        <CodeRow
          buttons={this.renderButtons()}
          code={code}
          isEditable
          withTags
        >
          {contractAbi
            ? (
              <Expander
                isOpen={isAbiOpen}
                onClick={this.toggleAbi}
                summary={t('ABI')}
              >
                {abi}
              </Expander>
            )
            : abi
          }
        </CodeRow>
      </CodeCard>
    );
  }

  private renderButtons (): React.ReactNode {
    const { code: { json: { codeHash } }, showDeploy, t } = this.props;

    return (
      <>
        <Button
          icon='trash'
          isNegative
          onClick={this.toggleForget}
          size='small'
          tooltip={t('Forget this code hash')}
        />
        <Button
          icon='cloud upload'
          isPrimary
          label={t('deploy')}
          onClick={showDeploy(codeHash)}
          size='small'
          tooltip={t('Deploy this code hash as a smart contract')}
        />
      </>
    );
  }

  private renderModals (): React.ReactNode {
    const { code, t } = this.props;
    const { isForgetOpen, isRemoveABIOpen } = this.state;

    if (!code) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forget
          key='modal-forget-account'
          mode='code'
          onClose={this.toggleForget}
          onForget={this.onForget}
        >
          <CodeRow
            code={code || ''}
            isInline
          >
            <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
            <p>{t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
          </CodeRow>
        </Forget>
      );
    }

    if (isRemoveABIOpen) {
      modals.push(
        <RemoveABI
          code={code}
          key='modal-remove-abi'
          onClose={this.toggleRemoveABI}
          onRemove={this.onChangeABI}
        />
      );
    }

    return modals;
  }

  private toggleAbi = (event: React.MouseEvent): () => void => {
    return (): void => {
      event.preventDefault();
      const { isAbiOpen } = this.state;

      this.setState({
        isAbiOpen: !isAbiOpen
      });
    };
  }

  private toggleForget = (): void => {
    const { isForgetOpen } = this.state;

    this.setState({
      isForgetOpen: !isForgetOpen
    });
  }

  private toggleRemoveABI = (): void => {
    const { isRemoveABIOpen } = this.state;

    this.setState({
      isRemoveABIOpen: !isRemoveABIOpen
    });
  }

  private onDeployConstructor = (constructorIndex = 0): void => {
    const { code: { json: { codeHash } }, showDeploy } = this.props;

    codeHash && showDeploy && showDeploy(codeHash, constructorIndex)();
  }

  private onForget = (): void => {
    const { code: { json: { codeHash } } } = this.props;

    if (!codeHash) {
      return;
    }

    try {
      contracts.forgetCode(codeHash);
    } catch (error) {
      console.error(error);
    } finally {
      this.toggleForget();
    }
  }

  private onChangeABI = (abi: string | null = null): void => {
    const { code: { json: { codeHash } } } = this.props;

    this.setState(
      { isAbiOpen: true },
      (): void => {
        contracts.saveCode(
          codeHash,
          { abi }
        );
      }
    );
  }
}

export default translate(withRouter(Code));
