// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { getTypeDef } from '@polkadot/types/codec';
import { BareProps } from './types';

import React from 'react';
import { Event } from '@polkadot/types';
import Params from '@polkadot/ui-params/index';

import classes from './util/classes';

export type Props = BareProps & {
  children?: React.ReactNode,
  value: Event
};

export default class EventDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, style, value } = this.props;
    const params = value.typeDef.map(({ type }) => ({
      type: getTypeDef(type)
    }));
    const values = value.data.map((value) => ({
      isValid: true,
      value
    }));

    return (
      <div
        className={classes('ui--Event', className)}
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
