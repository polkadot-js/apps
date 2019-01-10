// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps } from '@polkadot/ui-app/Params/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import { withApi } from '@polkadot/ui-react-rx/with';

import Extrinsic from './Extrinsic';

type Props = ApiProps & BaseProps;

class Call extends React.PureComponent<Props> {
  render () {
    const { apiDefaultTx, apiPromise, className, isDisabled, isError, label, onChange, style, withLabel } = this.props;
    const defaultValue = (() => {
      try {
        return apiPromise.tx.balances.transfer;
      } catch (error) {
        return apiDefaultTx;
      }
    })();

    return (
      <Extrinsic
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={false}
        label={label}
        onChange={onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }
}

export default withApi(Call);
