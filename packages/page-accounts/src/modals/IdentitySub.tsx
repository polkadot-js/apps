// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Balance } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Columar, Input, InputAddress, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Data, Option, Vec } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate';

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
  t: (key: string, opts?: { replace: Record<string, string | number> }) => string;
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

const transformIds = {
  transform: ([, ids]: ITuple<[Balance, Vec<AccountId>]>) => ids.map((a) => a.toString())
};

const transformInfo = { withParams: true };

function IdentitySubModal ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const queryIds = useCall<string[]>(api.query.identity.subsOf, [address], transformIds);
  const queryInfos = useCall<[[string[]], Option<ITuple<[AccountId, Data]>>[]]>(queryIds && queryIds.length !== 0 && api.query.identity.superOf.multi, [queryIds], transformInfo);
  const [infos, setInfos] = useState<[string, string][] | undefined>();

  useEffect((): void => {
    if (queryInfos) {
      setInfos(extractInfo(queryInfos));
    } else if (queryIds && !queryIds.length) {
      setInfos([]);
    }
  }, [allAccounts, queryIds, queryInfos]);

  const _rowAdd = useCallback(
    () => setInfos((infos) => infos && infos.concat([[allAccounts[0], '']])),
    [allAccounts]
  );

  const _rowRemove = useCallback(
    () => setInfos((infos) => infos && infos.slice(0, infos.length - 1)),
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
      header={t<string>('Register sub-identities')}
      size='large'
    >
      <Modal.Content>
        {!infos
          ? <Spinner label={t<string>('Retrieving sub-identities')} />
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
                  label={t<string>('Add sub')}
                  onClick={_rowAdd}
                />
                <Button
                  icon='minus'
                  isDisabled={infos.length === 0}
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
            isDisabled={infos.some(([address, raw]) => !address || !raw)}
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

export default React.memo(IdentitySubModal);
