// Copyright 2017-2022 @polkadot/app-multi-tokens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import type { BN } from '@polkadot/util';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import styled from 'styled-components';
import useTokenData from '../useTokenData';
import { listItem } from './shared';
import { Link } from 'react-router-dom';

interface TokenItemProps {
  collectionId: BN;
  tokenId: BN;
}

const TokenItem = ({ collectionId, tokenId }: TokenItemProps) => {
  const { t } = useTranslation();
  const data = useTokenData(collectionId, tokenId);

  return (
    <Container to={`/multi-tokens/token/${collectionId}/${tokenId}`}>
      <div>
        <div>
          {t('id')}: <b>{tokenId.toString()}</b>
        </div>
        <div>
          {t('supply')}: <b>{formatNumber(data?.supply)}</b>
        </div>
        <div>
          {t('cap')}: <b>{data?.cap.toString()}</b>
        </div>
        <div>
          {t('isFrozen')}: <b>{data?.isFrozen.toString()}</b>
        </div>
      </div>
      <div>
        <div>
          {t('minimumBalance')}: <b>{formatNumber(data?.minimumBalance)}</b>
        </div>
        <div>
          {t('attributeCount')}: <b>{formatNumber(data?.attributeCount)}</b>
        </div>
        <div>
          {t('mintDeposit')}: <b>{formatNumber(data?.mintDeposit)}</b>
        </div>
      </div>
    </Container>
  );
};

const Container = styled(Link)`
   ${listItem}
`;

export default React.memo(TokenItem);
