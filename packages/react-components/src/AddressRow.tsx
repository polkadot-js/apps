// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { useAccountInfo } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';

import { classes, toShortAddress } from './util';
import AccountName from './AccountName';
import IdentityIcon, { getIdentityTheme } from './IdentityIcon';
import Row, { RowProps } from './RowNew';
import Tags from './Tags';

export interface Props extends RowProps {
  isContract?: boolean;
  isValid?: boolean;
  label?: string;
  noDefaultNameOpacity?: boolean;
  value: AccountId | AccountIndex | Address | string;
  withSidebar?: boolean;
}

const DEFAULT_ADDR = '5'.padEnd(48, 'x');
const ICON_SIZE = 48;
// const ICON_SIZE_SMALL = 32;
// const EMPTY_INFO: DeriveAccountInfo = {
//   identity: {
//     judgements: []
//   }
// };

function AddressRow ({ buttons, children, className, defaultName, isContract = false, isDisabled, isInline, isValid: propsIsValid, label, overlay, style, type, value, withSidebar = false, withTags }: Props): React.ReactElement<Props> | null {
  const { accountIndex, isNull, name, onForgetAddress, onSaveName, onSaveTags, setName, setTags, tags } = useAccountInfo(value ? value.toString() : null, isContract);

  const isValid = !isNull && (propsIsValid || value || accountIndex);
  const Icon = value ? IdentityIcon : BaseIdentityIcon;

  return (
    <Row
      address={toShortAddress(value && isValid ? value : DEFAULT_ADDR)}
      buttons={buttons}
      className={className}
      icon={
        <Icon
          size={ICON_SIZE}
          value={value ? value.toString() : null}
        />
      }
      isDisabled={isDisabled}
      isEditableName
      isEditableTags
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onChangeTags={setTags}
      onSaveName={onSaveName}
      onSaveTags={onSaveTags}
      tags={tags}
    >
      {children}
      {overlay}
    </Row>
  );
}

// class AddressRow2 extends Row<ApiProps & Props, State> {
//   public state: State;

//   constructor (props: ApiProps & Props) {
//     super(props);

//     this.state = this.createState();
//   }

//   public static getDerivedStateFromProps ({ accounts_info = EMPTY_INFO, defaultName, isEditable, noDefaultNameOpacity, type, value }: Props, prevState: State): State | null {
//     const accountId = accounts_info.accountId || value;
//     const address = accountId
//       ? accountId.toString()
//       : DEFAULT_ADDR;
//     const [, isDefault, nameInner] = accounts_info.nickname
//       ? [true, false, accounts_info.nickname.toUpperCase()]
//       : getAddressName(address, type, defaultName || '<unknown>');
//     const name = isDefault && !noDefaultNameOpacity && !isEditable
//       ? <div className='ui--Row-placeholder'>{nameInner}</div>
//       : nameInner;
//     const tags = getAddressTags(address, type);
//     const state: Partial<State> = { tags };
//     let hasChanged = false;

//     if (address !== prevState.address) {
//       state.address = address;
//       hasChanged = true;
//     }

//     if (!prevState.isEditingName && name !== prevState.name) {
//       state.name = name as string;
//       hasChanged = true;
//     }

//     return hasChanged
//       ? state as State
//       : null;
//   }

//   public render (): React.ReactNode {
//     const { accounts_info = EMPTY_INFO, className, isContract, isDisabled, isInline, label, overlay, style, withTags } = this.props;
//     const { accountId, accountIndex } = accounts_info;
//     const isValid = this.props.isValid || accountId || accountIndex;

//     return (
//       <Row
//         className={className}
//         details={
//           <>
//             {label && <label className='account-label'>{label}</label>}
//             <AccountName
//               className='.ui--AddressRow-address-or-name'
//               value={accountId}
//               withMenu={!isDisabled}
//             />
//             <div className='ui--AddressRow-accountId'>
//               {toShortAddress(address)}
//             </div>
//             {accountIndex && (
//               <div className='ui--AddressRow-accountIndex'>
//                 {accountIndex.toString()}
//               </div>
//             )}
//             {!isContract && this.renderBalances()}
//             {withTags && tags && (
//               <Tags value={tags} />
//             )}
//           </>
//       }
//         icon={
//           <IdentityIcon
//             className=''
//             size={ICON_SIZE}
//             value={value}
//           />
//         }
//         isDisabled={isDisabled}
//         isInline={isInline}

//       >

//       </Row>
//     )

//     return (
//       <div
//         className={classes('ui--Row', isDisabled && 'isDisabled', !isValid && 'isInvalid', isInline && 'isInline', className)}
//         style={style}
//       >
//         <div className='ui--Row-base'>
//           {this.renderIcon()}
//           <div className='ui--Row-details'>
//             {label && <label className='account-label'>{label}</label>}
//             {this.renderAddressAndName()}
//             {this.renderAccountIndex()}
//             {!isContract && this.renderBalances()}
//             {this.renderTags()}
//           </div>
//           {this.renderButtons()}
//         </div>
//         {this.renderChildren()}
//         {overlay}
//       </div>
//     );
//   }

