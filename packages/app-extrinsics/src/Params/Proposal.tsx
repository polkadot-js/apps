// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props, RawParam } from '@polkadot/ui-app/Params/types';

import React from 'react';
import Api from '@polkadot/api-observable';
import { Extrinsic, Proposal } from '@polkadot/types';

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
    const extrinsic = value as Extrinsic;
    let proposal = null;

    if (isValid && extrinsic) {
      // FIXME Should just be `new Proposal(extrinsic)`, however API constructor seems a bit wrong here
      proposal = new Proposal(extrinsic.callIndex, extrinsic.meta, extrinsic.method.args);
    }

    onChange && onChange({
      isValid,
      value: proposal
    });
  }
}
