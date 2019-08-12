// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '@polkadot/react-params/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { createType } from '@polkadot/types';
import { withApi } from '@polkadot/react-api';

import ExtrinsicDisplay from './Extrinsic';

type Props = ApiProps & BaseProps;

class ProposalDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { apiDefaultTxSudo, className, isDisabled, isError, label, onEnter, style, withLabel } = this.props;

    return (
      <ExtrinsicDisplay
        className={className}
        defaultValue={apiDefaultTxSudo}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate
        label={label}
        onChange={this.onChange}
        onEnter={onEnter}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  private onChange = ({ isValid, value }: RawParam): void => {
    const { onChange } = this.props;
    let proposal = null;

    if (isValid && value) {
      proposal = createType('Proposal', value);
    }

    onChange && onChange({
      isValid,
      value: proposal
    });
  }
}

export default withApi(ProposalDisplay);
