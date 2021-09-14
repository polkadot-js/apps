// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
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
      <Balances address={address} />
      <Identity
        address={address}
        identity={identity}
      />
      <Multisig
        isMultisig={flags.isMultisig}
        meta={meta}
      />
      <section>
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

  max-width: 30.42rem;
  min-width: 30.42rem;

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
    margin: -1rem -1rem 1rem -1rem;
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
    &:not(:last-child) {
      margin-bottom: 1.4rem;
    }

    & :last-child {
      margin-top: auto;
    }

    .ui--AddressMenu-sectionHeader {
      display: inline-flex;
      color: var(--color-text);
      margin-bottom: 0.4rem;
      width: 100%;

      & > :first-child {
        flex: 1;
      }
    }
  }

  .ui--AddressMenu-identity {
    .ui--AddressMenu-identityTable {
      font-size: 0.93rem;
      margin-top: 0.3rem;

      .tr {
        display: inline-flex;
        align-items: center;
        width: 100%;

        .th {
          font-weight: var(--font-weight-normal);
          text-align: right;
          flex-basis: 20%;

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
    }

    .parent, .subs {
      padding: 0 !important;
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
    color:  ${colorLink};
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
`);
