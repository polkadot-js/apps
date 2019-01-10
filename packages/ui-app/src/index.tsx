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
import Event from './Event';
import Icon from './Icon';
import IdentityIcon from './IdentityIcon';
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
import Password from './Password';
import Progress from './Progress';
import Static from './Static';
import Status from './Status';
import Tabs from './Tabs';

type Props = BareProps & {
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
  Event,
  Icon,
  IdentityIcon,
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
  Password,
  Progress,
  Static,
  Status,
  Tabs
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
