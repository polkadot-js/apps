// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps, TxModalProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';
import { Call, Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Extrinsic, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useModal, useTx } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import translate from './translate';

interface Props extends I18nProps {
  apiSection: string;
  header?: React.ReactNode;
  collectiveName: string;
  memberCount?: number;
  txModalProps: Pick<TxModalProps, never>;
}

function CollectivePropose ({ t, apiSection, header, collectiveName, memberCount = 0, txModalProps = {} }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean =>
    !!threshold && !threshold.isZero() && threshold.lten(memberCount);

  const { apiDefaultTxSudo } = useApi();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(memberCount / 2 + 1),
    true
  ]);

  // FIXME Rework this, unless you know, you can never figure out what all these options mean here
  const txState = useTx(
    (): TxSource<TxDef> => [
      [
        `${apiSection}.propose`,
        [threshold, proposal]
      ],
      !!proposal && hasThreshold
    ],
    [memberCount, proposal, threshold, hasThreshold]
  );
  const modalState = useModal();

  useEffect((): void => {
    setThreshold([threshold, _hasThreshold(threshold)]);
  }, [memberCount]);

  const _onChangeExtrinsic = (method?: Call): void =>
    setProposal(method ? createType(registry, 'Proposal', method) : null);
  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold([threshold || null, _hasThreshold(threshold)]);

  return (
    <TxModal
      {...txState}
      {...modalState}
      header={header}
      {...txModalProps}
    >
      <InputNumber
        className='medium'
        label={t('threshold')}
        help={t(`The minimum number of ${collectiveName} votes required to approve this motion`)}
        isError={!hasThreshold}
        onChange={_onChangeThreshold}
        onEnter={txState.sendTx}
        onEscape={modalState.onClose}
        placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount } })}
        value={threshold || undefined}
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t('proposal')}
        onChange={_onChangeExtrinsic}
        onEnter={txState.sendTx}
        onEscape={modalState.onClose}
      />
    </TxModal>
  );
}

export default translate(CollectivePropose);