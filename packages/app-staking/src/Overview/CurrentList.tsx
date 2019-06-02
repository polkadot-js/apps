// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ValidatorFilter, RecentlyOfflineMap } from '../types';

import React from 'react';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/ui-app';

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
    const { current, next, t } = this.props;
    const { filter, filterOptions } = this.state;
    return (
      <div>
        <FilterOverlay>
          <Dropdown
            help={t('Select which validators/intentions you want to display.')}
            label={t('filter')}
            onChange={this.onChangeFilter}
            options={filterOptions}
            value={filter}
          />
        </FilterOverlay>
        <Columar className='validator--ValidatorsList'>
          <Column header={t('validators')}>
            {this.renderColumn(current, t('validator (stash)'))}
          </Column>
          <Column header={t('next up')}>
            {this.renderColumn(next, t('intention (stash)'))}
          </Column>
        </Columar>
      </div>
    );
  }

  private renderColumn (addresses: Array<string>, defaultName: string) {
    const { balances, lastAuthor, lastBlock, recentlyOffline, t } = this.props;
    const { filter } = this.state;

    if (addresses.length === 0) {
      return (
        <article>{t('no addresses found')}</article>
      );
    }

    return addresses.map((address) => (
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
    ));
  }

  private onChangeFilter = (filter: ValidatorFilter): void => {
    this.setState({ filter });
  }
}

export default translate(CurrentList);
