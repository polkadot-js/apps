// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';
import { UncheckedMortalExtrinsic } from '@polkadot/types';

import classes from './util/classes';
// import Params from './Params';
import translate from './translate';

export type Props = I18nProps & {
  children?: React.ReactNode,
  value: UncheckedMortalExtrinsic
};

class Extrinsic extends React.PureComponent<Props> {
  render () {
    const { children, className, style } = this.props;
    // FIXME
    // const values: Array<RawParam> = extrinsic.params.map(({ type }, index) => ({
    //   isValid: true,
    //   value: params[index],
    //   type
    // }));

    return (
      <div
        className={classes('ui--Extrinsic', className)}
        style={style}
      >
        {children}
        {/* FIXME <Params
          isDisabled
          item={extrinsic}
          values={values}
        /> */}
      </div>
    );
  }
}

export default translate(Extrinsic);
