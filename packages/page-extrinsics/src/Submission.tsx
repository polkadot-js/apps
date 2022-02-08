// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/.interfaces';
import type { Inspect } from '@polkadot/types/types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, Columar, Extrinsic, InputAddress, MarkError, Output, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

interface Inspected {
  name: string;
  value: string;
}

function formatInspect ({ inner, name = '', value }: Inspect, result: Inspected[] = []): Inspected[] {
  if (value && value.length) {
    result.push({ name, value: u8aToHex(value, undefined, false) });
  }

  for (let i = 0; i < inner.length; i++) {
    formatInspect(inner[i], result);
  }

  return result;
}

function Selection ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) => setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) => setError(error ? error.message : null),
    []
  );

  const [extrinsicHex, extrinsicHash, inspect] = useMemo(
    (): [string, string, Inspected[] | null] => {
      if (!extrinsic) {
        return ['0x', '0x', null];
      }

      const u8a = extrinsic.method.toU8a();

      // don't use the built-in hash, we only want to convert once
      return [
        u8aToHex(u8a),
        extrinsic.registry.hash(u8a).toHex(),
        formatInspect((extrinsic.method as Call).inspect())
      ];
    },
    [extrinsic]
  );

  return (
    <div className={className}>
      <InputAddress
        label={t<string>('using the selected account')}
        labelExtra={
          <BalanceFree
            label={<label>{t<string>('free balance')}</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t<string>('submit the following extrinsic')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      <Columar
        className='decodeColumar'
        isPadded={false}
      >
        <Columar.Column>
          <Output
            isDisabled
            isTrimmed
            label={t<string>('encoded call data')}
            value={extrinsicHex}
            withCopy
          />
          <Output
            isDisabled
            label={t<string>('encoded call hash')}
            value={extrinsicHash}
            withCopy
          />
        </Columar.Column>
        <Columar.Column>
          {inspect && (
            <Output
              isDisabled
              label={t<string>('encoded call details')}
              value={
                <table className='decodeTable'>
                  <tbody>
                    {inspect.map(({ name, value }, i) => (
                      <tr key={i}>
                        <td>{name}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            />
          )}
        </Columar.Column>
      </Columar>
      {error && !extrinsic && (
        <MarkError content={error} />
      )}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(styled(Selection)`
  .decodeColumar .ui--Column:last-child .ui--Labelled {
    padding-left: 0.5rem;

    label {
      left: 2.05rem; /* 3.55 - 1.5 (diff from padding above) */
    }
  }

  .decodeTable {
    tr {
      td:first-child {
        padding-right: 1em;
        text-align: right;
      }

      td:last-child {
        font: var(--font-mono);
      }
    }
`);
