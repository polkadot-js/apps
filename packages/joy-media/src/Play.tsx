import React from 'react';
import DPlayer from 'react-dplayer';
import APlayer from 'react-aplayer';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import translate from './translate';
import { buildApiUrl, fileNameWoExt, fileMetaByExt } from './utils';
import metamocks from './metamocks';

const PLAYER_COMMON_PARAMS = {
  lang: 'en',
  autoplay: true,
  theme: '#2185d0'
};

type Props = ApiProps & I18nProps & {
  match: {
    params: {
      assetName: string
    }
  }
};

class Component extends React.PureComponent<Props> {

  render () {
    const { match: { params: { assetName } } } = this.props;
    const url = buildApiUrl(assetName);
    const meta = fileMetaByExt(assetName);
    const cover = metamocks[1].thumbnail;  // TODO get thumbnail from Substrate.
    const name = fileNameWoExt(assetName); // TODO get content name from Substrate.
    const desc = metamocks[0].description; // TODO get description from Substrate.

    const content = () => {
      if (meta.isVideo) {
        const video = { url, name, pic: cover };
        return <DPlayer video={video} {...PLAYER_COMMON_PARAMS} />;
      } else if (meta.isAudio) {
        const audio = { url, name, cover };
        return <APlayer audio={audio} {...PLAYER_COMMON_PARAMS} />;
      } else {
        return <em>Unsupported file format.</em>;
      }
    };

    return <div className='PlayBox'>
      {content()}
      <h1>{fileNameWoExt(assetName)}</h1>
      <p>{desc}</p>
    </div>;
  }
}

export default translate(Component);
