// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { LinkExternal, Sidebar } from '@polkadot/react-components';
import { colorLink } from '@polkadot/react-components/styles/theme';
import { useAccountInfo } from '@polkadot/react-hooks';

import Balances from './Balances';
import Identity from './Identity';
import Multisig from './Multisig';
import SidebarEditableSection from './SidebarEditableSection';

interface Props {
  address: string;
  className?: string;
  dataTestId?: string;
  onClose: () => void;
  onUpdateName: () => void;
}

function FullSidebar ({ address, className = '', dataTestId, onClose, onUpdateName }: Props): React.ReactElement<Props> {
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const { accountIndex, flags, identity, meta } = useAccountInfo(address);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Sidebar
      className={`${className}${inEditMode ? ' inEditMode' : ''}`}
      dataTestId={dataTestId}
      onClose={onClose}
      position='right'
      sidebarRef={ref}
    >
      <div
        className='ui--AddressMenu-header'
        data-testid='sidebar-address-menu'
      >
        <SidebarEditableSection
          accountIndex={accountIndex}
          address={address}
          isBeingEdited={setInEditMode}
          onUpdateName={onUpdateName}
          sidebarRef={ref}
        />
      </div>
      <div className='ui--ScrollSection'>
        <Balances address={address} />
        <Identity
          address={address}
          identity={identity}
        />
        <Multisig
          isMultisig={flags.isMultisig}
          meta={meta}
        />
      </div>
      <section className='ui--LinkSection'>
        <LinkExternal
          data={address}
          isLogo
          isSidebar
          type='address'
        />
      </section>
    </Sidebar>
  );
}

export default React.memo(styled(FullSidebar)`
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
  max-width: 30.42rem;
  min-width: 30.42rem;
  overflow-y: hidden;
  padding: 0 0 3.286rem;

  input {
    width: auto !important;
  }

  .ui--AddressMenu-header {
    align-items: center;
    background: var(--bg-tabs);
    border-bottom: 1px solid var(--border-table);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.35rem 1rem 1rem 1rem;
  }

  .ui--AddressSection {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;


    width: 100%;

    .ui--AddressSection__AddressColumn {
      margin-left: 1rem;

      .ui--AccountName {
        max-width: 21.5rem;
        overflow: hidden;
      }
    }
  }

  .ui--AddressMenu-addr,
  .ui--AddressMenu-index {
    font: var(--font-mono);
    text-align: left;
    font-size: 0.857rem;
  }

  .ui--AddressMenu-addr {
    word-break: break-all;
    width: 26ch;
    margin: 0.571rem 0;
    color: var(--color-label);
  }

  .ui--AddressMenu-index {
    display: flex;
    flex-direction: row;

    label {
      font-size: 0.857rem;
      margin-right: 0.4rem;
      text-transform: capitalize;
    }
  }

  section {
    position: relative;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .ui--AddressMenu-sectionHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;

      margin-bottom: 0.57rem;
      width: 100%;

      color: var(--color-text);
      font-size: 1.143rem;
    }

    &.withDivider {
      padding-top: 1rem;

      ::before {
        position: absolute;
        top: 0;
        left: 0;

        content: '';
        width: 100%;
        height: 1px;
        background-color: var(--border-table);
      }
    }
  }

  .ui--AddressMenu-identity,
  .ui--AddressMenu-multisig {
    .ui--AddressMenu-identityTable,
    .ui--AddressMenu-multisigTable {
      font-size: 0.93rem;
      margin-top: 0.6rem;

      .tr {
        padding: 0.25rem 0;
        display: inline-flex;
        align-items: center;
        width: 100%;

        .th {
          text-transform: uppercase;
          color: var(--color-label);
          font-weight: var(--font-weight-normal);
          text-align: left;
          flex-basis: 25%;
          font-size: 0.714rem;

          &.top {
            align-self: flex-start;
          }
        }

        .td {
          flex: 1;
          overflow: hidden;
          padding-left: 0.6rem;
          text-overflow: ellipsis;
        }
      }

      .ui--AddressMini, .subs-number {
        margin-bottom: 0.4rem;
        padding: 0;
      }

      .subs-number {
        font-size: 1rem;
        margin-bottom: 0.714rem;
      }
    }

    .parent {
      padding: 0 !important;
    }
  }

  && .column {
    align-items: center;

    .ui--FormatBalance:first-of-type {
      margin-bottom: 0.4rem;
    }

    label:first-of-type {
      margin-bottom: 0.4rem;
      color: var(--color-text);
    }

    label {
      color: var(--color-label);
      text-transform: uppercase;
      font-size: 0.714rem;
    }

    .ui--FormatBalance, label {
      line-height: 1rem;
    }
  }

  .ui--AddressMenu-buttons {
    .ui--Button-Group {
      margin-bottom: 0;
    }
  }

  .ui--AddressMenu-tags,
  .ui--AddressMenu-flags {
    margin: 0.75rem 0 0;
    width: 100%;
  }

  .ui--AddressMenu-identityIcon {
    background: ${colorLink}66;
  }

  .ui--AddressMenu-actions {
    ul {
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 1rem;

      li {
        margin: 0.2rem 0;
      }
    }
  }

  .inline-icon {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    color: ${colorLink};
  }

  .name--input {
    .ui.input {
      margin: 0 !important;

      > input {
      }
    }
  }

  &.inEditMode {
    .ui--AddressMenu-flags {
      opacity: 60%;
    }
  }

  .ui--AddressMenu-multisig .th.signatories {
    align-self: flex-start;
  }

  .ui--ScrollSection {
    padding: 1rem;
    overflow: auto;
  }

  .ui--LinkSection {
    border-top: 1px solid var(--border-table);
    padding: 0.5rem 0 0.571rem;
    width: 100%;
    position: absolute;
    bottom: 0;

    span {
      margin: 0 0.5rem;
    }
  }
`);
