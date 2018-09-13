// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ExtrinsicDecoded } from '@polkadot/params/types';
import { I18nProps } from './types';
import { RawParam } from './Params/types';

import React from 'react';

import classes from './util/classes';
import Params from './Params';
import translate from './translate';

export type Props = I18nProps & {
  children?: React.ReactNode,
  value: ExtrinsicDecoded
};

class Extrinsic extends React.PureComponent<Props> {
  render () {
    const { children, className, style, value: { extrinsic, params } } = this.props;
    const values: Array<RawParam> = extrinsic.params.map(({ type }, index) => ({
      isValid: true,
      value: params[index],
      type
    }));

    return (
      <div
        className={classes('ui--Extrinsic', className)}
        style={style}
      >
        {children}
        <Params
          isDisabled
          item={extrinsic}
          values={values}
        />
      </div>
    );
  }
}

export default translate(Extrinsic);
