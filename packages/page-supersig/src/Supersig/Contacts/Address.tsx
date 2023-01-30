// Copyright 2017-2022 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AccountIdIsh, ThemeDef } from '@polkadot/react-components/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { PromiseResult, QueryableStorageEntry } from '@polkadot/api/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import axios  from 'axios';
import Transfer from '@polkadot/app-accounts/modals/Transfer';
import { AddressMini, ExpanderScroll, AddressInfo, AddressSmall, Button, ChainLock, ExpandButton, Forget, Icon, LinkExternal, Menu, Popup, Tags } from '@polkadot/react-components';
import { useApi, useCall, useBalancesAll, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, formatNumber, isFunction } from '@polkadot/util';
import type  { MembersList, FetchProposalState, UserSupersig, FetchListProposals } from 'supersig-types/dist/interfaces/default'
import { useTranslation } from '../translate';
import { Observable } from '@polkadot/types/types';
import { Vec } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import IdentityIcon from '@polkadot/react-components/IdentityIcon';
import { FormatBalance } from '@polkadot/react-query';

import { largeNumSum } from '../../util';


interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

const isEditable = true;

function Address ({ address, className = '', filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const api = useApi();
  const info = useDeriveAccountInfo(address);
  const balancesAll = useBalancesAll(address);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [memberCnt, setMemberCnt] = useState(0);
  const [proposalCnt, setProposalCnt] = useState(0);
  const [balancesSum, setBalancesSum] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  
  const [memberAccounts, setMemberAccounts] = useState<Array<object>>([]);
  const members = useCall<MembersList>(api.api.rpc.superSig.listMembers, [address]);
  const proposals = useCall<FetchListProposals>(api.api.rpc.superSig.listProposals, [address]);

  const _setTags = useCallback(
    (tags: string[]): void => setTags(tags.sort()),
    []
  );

  const getInfo = async () => {
    setMemberCnt(((members?.toArray()) || []).length);
    var tempBalance:string = '';
    var tempMemberAccounts : Array<object> = [];
    await Promise.all((members?.toArray() || []).map(async(item: any) => {
      let balance = await api.api.derive.balances?.all(item[0]);
      var membalance = (balance.freeBalance.add(balance.reservedBalance)).toString();
      if(tempBalance.length > membalance.length){
        tempBalance = largeNumSum(tempBalance, membalance);
      }else{
        tempBalance = largeNumSum(membalance, tempBalance);
      }

      let info = {id: item[0].toString(), balance: membalance};

      tempMemberAccounts.push(info);
    }))

    setBalancesSum(tempBalance);
    setMemberAccounts(tempMemberAccounts);

  }

  useEffect((): void => {
    const current = keyring.getAddress(address);
    getInfo();
    setProposalCnt((proposals?.proposals_info || []).length);

    setCurrent(current || null);
    setGenesisHash((current && current.meta.genesisHash) || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, members,proposals]);

  useEffect((): void => {
    const { identity, nickname } = info || {};

    if (isFunction(api.api.query.identity?.identityOf)) {
      if (identity?.display) {
        setAccName(identity.display);
      }
    } else if (nickname) {
      setAccName(nickname);
    }
  }, [api, info]);

  useEffect((): void => {
    const account = keyring.getAddress(address);

    _setTags(account?.meta?.tags as string[] || []);
    setAccName(account?.meta?.name || '');
  }, [_setTags, address]);

  useEffect((): void => {
    if (filter.length === 0) {
      setIsVisible(true);
    } else {
      const _filter = filter.toLowerCase();

      setIsVisible(
        tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(_filter);
        }, accName.toLowerCase().includes(_filter))
      );
    }
  }, [accName, filter, tags]);

  const _onGenesisChange = useCallback(
    (genesisHash: string | null): void => {
      setGenesisHash(genesisHash);

      const account = keyring.getAddress(address);

      account && keyring.saveAddress(address, { ...account.meta, genesisHash });

      setGenesisHash(genesisHash);
    },
    [address]
  );

  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const _toggleForget = useCallback(
    (): void => setIsForgetOpen(!isForgetOpen),
    [isForgetOpen]
  );

  const _toggleTransfer = useCallback(
    (): void => setIsTransferOpen(!isTransferOpen),
    [isTransferOpen]
  );

  const _onForget = useCallback(
    (): void => {
      if (address) {
        const status: Partial<ActionStatus> = {
          account: address,
          action: 'forget'
        };

        try {
          keyring.forgetAddress(address);
          status.status = 'success';
          status.message = t<string>('address forgotten');
        } catch (error) {
          status.status = 'error';
          status.message = (error as Error).message;
        }
      }
    },
    [address, t]
  );

  if (!isVisible) {
    return null;
  }

  interface IMemberItem {
    id?: Uint8Array | String;
    balance?: String;
  }

  const BalanceDetail = () : React.ReactElement => {

    const renderVoters = useCallback(
      () => memberAccounts && memberAccounts.map((item: IMemberItem, index: number): React.ReactNode =>
        <div key={index} style={{display: "-webkit-box"}}>
          <IdentityIcon value={item.id as Uint8Array} />
          <div>
            <p style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: 'hidden', width: "190px"}}>{item.id}</p>
            <FormatBalance
              className='result'
              value={item.balance}
            />
          </div>
        </div>
      ),
      [memberAccounts]
    );

    return (
      <ExpanderScroll
        renderChildren={renderVoters}
        summary={<>
          <FormatBalance
              className='result'
              value={balancesSum}
            /> ({formatNumber(memberCnt)})
          </>}
      />
    )
  }

  const PopupDropdown = (
    <Menu>
      <Menu.Item
        isDisabled={!isEditable}
        label={t<string>('Forget this address')}
        onClick={_toggleForget}
      />
      {isEditable && !api.isDevelopment && (
        <>
          <Menu.Divider />
          <ChainLock
            className='addresses--network-toggle'
            genesisHash={genesisHash}
            onChange={_onGenesisChange}
          />
        </>
      )}
    </Menu>
  );

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
        <td className='favorite'>
          <Icon
            color={isFavorite ? 'orange' : 'gray'}
            icon='star'
            onClick={_onFavorite}
          />
        </td>
        <td className='address'>
          <AddressSmall value={address} />
          {address && current && (
            <>
              {isForgetOpen && (
                <Forget
                  address={current.address}
                  key='modal-forget-account'
                  mode='address'
                  onClose={_toggleForget}
                  onForget={_onForget}
                />
              )}
              {isTransferOpen && (
                <Transfer
                  key='modal-transfer'
                  onClose={_toggleTransfer}
                  recipientId={address}
                />
              )}
            </>
          )}
        </td>
        <td className='number'>
          { memberCnt }
        </td>
        <td className='number'>
          { proposalCnt }
        </td>
        <td className='number'>
          <BalanceDetail />
        </td>
        <td className='number media--1500'>
          {balancesAll?.accountNonce.gt(BN_ZERO) && formatNumber(balancesAll.accountNonce)}
        </td>

        <td className='number'>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={{
              available: false,
              bonded: false,
              locked: false,
              redeemable: false,
              reserved: false,
              total: true,
              unlocking: false,
              vested: false
            }}
            withExtended={false}
          />
        </td>
        <td className='links media--1400'>
          <LinkExternal
            className='ui--AddressCard-exporer-link'
            data={address}
            type='address'
          />
        </td>
        <td className='fast-actions-addresses'>
          <div className='fast-actions-row'>
            {isFunction(api.api.tx.balances?.transfer) && (
              <Button
                className='send-button'
                icon='paper-plane'
                key='propose'
                label={t<string>('propose')}
                onClick={_toggleTransfer}
              />
            )}
            <Popup
              className={`theme--${theme}`}
              value={PopupDropdown}
            />
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />
          </div>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td />
        <td>
          <div
            className='tags'
            data-testid='tags'
          >
            <Tags
              value={tags}
              withTitle
            />
          </div>
        </td>
        <td className='number media--1500' />
        <td>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={{
              available: true,
              bonded: true,
              locked: true,
              redeemable: true,
              reserved: true,
              total: false,
              unlocking: true,
              vested: true
            }}
            withExtended={false}
          />
        </td>
        <td colSpan={2} />
      </tr>
    </>
  );
}

export default React.memo(styled(Address)`
  &.isCollapsed {
    visibility: collapse;
  }

  &.isExpanded {
    visibility: visible;
  }

  .tags {
    width: 100%;
    min-height: 1.5rem;
  }

  && td.button {
    padding-bottom: 0.5rem;
  }

  .fast-actions-addresses {
    padding-left: 0.2rem;
    padding-right: 1rem;
    width: 1%;

    .fast-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      & > * + * {
        margin-left: 0.35rem;
      }

      .send-button {
        min-width: 6.5rem;
      }
    }
  }

  && .ui--AddressInfo .ui--FormatBalance {
    .ui--Icon, .icon-void {
      margin-left: 0.7rem;
      margin-right: 0.3rem
    }
  }
`);
