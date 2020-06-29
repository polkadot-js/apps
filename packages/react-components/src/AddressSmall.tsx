// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Icon, Popup } from '@polkadot/react-components';
import { AccountId, Address } from '@polkadot/types/interfaces';

import AccountIndex from './AccountIndex';
import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';
import StatusContext from './Status/Context';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  toggle?: any;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ className, defaultName, onClickName, overrideName, toggle, value }: Props): React.ReactElement<Props> {
  const { queueAction } = useContext(StatusContext);

  const _onCopy = (): void => {
    queueAction && queueAction({
      account: value as string,
      action: t('clipboard'),
      status: 'queued',
      message: t('address copied')
    });
  };

  const { t } = useTranslation();
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <Popup
        content={
          <div>
            {t('Click to copy public address')}
          </div>
        }
        trigger={
          // [[IdentityIcon]] is not consuming all props, preventing trigger from firing
          // https://github.com/Semantic-Org/Semantic-UI-React/issues/1187#issuecomment-273988903
          // wrapping in intermediate <div> as a workaround
          <div className='ui--IdentityIconTrigger'>
            <IdentityIcon
              size={32}
              value={value as Uint8Array}
            />
          </div>
        }
      />
      <Popup
        hoverable={true}
        content={
          <CopyToClipboard text={value as string} onCopy={_onCopy}>
            <div>{value}<Icon name='copy outline'/></div>
          </CopyToClipboard>
        }
        trigger={
          <div className='nameInfo'>
            <AccountName
              className={(overrideName || !onClickName) ? '' : 'name--clickable'}
              defaultName={defaultName}
              override={overrideName}
              onClick={onClickName}
              toggle={toggle}
              value={value}
            />
            <AccountIndex value={value}/>
          </div>
        }/>
    </div>
  );
}

export default styled(AddressSmall)`
  vertical-align: middle;
  white-space: nowrap;

  .name--clickable {
    cursor: pointer;
  }

  .ui--IdentityIcon,
  .ui--IdentityIconTrigger,
  .nameInfo {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .nameInfo {
    > div {
      max-width: 16rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
