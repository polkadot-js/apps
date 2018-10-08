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
      console.error('extrinsic', extrinsic.meta, extrinsic.method.args, extrinsic.data);

      proposal = new Proposal(extrinsic.callIndex, extrinsic.meta, extrinsic.method.args);
    }

// // length
// 5902
// // version
// 81
// // prefix + senderId
// ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f
// // signature
// a43ffe3a72f0d729a63416e509addca9e5abfe2896031091f0e59a5ff8090e02
// 29f2e7033a9d1482175fce97c63b936a52058e532d1f21d5598dffad3098a70b
// // nonce
// 0b00000000000000
// // era
// 00
// // callIndex (democracy.propose)
// 0500
// // this is supposed to be consensus.setCode encoded
// 60
// 01
// 0003
// // code length (20 << 2), i.e. 0b10100 << 2 = 0b1010000 = 0x50
// 50
// // actual bytes (20 bytes input file)
// 7b0a092230783432223a202230783433220a7d0a
// // balance
// e8030000000000000000000000000000

// 5502
// 81
// ffd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f
// d420a21acc9d016b7a9711a8d30f106f95b955dca666df9d135f0efcfe57fe3a
// af84c924d50ac536a9f2ef607af804dd8e3d07d2eee52817dddc3cae49a17f0e
// 0b00000000000000
// 00
// 0500
// 5c
// 0003
// 50
// 7b0a092230783432223a202230783433220a7d0a
// e8030000000000000000000000000000

// 91000000
// ff
// 56208d8784eb709a4dafe66a1eb719b0b4a1c3a89f9ecdabfdb3434e51ab2740
// 01000000
// 0500
// 0000
// 14000000
// 7b0a092230783432223a202230783433220a7d0a
// e8030000000000000000000000000000
// 46ac6a3eb785b56c95cc4e653b5dc7d436f5f7e7e104204ee6ebc19623c2dcc4
// aacd66ec51fb99ebfbfed8348fa2353ed194957248ead07f553135bc5ba4e506

    onChange && onChange({
      isValid,
      value: proposal
    });
  }
}
