// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainFull } from '@polkadot/api-derive/types';
import { Bytes, Option } from '@polkadot/types';

import FileSaver from 'file-saver';
import React from 'react';
import { Card, IconLink, Labelled, Output, Static } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { parachainName } from '../util';

interface Props {
  parachain: DeriveParachainFull;
}

function Details ({ parachain: { heads, id, info } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const onDownload = (): void => {
    try {
      api.query.parachains
        .code<Option<Bytes>>(id)
        .then((code) => {
          if (code.isSome) {
            const blob = new Blob([code.unwrap().toU8a().buffer], { type: 'application/wasm' });

            FileSaver.saveAs(blob, `${id.toString()}_${parachainName(t, info)}.wasm`);
          }
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Static
        help={t<string>('The scheduling setting for this parachain.')}
        isFull
        label={t<string>('scheduling')}
        value={info?.scheduling?.toString() || t<string>('Unknown')}
      />
      {heads && (
        <Output
          help={t<string>('Most recent head data')}
          isFull
          isMonospace
          label={t<string>('heads')}
          value={heads.toHex()}
          withCopy
        />
      )}
      <Labelled
        help={t<string>('The compiled runtime WASM for this parachain.')}
        isFull
        label={t<string>('code')}
      >
        <div
          className='ui--Static ui selection dropdown'
          onClick={onDownload}
        >
          <IconLink
            icon='download'
            label={t<string>('Download')}
            onClick={onDownload}
          />
        </div>
      </Labelled>
    </Card>
  );
}

export default React.memo(Details);
