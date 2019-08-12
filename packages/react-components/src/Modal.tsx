// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import settings from '@polkadot/ui-settings';

import { classes } from './util';

type Props = BareProps & {
  children: React.ReactNode;
  [index: string]: any;
};

export default class Modal extends React.PureComponent<Props> {
  public static Actions = SUIModal.Actions;

  public static Content = SUIModal.Content;

  public static Header = SUIModal.Header;

  public static Description = SUIModal.Description;

  public render (): React.ReactNode {
    const { className } = this.props;

    return (
      <SUIModal
        {...this.props}
        className={classes(`theme--${settings.uiTheme}`, 'ui--Modal', className)}
      />
    );
  }
}
