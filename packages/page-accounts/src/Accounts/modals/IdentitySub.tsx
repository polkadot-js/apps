// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Data, Option, Vec } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

function IdentitySub ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const queryIds = useCall<string[]>(api.query.identity.subsOf, [address], {
    transform: ([, ids]: ITuple<[Balance, Vec<AccountId>]>) => ids.map((a) => a.toString())
  });
  const queryInfos = useCall<Record<string, string>>(queryIds && queryIds.length !== 0 && api.query.identity.superOf.multi, [queryIds], {
    transform: (optInfos: Option<ITuple<[AccountId, Data]>>[]) =>
      optInfos.reduce((result: Record<string, string>, optInfo): Record<string, string> => {
        if (optInfo.isSome) {
          const [accountId, data] = optInfo.unwrap();

          if (data.isRaw) {
            result[accountId.toString()] = u8aToString(data.asRaw);
          }
        }

        return result;
      }, {})
  });
  const [infos, setInfos] = useState<Record<string, string> | undefined>();

  useEffect((): void => {
    if (queryIds && !queryIds.length) {
      setInfos({});
    } else if (queryInfos) {
      setInfos(queryInfos);
    }
  }, [queryIds, queryInfos]);

  return (
    <Modal
      className={className}
      header={t<string>('Register sub-identities')}
    >
      <Modal.Content>
        {!infos
          ? <Spinner label={t<string>('retrieving sub-identities')} />
          : (
            <div>something</div>
          )
        }
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={address}
          isPrimary
          label={t<string>('Set Subs')}
          onStart={onClose}
          params={[]}
          tx='identity.setSubs'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(IdentitySub);
