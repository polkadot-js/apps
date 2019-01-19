// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import translate from './translate';

type Props = I18nProps;

class Peers extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section>
        <h1>{t('peers.header', {
          defaultValue: 'peers'
        })}</h1>
      </section>
    );
  }
}

export default translate(Peers);
