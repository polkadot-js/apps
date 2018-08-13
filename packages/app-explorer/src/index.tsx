// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';

import Summary from './Summary';
import BlockHeaders from './BlockHeaders';

type Props = BareProps & {};

export default class ExplorerApp extends React.PureComponent<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <Page
        className={classes('explorer--App', className)}
        style={style}
      >
        <Summary />
        <BlockHeaders />
      </Page>
    );
  }
}
