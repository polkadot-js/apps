/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import translate from '@polkadot/app-transfer/translate';

type Props = I18nProps;

type State = {};

class AboutPage extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { t } = this.props;

    return (
      <section>
        <h2>{t('About')}</h2>
        <p>
          {t('About info')}
        </p>
      </section>
    );
  }
}

export default translate(AboutPage);
