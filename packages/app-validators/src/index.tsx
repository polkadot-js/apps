// Copyright 2017-2018 @polkadot/app-validators authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';
import './index.css';
import React from 'react';
import storage from '@polkadot/storage';

import translate from './translate';
import classes from '@polkadot/ui-app/util/classes';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import encodeAddress from '@polkadot/util-keyring/address/encode';

import ValidatorsList from './ValidatorsList';
import IntensionsList from './IntensionsList';

type Props = BareProps & {
  intentions?: Array<string>
  validators?: Array<string>,
};

type State = {
  queue: Array<StorageQuery>
};

const transformAddresses = (publicKeys: Array<Uint8Array>) =>
  publicKeys.map(encodeAddress);

class App extends React.PureComponent<Props> {
  render () {
    const { className, intentions = [], style, validators = [] } = this.props;

    return (
      <div
        className={classes('staking--App', className)}
        style={style}
      >
        <h1>Validators: {validators.length}</h1>
        {<ValidatorsList
          validators={validators}
        />}

     <h1>Intensions: {intentions.length}</h1>
        {<IntensionsList
          intentions={intentions}
        />}
      </div>
    );
  }
}

export default withMulti(
  App,
  withStorage(
    storage.staking.public.intentions,
    {
      propName: 'intentions',
      transform: transformAddresses
    }
  ),
  withStorage(
    storage.session.public.validators,
    {
      propName: 'validators',
      transform: transformAddresses
    }
  )
);
