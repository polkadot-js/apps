// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { BareProps } from './types';

import './settings';
import './i18n';
import './styles';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Api } from '@polkadot/ui-react-rx/index';

import AddressMini from './AddressMini';
import AddressRow from './AddressRow';
import AddressSummary from './AddressSummary';
import Balance from './Balance';
import Button from './Button';
import Call from './Call';
import CardSummary from './CardSummary';
import Chart from './Chart';
import CopyButton from './CopyButton';
import Dropdown from './Dropdown';
import Icon from './Icon';
import Input from './Input';
import InputAddress from './InputAddress';
import InputError from './InputError';
import InputExtrinsic from './InputExtrinsic';
import InputFile from './InputFile';
import InputNumber from './InputNumber';
import InputRpc from './InputRpc';
import InputStorage from './InputStorage';
import Labelled from './Labelled';
import Menu from './Menu';
import Modal from './Modal';
import Output from './Output';
import Params from './Params';
import Password from './Password';
import Progress from './Progress';
import Static from './Static';
import Tabs from './Tabs';

type Props = BareProps & {
  api?: RpcRxInterface,
  provider?: ProviderInterface,
  url?: string
};

export {
  AddressMini,
  AddressRow,
  AddressSummary,
  Balance,
  Button,
  Call,
  CardSummary,
  Chart,
  CopyButton,
  Dropdown,
  Icon,
  Input,
  InputAddress,
  InputError,
  InputExtrinsic,
  InputFile,
  InputNumber,
  InputRpc,
  InputStorage,
  Labelled,
  Menu,
  Modal,
  Output,
  Params,
  Password,
  Progress,
  Static,
  Tabs
};

export default function createApp (App: React.ComponentType<BareProps>, { api, className, provider, style, url }: Props = {}, rootId: string = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <Api
      api={api}
      provider={provider}
      url={url}
    >
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
