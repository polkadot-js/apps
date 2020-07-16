// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button, Input, Dropdown, Toggle } from '@polkadot/react-components';
import { classes, useEndpointOptions } from '@polkadot/react-components/util';
import { useEndpoints, useSettings } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

function SettingsApp ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isChanged, onChangeKey, save, saveAndReload } = useSettings();
  const endpointState = useEndpoints(onChangeKey('apiUrl'));
  const endpointOptions = useEndpointOptions(endpointState, t);

  const { isCustom, isValid, onChangeCustom, onChangeUrl, url } = endpointState;

  const themeOptions = useMemo(
    () => ([
      {
        value: true,
        text: t('Dark theme')
      },
      {
        value: false,
        text: t('Light theme')
      }
    ]),
    [t]
  );

  return (
    <main className={classes('settings--App', className)}>
      <header>
        <h1>{t<string>('Settings')}</h1>
      </header>
      <section>
        <Dropdown
          isDisabled={isCustom}
          label={t('Node to connect to')}
          onChange={onChangeUrl}
          options={endpointOptions}
          value={url}
        />
        <div>
          <Toggle
            className='settings--customToggle'
            defaultValue={isCustom}
            label={t('Use custom endpoint')}
            onChange={onChangeCustom}
          />
          {isCustom && (
            <Input
              defaultValue={url}
              className='custom-url'
              isError={!isValid}
              onChange={onChangeUrl}
              withLabel={false}
            />
          )}
        </div>
        <Dropdown
          defaultValue={true}
          isDisabled
          label={t<string>('Theme')}
          options={themeOptions}
        />
      </section>
      <footer>
        <Button.Group>
          <Button
            isDisabled={isChanged === null}
            isPrimary
            label={t('Save')}
            onClick={
              isChanged
                ? saveAndReload
                : save
            }
          />
        </Button.Group>
      </footer>
    </main>
  );
}

export default styled(React.memo(SettingsApp))`
  .custom-url {
    margin-top: 0.5rem;
  }
`;
