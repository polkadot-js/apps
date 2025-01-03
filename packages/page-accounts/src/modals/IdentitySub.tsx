// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Data, Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Columar, Input, InputAddress, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useSubidentities } from '@polkadot/react-hooks';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

interface SubProps {
  address: string;
  index: number;
  name: string;
  setAddress: (index: number, value: string) => void;
  setName: (index: number, value: string) => void;
  t: (key: string, options?: { replace: Record<string, unknown> }) => string;
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

function IdentitySub ({ address, index, name, setAddress, setName, t }: SubProps): React.ReactElement<SubProps> {
  const _setAddress = useCallback(
    (value?: string | null) => setAddress(index, value || ''),
    [index, setAddress]
  );

  const _setName = useCallback(
    (value: string) => setName(index, value || ''),
    [index, setName]
  );

  return (
    <Columar>
      <Columar.Column>
        <InputAddress
          defaultValue={address}
          label={t('address {{index}}', { replace: { index: index + 1 } })}
          onChange={_setAddress}
        />
      </Columar.Column>
      <Columar.Column>
        <Input
          defaultValue={name}
          isError={!name}
          isFull
          label={t('sub name')}
          onChange={_setName}
        />
      </Columar.Column>
    </Columar>
  );
}

const IdentitySubMemo = React.memo(IdentitySub);

const transformInfo = { withParams: true };

function IdentitySubModal ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiIdentity, enableIdentity } = useApi();
  const { allAccounts } = useAccounts();
  const queryIds = useSubidentities(address);
  const queryInfos = useCall<[[string[]], Option<ITuple<[AccountId, Data]>>[]]>(queryIds && queryIds.length !== 0 && apiIdentity.query.identity.superOf.multi, [queryIds], transformInfo);
  const [infos, setInfos] = useState<[string, string][] | undefined>();

  useEffect((): void => {
    if (queryInfos) {
      setInfos(extractInfo(queryInfos));
    } else if (queryIds && !queryIds.length) {
      setInfos([]);
    }
  }, [allAccounts, queryIds, queryInfos]);

  const _rowAdd = useCallback(
    () => setInfos((infos) => infos?.concat([[allAccounts[0], '']])),
    [allAccounts]
  );

  const _rowRemove = useCallback(
    () => setInfos((infos) => infos?.slice(0, infos.length - 1)),
    []
  );

  const _setAddress = useCallback(
    (index: number, address: string) => setInfos((infos) => (infos || []).map(([a, n], i) => [index === i ? address : a, n])),
    []
  );

  const _setName = useCallback(
    (index: number, name: string) => setInfos((infos) => (infos || []).map(([a, n], i) => [a, index === i ? name : n])),
    []
  );

  return (
    <Modal
      className={className}
      header={t('Register sub-identities')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        {!infos
          ? <Spinner label={t('Retrieving sub-identities')} />
          : (
            <div>
              {!infos.length
                ? <article>{t('No sub identities set.')}</article>
                : infos.map(([address, name], index) =>
                  <IdentitySubMemo
                    address={address}
                    index={index}
                    key={index}
                    name={name}
                    setAddress={_setAddress}
                    setName={_setName}
                    t={t}
                  />
                )
              }
              <Button.Group>
                <Button
                  icon='plus'
                  label={t('Add sub')}
                  onClick={_rowAdd}
                />
                <Button
                  icon='minus'
                  isDisabled={infos.length === 0}
                  label={t('Remove sub')}
                  onClick={_rowRemove}
                />
              </Button.Group>
            </div>
          )
        }
      </Modal.Content>
      <Modal.Actions>
        {infos && (
          <TxButton
            accountId={address}
            isDisabled={!enableIdentity || infos.some(([address, raw]) => !address || !raw)}
            label={t('Set Subs')}
            onStart={onClose}
            params={[
              infos.map(([address, raw]) => [address, { raw }])
            ]}
            tx={apiIdentity.tx.identity.setSubs}
          />
        )}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(IdentitySubModal);
