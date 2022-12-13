// Copyright 2017-2022 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import Hash from '@polkadot/app-preimages/Preimages/Hash';
import usePreimage from '@polkadot/app-preimages/usePreimage';
import { CallExpander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  value: HexString;
}

function Call ({ className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const info = usePreimage(value);

  return (
    <tr className={ className }>
      <Hash value={value} />
      <td className='all'>
        {info?.proposal && (
          <CallExpander
            labelHash={t<string>('call')}
            value={info.proposal}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Call);
