/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';
import { KeyringOptions } from '@polkadot/ui-keyring/options/types';
import { QueueStatus, QueueTx, QueueAction$Add } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import keyringOption from '@polkadot/ui-keyring/options';
import { Status as StatusDisplay } from '@polkadot/react-components';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import translate from '../translate';

interface Props extends I18nProps {
  optionsAll?: KeyringOptions;
  queueAction: QueueAction$Add;
  stqueue: QueueStatus[];
  system_events?: EventRecord[];
  txqueue: QueueTx[];
}

let prevEventHash: string;

class Status extends React.PureComponent<Props> {
  public componentDidUpdate ({ optionsAll, queueAction, system_events, t }: Props): void {
    const eventHash = xxhashAsHex(stringToU8a(JSON.stringify(system_events || [])));

    if (!optionsAll || eventHash === prevEventHash) {
      return;
    }

    prevEventHash = eventHash;

    const addresses = optionsAll.account.map((account): string | null => account.value);

    (system_events || []).forEach(({ event: { data, method, section } }): void => {
      if (section === 'balances' && method === 'Transfer') {
        const account = data[1].toString();

        if (addresses.includes(account)) {
          queueAction({
            account,
            action: `${section}.${method}`,
            status: 'event',
            message: t('transfer received')
          });
        }
      } else if (section === 'democracy') {
        const index = data[0].toString();

        queueAction({
          action: `${section}.${method}`,
          status: 'event',
          message: t('update on #{{index}}', {
            replace: {
              index
            }
          })
        });
      }
    });
  }

  public render (): React.ReactNode {
    const { stqueue, txqueue } = this.props;

    return (
      <StatusDisplay
        stqueue={stqueue}
        txqueue={txqueue}
      />
    );
  }
}

export default withMulti(
  Status,
  translate,
  withCalls<Props>('query.system.events'),
  withObservable(keyringOption.optionsSubject, { propName: 'optionsAll' })
);
