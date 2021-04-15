// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// and @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, Dropdown, Input, Toggle } from '@canvas-ui/react-components';
import { BareProps as Props } from '@canvas-ui/react-components/types';
import { useEndpointOptions, useEndpoints, useSettings } from '@canvas-ui/react-hooks';
import { classes } from '@canvas-ui/react-util';
import React, { useMemo } from 'react';
import styled from 'styled-components';

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
        text: t<string>('Dark theme'),
        value: true
      },
      {
        text: t<string>('Light theme'),
        value: false
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
          label={t<string>('Node to connect to')}
          onChange={onChangeUrl}
          options={endpointOptions}
          value={url}
        />
        <div>
          <Toggle
            className='settings--customToggle'
            defaultValue={isCustom}
            label={t<string>('Use custom endpoint')}
            onChange={onChangeCustom}
          />
          {isCustom && (
            <Input
              className='custom-url'
              defaultValue={url}
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
            label={t<string>('Save')}
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
