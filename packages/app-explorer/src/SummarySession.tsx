// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { CardSummary } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';

import translate from './translate';

type Props = I18nProps & {
  derive_session_eraLength?: BN,
  derive_session_eraProgress?: BN,
  derive_session_sessionProgress?: BN,
  // FIXME Replaced in poc-3
  // sessionBrokenValue?: BN,
  // sessionBrokenPercentLate?: BN,
  query_session_sessionLength?: BlockNumber,
  withBroken?: boolean,
  withEra?: boolean,
  withSession?: boolean
};

class SummarySession extends React.PureComponent<Props> {
  render () {
    return [
      this.renderSession(),
      this.renderEra()
      // FIXME Replace with "reward"
      // this.renderBroken()
    ];
  }

  // private renderBroken () {
  //   const { sessionBrokenValue, sessionBrokenPercentLate, t, withBroken = true } = this.props;

  //   if (!withBroken) {
  //     return null;
  //   }

  //   return (
  //     <CardSummary
  //       key='brokenCount'
  //       label={t('summary.brokenCount', {
  //         defaultValue: 'lateness'
  //       })}
  //       progress={{
  //         color: 'autoReverse',
  //         isPercent: true,
  //         total: sessionBrokenPercentLate,
  //         value: sessionBrokenValue
  //       }}
  //     />
  //   );
  // }

  private renderEra () {
    const { derive_session_eraLength, derive_session_eraProgress, t, withEra = true } = this.props;

    if (!withEra) {
      return null;
    }

    return (
      <CardSummary
        key='eraProgress'
        label={t('summary.eraProgress', {
          defaultValue: 'era'
        })}
        progress={{
          total: derive_session_eraLength,
          value: derive_session_eraProgress
        }}
      />
    );
  }

  private renderSession () {
    const { derive_session_sessionProgress, query_session_sessionLength, t, withSession = true } = this.props;

    if (!withSession) {
      return null;
    }

    return (
      <CardSummary
        key='sessionProgress'
        label={t('summary.sessionProgress', {
          defaultValue: 'session'
        })}
        progress={{
          total: query_session_sessionLength || new BN(0),
          value: derive_session_sessionProgress
        }}
      />
    );
  }
}

export default withMulti(
  SummarySession,
  translate,
  withCall('derive.session.eraLength'),
  withCall('derive.session.eraProgress'),
  withCall('derive.session.sessionProgress'),
  withCall('query.session.sessionLength')
);
