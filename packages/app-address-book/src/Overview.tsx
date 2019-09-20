// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React, { useState } from 'react';
import { Button, CardGrid } from '@polkadot/react-components';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { withMulti, withObservable } from '@polkadot/react-api';

import CreateModal from './modals/Create';
import Address from './Address';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
  addresses?: SubjectInfo[];
}

function Overview ({ addresses, onStatusChange, t }: Props): React.ReactElement<Props> {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const emptyScreen = !isCreateOpen && (!addresses || Object.keys(addresses).length === 0);

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);

  return (
    <CardGrid
      buttons={
        <Button.Group>
          <Button
            isPrimary
            label={t('Add contact')}
            labelIcon='add'
            onClick={_toggleCreate}
          />
        </Button.Group>
      }
      isEmpty={emptyScreen}
      emptyText={t('No contacts found.')}
    >
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {addresses && Object.keys(addresses).map((address): React.ReactNode => (
        <Address
          address={address}
          key={address}
        />
      ))}
    </CardGrid>
  );
}

export default withMulti(
  Overview,
  translate,
  withObservable(addressObservable.subject, { propName: 'addresses' })
);
