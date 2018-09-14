// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import classes from '@polkadot/ui-app/util/classes';

type Props = BareProps & {
  children: React.ReactNode,
  [index: string]: any
};

export default class Modal extends React.PureComponent<Props> {
  static Actions = SUIModal.Actions;
  static Content = SUIModal.Content;
  static Header = SUIModal.Header;

  render () {
    const { className } = this.props;

    return (
      <SUIModal
        {...this.props}
        className={classes(`theme--${process.env.UI_THEME}`, 'ui--Modal', className)}
      />
    );
  }
}
