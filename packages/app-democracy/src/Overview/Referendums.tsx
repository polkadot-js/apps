/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { ReferendumInfoExtended } from '@polkadot/api-derive/type';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';
import { Column } from '@polkadot/react-components';

import Referendum from './Referendum';
import translate from '../translate';

interface Props extends I18nProps {
  democracy_referendums?: Option<ReferendumInfoExtended>[];
}

class Referendums extends React.PureComponent<Props> {
  public render (): React.ReactNode {
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

  private renderReferendums (): React.ReactNode {
    const { democracy_referendums = [] } = this.props;
    const referendums = democracy_referendums
      .filter((opt): boolean => opt.isSome)
      .map((opt): ReferendumInfoExtended => opt.unwrap());

    return referendums.map((referendum): React.ReactNode => (
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
