// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import Labelled from '@polkadot/ui-app/Labelled';
import withApi from '@polkadot/ui-react-rx/with/api';
import isHex from '@polkadot/util/is/hex';

import translate from './translate';

type Props = ApiProps & I18nProps & {};

type State = {
  hash: string
  isValid: boolean
};

class Query extends React.PureComponent<Props, State> {
  state: State = {
    hash: '',
    isValid: false
  };

  render () {
    const { apiMethods, t } = this.props;
    const { hash, isValid } = this.state;

    if (!apiMethods.chain_getBlock) {
      return null;
    }

    return (
      <div className='explorer--Query'>
        <div className='ui--row'>
          <div className='small' />
          <div className='storage--Query-actionrow medium'>
            <Input
              className='storage--Query-actionrow-hash'
              isError={!isValid && hash.length !== 0}
              placeholder={t('query', {
                defaultValue: 'block hash to query'
              })}
              onChange={this.setHash}
            />
            <Labelled className='storage--Query-actionrow-button'>
              <Button
                icon='play'
                isDisabled={!isValid}
                isPrimary
                onClick={this.onQuery}
              />
            </Labelled>
          </div>
        </div>
      </div>
    );
  }

  private setHash = (hash: string) => {
    this.setState({
      hash,
      isValid: isHex(hash, 256)
    });
  }

  private onQuery = () => {
    const { hash } = this.state;

    window.location.hash = `/explorer/hash/${hash}`;
  }
}

export default translate(withApi(Query));
