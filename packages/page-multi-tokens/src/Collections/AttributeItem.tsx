// Copyright 2017-2022 @polkadot/app-multi-tokens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import type { u128 } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import styled from 'styled-components';
import { listItem } from './shared';
import useAttributeData from '../useAttributeData';

interface AttributeItemProps {
  collection: BN;
  attributeKey: u128;
}

const AttributeItem = ({ collection, attributeKey }: AttributeItemProps) => {
  const { t } = useTranslation();

  const data = useAttributeData(collection, attributeKey);

  return (
    <Container>
      <div>{t('Key')}: <b>{attributeKey.toHuman()}</b></div>
      <Value>
        <div>{t('Value')}: <b>{data?.value.toHuman()}</b></div>
        <div>{t('Deposit')}: <b>{formatNumber(data?.deposit)}</b></div>
      </Value>
    </Container>
  );
};

const Container = styled.div`
   ${listItem}

   overflow-x: auto;
`;

const Value = styled.div`
  flex: 2.5 !important;
  padding-left: 20px;
`;

export default React.memo(AttributeItem);
