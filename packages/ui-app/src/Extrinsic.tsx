// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { getTypeDef } from '@polkadot/types/codec';
import { FunctionMetadata } from '@polkadot/types/Metadata';
import { I18nProps } from './types';

import React from 'react';
import { Extrinsic, Method } from '@polkadot/types';

import classes from './util/classes';
import Params from './Params';
import translate from './translate';

export type Props = I18nProps & {
  children?: React.ReactNode,
  meta?: FunctionMetadata,
  value: Extrinsic
};

class ExtrinsicDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, meta, style, value } = this.props;
    const params = Method.filterOrigin(meta || value.meta).map(({ name, type }) => ({
      name: name.toString(),
      type: getTypeDef(type)
    }));
    const values = Method.decode(meta || value.meta, value.data).map((value) => ({
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

export default translate(ExtrinsicDisplay);
