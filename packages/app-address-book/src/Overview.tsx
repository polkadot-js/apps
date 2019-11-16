// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useState } from 'react';
import { Button, CardGrid } from '@polkadot/react-components';
import { useAddresses } from '@polkadot/react-hooks';

import CreateModal from './modals/Create';
import Address from './Address';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
}

function Overview ({ onStatusChange, t }: Props): React.ReactElement<Props> {
  const { hasAddresses, allAddresses } = useAddresses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const emptyScreen = !isCreateOpen && !hasAddresses;

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);

  return (
    <CardGrid
      buttons={
        <Button.Group>
          <Button
            icon='add'
            isPrimary
            label={t('Add contact')}
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
      {allAddresses.map((address): React.ReactNode => (
        <Address
          address={address}
          key={address}
        />
      ))}
    </CardGrid>
  );
}

export default translate(Overview);
