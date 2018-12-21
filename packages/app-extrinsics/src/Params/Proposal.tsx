// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '@polkadot/ui-app/Params/types';

import React from 'react';
import Api from '@polkadot/api-observable';
import { Proposal } from '@polkadot/types';

import ExtrinsicDisplay from './Extrinsic';

export default class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;

    return (
      <ExtrinsicDisplay
        className={className}
        defaultValue={Api.extrinsics.consensus.setCode}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate
        label={label}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  private onChange = ({ isValid, value }: RawParam) => {
    const { onChange } = this.props;
    let proposal = null;

    if (isValid && value) {
      proposal = new Proposal(value);
    }

    onChange && onChange({
      isValid,
      value: proposal
    });
  }
}
