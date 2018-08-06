// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  intentions?: Array<string>,
  validators?: Array<string>
};

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'overview': Overview,
  'actions': StakeList
};

const transformAddresses = (publicKeys: Array<Uint8Array>) =>
  publicKeys.map(encodeAddress);

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      action: 'overview'
    };
  }

  render () {
    const { className, intentions = [], style, t, validators = [] } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <div
        className={classes('staking--App', className)}
        style={style}
      >
        <Button.Group className='staking--App-navigation'>
          <Button
            isPrimary={action === 'overview'}
            onClick={this.selectOverview}
            text={t('app.overview', {
              defaultValue: 'Staking Overview'
            })}
          />
          <Button.Or />
          <Button
            isPrimary={action === 'actions'}
            onClick={this.selectActions}
            text={t('app.actions', {
              defaultValue: 'Account Actions'
            })}
          />
        </Button.Group>
        <Component
          intentions={intentions}
          validators={validators}
        />
      </div>
    );
  }

  selectActions = () => {
    this.setState({ action: 'actions' });
  }

  selectOverview = () => {
    this.setState({ action: 'overview' });
  }
}

export default withMulti(
  App,
  translate,
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
