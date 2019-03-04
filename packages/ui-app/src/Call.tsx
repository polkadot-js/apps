// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IExtrinsic, IMethod } from '@polkadot/types/types';
import { BareProps } from './types';

import React from 'react';
import { Method, getTypeDef } from '@polkadot/types';
import Params from '@polkadot/ui-params/index';

import { classes } from './util';

export type Props = BareProps & {
  children?: React.ReactNode,
  value: IExtrinsic | IMethod
};

export default class Call extends React.PureComponent<Props> {
  render () {
    const { children, className, style, value } = this.props;
    const params = Method.filterOrigin(value.meta).map(({ name, type }) => ({
      name: name.toString(),
      type: getTypeDef(type)
    }));
    const values = value.args.map((value) => ({
      isValid: true,
      value
    }));

    return (
      <div
        className={classes('ui--Extrinsic', className)}
        style={style}
      >
        {children}
        <Params
          isDisabled
          params={params}
          values={values}
        />
      </div>
    );
  }
}
