// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '@polkadot/ui-app/Params/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import { Proposal } from '@polkadot/types';
import { withApi } from '@polkadot/ui-react-rx/with';

import ExtrinsicDisplay from './Extrinsic';

type Props = ApiProps & BaseProps;

class ProposalDisplay extends React.PureComponent<Props> {
  render () {
    const { apiPromise, className, isDisabled, isError, label, style, withLabel } = this.props;

    return (
      <ExtrinsicDisplay
        className={className}
        defaultValue={apiPromise.tx.consensus.setCode}
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

export default withApi(ProposalDisplay);
