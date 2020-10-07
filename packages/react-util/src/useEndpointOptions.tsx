// Copyright 2017-2020 @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { UseEndpoints } from '@canvas-ui/react-hooks/types';

import React, { useMemo } from 'react';
import { createEndpoints } from '@canvas-ui/apps-config/settings';

export default function useEndpointOptions ({ isCustom, url }: UseEndpoints, t: TFunction, useShortText?: boolean): React.ReactNode[] {
  return useMemo(
    () => ([
      ...createEndpoints(t).map(({ shortText, text, value }) => ({
        key: value,
        text: (
          <div className='chain-option'>
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
              <div className='chain-option'>
                {t<string>('Custom Node')}
              </div>
            ),
            value: url
          }]
          : []
      )
    ]),
    [isCustom, t, url, useShortText]
  );
}
