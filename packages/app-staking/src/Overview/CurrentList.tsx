// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ValidatorFilter, RecentlyOfflineMap } from '../types';

import React from 'react';
import styled from 'styled-components';
import { Dropdown } from '@polkadot/ui-app';

import translate from '../translate';
import Address from './Address';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  current: Array<string>,
  lastAuthor?: string,
  lastBlock: string,
  next: Array<string>,
  recentlyOffline: RecentlyOfflineMap
};

type State = {
  filter: ValidatorFilter,
  filterOptions: Array<{ text: React.ReactNode, value: ValidatorFilter }>
};

const Wrapper = styled.div`
  .filter {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.75rem;

    > div {
      max-width: 35rem;
    }
  }
`;

class CurrentList extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      filter: 'all',
      filterOptions: [
        { text: t('Show all validators and intentions'), value: 'all' },
        { text: t('Show only my nominations'), value: 'iNominated' },
        { text: t('Show only with nominators'), value: 'hasNominators' },
        { text: t('Show only without nominators'), value: 'noNominators' },
        { text: t('Show only with warnings'), value: 'hasWarnings' },
        { text: t('Show only without warnings'), value: 'noWarnings' }
      ]
    };
  }

  render () {
    const { t } = this.props;
    const { filter, filterOptions } = this.state;
    return (
      <Wrapper>
        <div className='filter'>
          <Dropdown
            help={t('Select which validators/intentions you want to display.')}
            label={t('filter')}
            onChange={this.onChangeFilter}
            options={filterOptions}
            value={filter}
          />
        </div>
        <div className='validator--ValidatorsList ui--flex-medium'>
          <div className='validator--current'>
            {this.renderCurrent()}
          </div>
          <div className='validator--next'>
            {this.renderNext()}
          </div>
        </div>
      </Wrapper>
    );
  }

  private renderCurrent () {
    const { current, t } = this.props;

    return (
      <>
        <h1>
          {t('validators', {
            replace: {
              count: current.length
            }
          })}
        </h1>
        {this.renderColumn(current, t('validator (stash)'))}
      </>
    );
  }

  private renderNext () {
    const { next, t } = this.props;

    return (
      <>
        <h1>{t('next up')}</h1>
        {this.renderColumn(next, t('intention (stash)'))}
      </>
    );
  }

  private renderColumn (addresses: Array<string>, defaultName: string) {
    const { balances, lastAuthor, lastBlock, recentlyOffline, t } = this.props;
    const { filter } = this.state;

    if (addresses.length === 0) {
      return (
        <div>{t('no addresses found')}</div>
      );
    }

    return (
      <div>
        {addresses.map((address) => (
          <Address
            address={address}
            balances={balances}
            defaultName={defaultName}
            key={address}
            filter={filter}
            lastAuthor={lastAuthor}
            lastBlock={lastBlock}
            recentlyOffline={recentlyOffline}
          />
        ))}
      </div>
    );
  }
  private onChangeFilter = (filter: ValidatorFilter): void => {
    this.setState({ filter });
  }
}

export default translate(CurrentList);
