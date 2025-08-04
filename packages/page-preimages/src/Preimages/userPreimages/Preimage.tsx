// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React, { useState } from 'react';

import { AddressMini, Checkbox, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import Call from '../Call.js';
import Hash from '../Hash.js';

interface Props {
  className?: string;
  depositor: string,
  preimageInfos: TPreimage[];
}

interface SelectPreimageProps {
  proposalHash: TPreimage['proposalHash'],
  onSelectPreimage: React.Dispatch<React.SetStateAction<TPreimage['proposalHash'][]>>
}

const SelectPreimage = ({ onSelectPreimage, proposalHash }: SelectPreimageProps) => {
  const [checked, setChecked] = useState(false);

  const onChange = React.useCallback((value: boolean) => {
    setChecked(value);
    onSelectPreimage((prevHashes) =>
      // Add preimage hash if checked else filter it out
      value ? [...prevHashes, proposalHash] : prevHashes.filter((i) => i !== proposalHash)
    );
  }, [onSelectPreimage, proposalHash]);

  return (
    <Checkbox
      onChange={onChange}
      value={checked}
    />
  );
};

const Preimage = ({ className, depositor, preimageInfos }: Props) => {
  const { t } = useTranslation();
  const { api } = useApi();

  const [selectedPreimages, onSelectPreimage] = useState<TPreimage['proposalHash'][]>([]);

  return (
    <>
      {preimageInfos.map((info, index) => {
        return (
          <StyledTr
            className={`isExpanded ${className}`}
            isFirstItem={index === 0}
            isLastItem={false}
            key={info.proposalHash}
          >
            <td
              className='address all'
              style={{ paddingTop: 15, verticalAlign: 'top' }}
            >
              {index === 0 && <AddressMini value={depositor} />}
            </td>
            <Call value={info} />
            <td style={{ alignItems: 'center', display: 'flex' }}>
              <SelectPreimage
                onSelectPreimage={onSelectPreimage}
                proposalHash={info.proposalHash}
              />
              <Hash value={info.proposalHash} />
            </td>
            <td className='number media--1000'>
              {info?.proposalLength
                ? formatNumber(info.proposalLength)
                : <span className='--tmp'>999,999</span>}
            </td>
            <td className='preimageStatus start media--1100 together'>
              {info
                ? (
                  <>
                    {info.status && (<div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>)}
                  </>
                )
                : <span className='--tmp'>Unrequested</span>}
            </td>
          </StyledTr>
        );
      })}
      <StyledTr
        className={`isExpanded ${className}`}
        isFirstItem={false}
        isLastItem
      >
        <td className='all' />
        <td className='all' />
        <td className='media--1300' />
        <td>
          <TxButton
            accountId={depositor}
            className={className}
            icon='minus'
            isToplevel
            label={t('Unnote')}
            params={[selectedPreimages.map((i) => api.tx.preimage.unnotePreimage(i))]}
            tx={api.tx.utility.batchAll}
          />
        </td>
        <td className='media--1000' />
        <td className='media--1100' />
      </StyledTr>
    </>
  );
};

const BASE_BORDER = 0.125;
const BORDER_TOP = `${BASE_BORDER * 3}rem solid var(--bg-page)`;
const BORDER_RADIUS = `${BASE_BORDER * 4}rem`;

const StyledTr = styled.tr<{isFirstItem: boolean; isLastItem: boolean}>`
  background: var(--bg-table);
  
  .ui--Icon {
    border-width: 2px;
  }
  
  td {
    border-top: ${(props) => props.isFirstItem && BORDER_TOP};
    border-radius: 0rem !important;
    
    &:first-child {
      padding-block: 1rem !important;
      border-top-left-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
      border-bottom-left-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
    }

    &:last-child {
      border-top-right-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
      border-bottom-right-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
    }

    td {
      border: none !important;
    }
  }
`;

export default React.memo(Preimage);
