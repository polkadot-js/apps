// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter, RecentlyOfflineMap } from '../types';

import React from 'react';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  balances?: DerivedBalancesMap;
  currentValidatorsControllersV1OrStashesV2: string[];
  lastAuthor?: string;
  lastBlock: string;
  next: string[];
  recentlyOffline: RecentlyOfflineMap;
}

interface State {
  filter: ValidatorFilter;
  filterOptions: { text: React.ReactNode; value: ValidatorFilter }[];
}

class CurrentList extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
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

  public render (): React.ReactNode {
    const { currentValidatorsControllersV1OrStashesV2, next, t } = this.props;
    const { filter, filterOptions } = this.state;
    return (
      <div>
        <FilterOverlay>
          <Dropdown
            onChange={this.onChangeFilter}
            options={filterOptions}
            value={filter}
            withLabel={false}
          />
        </FilterOverlay>
        <Columar className='validator--ValidatorsList'>
          <Column
            emptyText={t('No addresses found')}
            headerText={t('validators')}
          >
            {this.renderColumn(currentValidatorsControllersV1OrStashesV2, t('validator'))}
          </Column>
          <Column
            emptyText={t('No addresses found')}
            headerText={t('next up')}
          >
            {this.renderColumn(next, t('intention'))}
          </Column>
        </Columar>
      </div>
    );
  }

  private renderColumn (addresses: string[], defaultName: string): React.ReactNode {
    const { balances, lastAuthor, lastBlock, recentlyOffline } = this.props;
    const { filter } = this.state;

    return addresses.map((address): React.ReactNode => (
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
