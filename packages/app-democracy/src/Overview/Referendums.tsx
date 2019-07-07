// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { ReferendumInfoExtended } from '@polkadot/api-derive/type';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { Column } from '@polkadot/ui-app';

import Referendum from './Referendum';
import translate from '../translate';

type Props = I18nProps & {
  democracy_referendums?: Array<Option<ReferendumInfoExtended>>
};

class Referendums extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <Column
        emptyText={t('No available referendums')}
        headerText={t('referendum')}
      >
        {this.renderReferendums()}
      </Column>
    );
  }

  private renderReferendums () {
    const { democracy_referendums = [] } = this.props;
    const referendums = democracy_referendums
      .filter((opt) => opt.isSome)
      .map((opt) => opt.unwrap());

    return referendums.map((referendum) => (
      <Referendum
        idNumber={referendum.index}
        key={referendum.index.toString()}
        value={referendum}
      />
    ));
  }
}

export default translate(
  withCalls<Props>(
    'derive.democracy.referendums'
  )(Referendums)
);
