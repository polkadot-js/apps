// Copyright 2017-2021 @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createEndpoints } from '@canvas-ui/apps-config/settings';
import { useApi } from '@canvas-ui/react-hooks';
import { UseEndpoints } from '@canvas-ui/react-hooks/types';
import { classes } from '@canvas-ui/react-util';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';

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
