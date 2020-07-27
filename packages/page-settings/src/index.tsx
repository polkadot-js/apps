// Copyright 2017-2020 @canvas-ui/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@canvas-ui/react-components/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button, Input, Dropdown, Toggle } from '@canvas-ui/react-components';
import { classes, useEndpointOptions } from '@canvas-ui/react-util';
import { useEndpoints, useSettings } from '@canvas-ui/react-hooks';

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