//   private createState (): State {
//     const { accounts_info = EMPTY_INFO, defaultName, type, value } = this.props;
//     const accountId = accounts_info.accountId || value;
//     const address = accountId
//       ? accountId.toString()
//       : DEFAULT_ADDR;
//     const [, , name] = getAddressName(address, type, defaultName || '<unknown>');
//     const tags = getAddressTags(address, type);

//     return {
//       ...this.state,
//       address,
//       name,
//       tags
//     };
//   }

//   protected renderAddressAndName (): React.ReactNode {
//     const { withAddressOrName = false } = this.props;

//     if (withAddressOrName) {
//       return this.renderName(true);
//     } else {
//       return (
//         <>
//           {this.renderName()}
//           {this.renderAddress()}
//         </>
//       );
//     }
//   }

//   private renderAddress (): React.ReactNode {
//     const { accounts_info = EMPTY_INFO, withIndexOrAddress = true } = this.props;
//     const { address } = this.state;
//     const { accountIndex } = accounts_info;

//     if (accountIndex && withIndexOrAddress) {
//       return null;
//     }

//     return (
//       <div className='ui--Row-accountId'>
//         {toShortAddress(address)}
//       </div>
//     );
//   }

//   private renderAccountIndex (): React.ReactNode {
//     const { accounts_info = EMPTY_INFO, withIndex = true, withIndexOrAddress = true, withSmallIcon } = this.props;
//     const { accountIndex } = accounts_info;

//     if (withSmallIcon || !accountIndex || !(withIndex || withIndexOrAddress)) {
//       return null;
//     }

//     return (
//       <div className='ui--Row-accountIndex'>
//         {accountIndex.toString()}
//       </div>
//     );
//   }

//   private renderBalances (): React.ReactNode {
//     const { accounts_info = EMPTY_INFO, extraInfo, stakingInfo, withBalance, withValidatorPrefs } = this.props;
//     const { accountId } = accounts_info;

//     if (!(withBalance || withValidatorPrefs) || !accountId) {
//       return null;
//     }

//     return (
//       <div className='ui--Row-balances'>
//         <AddressInfo
//           address={accountId}
//           extraInfo={extraInfo}
//           stakingInfo={stakingInfo}
//           withBalance={withBalance}
//           withValidatorPrefs={withValidatorPrefs}
//         />
//       </div>
//     );
//   }

//   private renderIcon (): React.ReactNode {
//     const { accounts_info = EMPTY_INFO, iconInfo, systemName, withIcon = true, withSmallIcon = false } = this.props;
//     const { address } = this.state;
//     const { accountId } = accounts_info;

//     if (!withIcon) {
//       return null;
//     }

//     // Since we do queries to storage in the wrapped example, we don't want
//     // to follow that route if we don't have a valid address.
//     const Component = accountId
//       ? IdentityIcon
//       : BaseIdentityIcon;
//     const theme = getIdentityTheme(systemName);

//     return (
//       <div className='ui--Row-icon'>
//         <Component
//           size={withSmallIcon ? ICON_SIZE_SMALL : ICON_SIZE}
//           theme={theme}
//           value={address}
//         />
//         {iconInfo && (
//           <div className='ui--Row-icon-info'>
//             {iconInfo}
//           </div>
//         )}
//       </div>
//     );
//   }

//   protected saveName = (): void => {
//     const { address, name } = this.state;
//     const trimmedName = name.trim();
//     const meta = {
//       name: trimmedName,
//       whenEdited: Date.now()
//     };

//     // Save only if the name was changed or if it's no empty.
//     if (trimmedName && address) {
//       try {
//         const currentKeyring = keyring.getPair(address);

//         currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
//       } catch (error) {
//         keyring.saveAddress(address, meta);
//       }
//     }

//     this.setState({ isEditingName: false });
//   }

//   protected saveTags = (): void => {
//     const { address, tags } = this.state;
//     const meta = {
//       tags,
//       whenEdited: Date.now()
//     };

//     if (address) {
//       try {
//         const currentKeyring = keyring.getPair(address);

//         currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
//       } catch (error) {
//         keyring.saveAddress(address, meta);
//       }

//       this.setState({ isEditingTags: false });
//     }
//   }
// }

export {
  DEFAULT_ADDR,
  AddressRow
};

export default React.memo(
  styled(AddressRow)`
    button.ui.icon.editButton {
      padding: 0em .3em .3em .3em;
      color: #2e86ab;
      background: none;
      /*trick to let the button in the flow but keep the content centered regardless*/
      margin-left: -2em;
      position: relative;
      right: -2.3em;
      z-index: 1;
    }

    .editSpan {
      white-space: nowrap;

      &:before {
        content: '';
      }
    }

    .ui--AddressRow-balances {
      display: flex;
      .column {
        display: block;

        label,
        .result {
          display: inline-block;
          vertical-align: middle;
        }
      }

      > span {
        text-align: left;
      }
    }

    .ui--AddressRow-placeholder {
      opacity: 0.5;
    }
  `
);

// withMulti(
//   styled(AddressRow as React.ComponentClass<Props & ApiProps, State>)`
//     ${styles}

//   `,
//   translate,
// );
