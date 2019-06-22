// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';
import { InputFile, Labelled, Messages } from '@polkadot/ui-app';
import { u8aToString } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  className?: string,
  contractAbi?: Abi | null,
  help?: React.ReactNode,
  isError?: boolean,
  isDisabled?: boolean,
  isRequired?: boolean,
  label?: React.ReactNode,
  onChange: (json: string | null, contractAbi: Abi | null) => void,
  onRemove?: () => void,
  onRemoved?: () => void,
  onSelect?: () => void
};

type State = {
  contractAbi: Abi | null,
  isAbiValid: boolean,
  isEmpty: boolean,
  isError: boolean
};

class ABI extends React.PureComponent<Props, State> {
  state: State = {
    contractAbi: null,
    isAbiValid: false,
    isEmpty: true,
    isError: false
  };

  constructor (props: Props) {
    super(props);

    const { contractAbi, isError, isRequired } = this.props;
    const isAbiValid = !!contractAbi;

    this.state = {
      contractAbi: contractAbi || null,
      isAbiValid,
      isEmpty: !isAbiValid,
      isError: isError || (isRequired && !isAbiValid) || false
    };
  }

  componentWillReceiveProps ({ contractAbi, isError, isRequired }: Props) {
    if (contractAbi) {
      this.setState({
        contractAbi,
        isAbiValid: true,
        isError: false
      });
    } else if (this.props.contractAbi) {
      this.setState({
        contractAbi: null,
        isAbiValid: false,
        isError: isError || isRequired || false
      });
    }
  }

  render () {
    const { className } = this.props;
    const { contractAbi, isAbiValid } = this.state;

    return (
      <div className={className}>
        {
          (contractAbi && isAbiValid)
            ? this.renderMessages()
            : this.renderInputFile()
        }
      </div>
    );
  }

  private renderInputFile () {
    const { className, help, isDisabled, isRequired, label, t } = this.props;
    const { isAbiValid, isEmpty, isError } = this.state;

    return (
      <div className={className}>
        <InputFile
          help={help}
          isDisabled={isDisabled}
          isError={!isAbiValid && (isRequired || isError)}
          label={label}
          onChange={this.onChange}
          placeholder={
            !isEmpty && !isAbiValid
              ? t('invalid ABI file selected')
              : t('click to select or drag and drop a JSON ABI file')
          }
        />
      </div>
    );
  }

  private renderMessages () {
    const { help, isDisabled, label, onRemove } = this.props;
    const { contractAbi } = this.state;

    return (
      <Labelled
        label={label}
        help={help}
        withLabel={!!label}
      >
        <Messages
          contractAbi={contractAbi!}
          onRemove={onRemove || this.onRemove}
          isRemovable={!isDisabled}
        />
      </Labelled>
    );
  }

  private onChange = (u8a: Uint8Array): void => {
    const { onChange } = this.props;
    const json = u8aToString(u8a);

    try {
      const contractAbi = new Abi(JSON.parse(json));

      this.setState({
        contractAbi,
        isAbiValid: true,
        isEmpty: false,
        isError: false
      }, () => onChange(json, contractAbi));
    } catch (error) {
      console.error(error);

      this.setState({
        isAbiValid: false,
        isEmpty: false,
        isError: true
      }, () => onChange(null, null));
    }
  }

  private onRemove = (): void => {
    const { onChange, onRemoved } = this.props;

    this.setState(
      {
        contractAbi: null,
        isAbiValid: false,
        isEmpty: true
      },
      () => {
        onChange(null, null);
        onRemoved && onRemoved();
      }
    );
  }
}

export default translate(styled(ABI)`
  min-height: 4rem;
`);
