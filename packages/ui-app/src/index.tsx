// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '@polkadot/ui-settings';
import './i18n';
import './styles';

import { BareProps } from './types';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Api } from '@polkadot/ui-api/index';

export { default as AddressMini } from './AddressMini';
export { default as AddressRow } from './AddressRow';
export { default as AddressSummary } from './AddressSummary';
export { default as Balance } from './Balance';
export { default as Button } from './Button';
export { default as Call } from './Call';
export { default as CardSummary } from './CardSummary';
export { default as Chart } from './Chart';
export { default as CopyButton } from './CopyButton';
export { default as Dropdown } from './Dropdown';
export { default as Event } from './Event';
export { default as Icon } from './Icon';
export { default as IdentityIcon } from './IdentityIcon';
export { default as Input } from './Input';
export { default as InputAddress } from './InputAddress';
export { default as InputError } from './InputError';
export { default as InputExtrinsic } from './InputExtrinsic';
export { default as InputFile } from './InputFile';
export { default as InputNumber } from './InputNumber';
export { default as InputRpc } from './InputRpc';
export { default as InputStorage } from './InputStorage';
export { default as Labelled } from './Labelled';
export { default as Menu } from './Menu';
export { default as Modal } from './Modal';
export { default as Output } from './Output';
export { default as Password } from './Password';
export { default as Progress } from './Progress';
export { default as Static } from './Static';
export { default as Status } from './Status';
export { default as Tabs } from './Tabs';

type Props = BareProps & {
  url?: string
};

export default function createApp (App: React.ComponentType<BareProps>, { className, style, url }: Props, rootId: string = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <Api url={url}>
      <HashRouter>
        <App
          className={className}
          style={style}
        />
      </HashRouter>
    </Api>,
    rootElement
  );
}
