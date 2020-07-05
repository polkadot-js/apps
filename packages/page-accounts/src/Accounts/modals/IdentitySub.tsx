// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Data, Option, Vec } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

function extractInfo ([[ids], opts]: [[string[]], Option<ITuple<[AccountId, Data]>>[]]): [string, string][] {
  return ids.reduce((result: [string, string][], id, index): [string, string][] => {
    const opt = opts[index];

    if (opt.isSome) {
      const [, data] = opt.unwrap();

      if (data.isRaw) {
        result.push([id, u8aToString(data.asRaw)]);
      }
    }

    return result;
  }, []);
}

function IdentitySub ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const queryIds = useCall<string[]>(api.query.identity.subsOf, [address], {
    transform: ([, ids]: ITuple<[Balance, Vec<AccountId>]>) => ids.map((a) => a.toString())
  });
  const queryInfos = useCall<[[string[]], Option<ITuple<[AccountId, Data]>>[]]>(queryIds && queryIds.length !== 0 && api.query.identity.superOf.multi, [queryIds], { withParams: true });
  const [infos, setInfos] = useState<[string, string][] | undefined>();

  useEffect((): void => {
    if (queryInfos) {
      setInfos(extractInfo(queryInfos));
    } else if (queryIds && !queryIds.length) {
      setInfos([]);
    }
  }, [queryIds, queryInfos]);

  const _rowAdd = useCallback(
    () => setInfos((infos) => infos && infos.concat([[allAccounts[0], '']])),
    [allAccounts]
  );

  const _rowRemove = useCallback(
    () => setInfos((infos) => infos && infos.slice(0, infos.length - 1)),
    []
  );

  return (
    <Modal
      className={className}
      header={t<string>('Register sub-identities')}
    >
      <Modal.Content>
        {!infos
          ? <Spinner label={t<string>('Retrieving sub-identities')} />
          : (
            <div>
              {infos.map(([address, name], index) =>
                <div key={`${address}:${index}`}>{address}&nbsp;{name}</div>
              )}
              <Button.Group>
                <Button
                  icon='plus'
                  isPrimary
                  label={t<string>('Add sub')}
                  onClick={_rowAdd}
                />
                <Button
                  icon='minus'
                  isDisabled={infos.length === 0}
                  isNegative
                  label={t<string>('Remove sub')}
                  onClick={_rowRemove}
                />
              </Button.Group>
            </div>
          )
        }
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {infos && (
          <TxButton
            accountId={address}
            isDisabled={!infos.length || infos.some(([, raw]) => !raw)}
            isPrimary
            label={t<string>('Set Subs')}
            onStart={onClose}
            params={[
              infos.map(([address, raw]) => [address, { raw }])
            ]}
            tx='identity.setSubs'
          />
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(IdentitySub);
