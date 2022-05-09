// Copyright 2017-2022 @polkadot/app-multi-tokens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import type { BN } from '@polkadot/util';

import { AddressSmall, ExpandButton } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import useCollectionData from '../useCollectionData';
import styled from 'styled-components';
import Policy, { Constraints } from './Policy';
import useTokenIds from '../useTokenIds';
import TokenItem from './TokenItem';
import AttributeItem from './AttributeItem';
import useAttributeKeys from '../useAttributeKeys';
import useAttributeData from '../useAttributeData';

interface Props {
  className?: string;
  id: BN;
}

const Collection = ({ className, id }: Props): React.ReactElement<Props> => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const data = useCollectionData(id);
  const tokenIds = useTokenIds(id);
  const attributeKeys = useAttributeKeys(id);

  const nameAttrKey = useMemo(() => attributeKeys.find((k) => k.toHuman() == 'name'), [attributeKeys]);
  const nameAttrData = useAttributeData(id, nameAttrKey);

  return (
    <>
      <tr className={className}>
        <td className='number'>
          <CollectionId>{formatNumber(id)}</CollectionId>
        </td>
        <td>{nameAttrData?.value.toHuman() || '-'}</td>
        <Owner className='address'>{data && <AddressSmall value={data.owner} />}</Owner>
        <td className='number'>{formatNumber(data?.tokenCount)}</td>
        <td className='number'>{formatNumber(data?.attributeCount)}</td>
        <td className='number'>
          <ExpandButton expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6}>
            <MoreData>
              <Row>
                <Label>{t('Policy')}</Label>
                <Label>{t('Tokens')}</Label>
                <Label>{t('Attributes')}</Label>
              </Row>
              <Row>
                <Policies>
                  <Policy
                    policy={t('Mint')}
                    constraints={
                      {
                        maxTokenCount: data?.policy.mint.maxTokenCount,
                        maxTokenSupply: data?.policy.mint.maxTokenSupply,
                        forceSingleMint: data?.policy.mint.forceSingleMint
                      } as Constraints
                    }
                    borders={['bottom', 'right']}
                  />
                  <Policy policy={t('Transfer')} constraints={{ isFrozen: data?.policy.transfer.isFrozen } as Constraints} borders={['bottom', 'left']} />
                  <Policy policy={t('Burn')} borders={['top', 'right']} />
                  <Policy policy={t('Attribute')} borders={['top', 'left']} />
                </Policies>
                {tokenIds.length ? (
                  <List>
                    {tokenIds.map((tokenId) => (
                      <TokenItem key={tokenId.toString()} collectionId={id} tokenId={tokenId} />
                    ))}
                  </List>
                ) : (
                  <div style={{ height: '100%' }}>{t('This collection doesnt have any tokens')}</div>
                )}
                {attributeKeys.length ? (
                  <List>
                    {attributeKeys.map((attributeKey) => (
                      <AttributeItem key={attributeKey.toString()} collectionId={id} attributeKey={attributeKey} />
                    ))}
                  </List>
                ) : (
                  <div style={{ height: '100%' }}>{t('This collection doesnt have any attributes')}</div>
                )}
              </Row>
            </MoreData>
          </td>
        </tr>
      )}
    </>
  );
};

export default React.memo(Collection);

const CollectionId = styled.h1`
  text-align: left;
`;

const Owner = styled.td`
  text-align: right;
`;

const MoreData = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
`;

const Policies = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  justify-items: center;
`;

const List = styled.div`
  height: 210px;
  flex: 1;
  overflow-y: auto;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  & > * {
    flex: 1;
  }
`;

const Label = styled.div`
  padding: 10px 0;
`;
