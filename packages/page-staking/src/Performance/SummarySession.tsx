// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { useTranslation } from "@polkadot/app-explorer/translate";

interface Props {
  className?: string;
  session: number;
  era: number;
}

function SummarySession ({ className, session, era }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
        <>
                <CardSummary label={t<string>('session')}>
                  #{formatNumber(session)}
                </CardSummary>

                <CardSummary
                  className={className}
                  label={t<string>('era')}
                >
                  #{formatNumber(era)}
                </CardSummary>

        </>
  );
}

export default React.memo(SummarySession);
