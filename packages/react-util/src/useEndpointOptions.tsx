// Copyright 2017-2020 @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { UseEndpoints } from '@canvas-ui/react-hooks/types';

import React, { useMemo } from 'react';
import { classes } from '@canvas-ui/react-util';
import { createEndpoints } from '@canvas-ui/apps-config/settings';
import { useApi } from '@canvas-ui/react-hooks';

export default function useEndpointOptions ({ isCustom, url }: UseEndpoints, t: TFunction, useShortText?: boolean): React.ReactNode[] {
  const { isApiConnected } = useApi();
  const className = classes('chain-option', !isApiConnected && 'isDisconnected');

  return useMemo(
    () => ([
      ...createEndpoints(t).map(({ shortText, text, value }) => ({
        key: value,
        text: (
          <div className={className}>
            {useShortText ? shortText : text}
          </div>
        ),
        value
      })),
      ...(
        isCustom
          ? [{
            key: url,
            text: (
              <div className={className}>
                {t<string>('Custom Node')}
              </div>
            ),
            value: url
          }]
          : []
      )
    ]),
    [className, isCustom, t, url, useShortText]
  );
}
