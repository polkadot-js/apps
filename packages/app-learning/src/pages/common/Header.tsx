/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';

import React from 'react';
import { Tabs } from '@polkadot/ui-app';

import translate from '../../translate';

type Props = I18nProps & {
  basePath: string
};

type State = {
  tabs: Array<TabItem>
};

class Header extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      tabs: [
        {
          name: 'tracks',
          text: t('Tracks')
        },
        {
          name: 'about',
          text: t('About')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <nav>
        <Tabs
          basePath={basePath}
          items={tabs}
        />
      </nav>
    );
  }
}

export default translate(Header);
