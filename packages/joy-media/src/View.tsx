import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import DPlayer from 'react-dplayer';
import APlayer from 'react-aplayer';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { Option } from '@polkadot/types/codec';
import { u8aToString, stringToU8a, formatNumber } from '@polkadot/util';

import translate from './translate';
import { withStorageProvider, StorageProviderProps } from './StorageProvider';
import { DataObject, ContentMetadata, ContentId } from './types';
import { MutedText } from '@polkadot/joy-utils/MutedText';

type Asset = {
  contentId: string,
  data: DataObject,
  meta: ContentMetadata
};

const PLAYER_COMMON_PARAMS = {
  lang: 'en',
  autoplay: true,
  theme: '#2185d0'
};

type ViewProps = ApiProps & I18nProps & StorageProviderProps & {
  contentId: ContentId,
  contentType?: string,
  dataObjectOpt?: Option<DataObject>,
  metadataOpt?: Option<ContentMetadata>,
  preview?: boolean
};

class InnerView extends React.PureComponent<ViewProps> {

  render () {
    const { dataObjectOpt, metadataOpt, preview = false } = this.props;
    if (!dataObjectOpt || !metadataOpt
      || dataObjectOpt.isNone || metadataOpt.isNone) {
      return null;
    }

    const asset = {
      contentId: u8aToString(this.props.contentId),
      data: dataObjectOpt.unwrap(),
      meta: metadataOpt.unwrap()
    };

    return preview
      ? this.renderPreview(asset)
      : this.renderPlayer(asset);
  }

  private renderPreview ({ contentId, data, meta }: Asset) {
    const { added_at } = meta;
    const { name, thumbnail } = meta.parseJson();

    return (
      <Link className='MediaCell' to={`/media/play/${contentId}`}>
        <div className='CellContent'>
          <div className='ThumbBox'>
            <img className='ThumbImg' src={thumbnail} />
          </div>
          <div><h3>{name}</h3></div>
          <MutedText smaller>{new Date(added_at.time).toLocaleString()}</MutedText>
          <MutedText smaller>{formatNumber(data.size_in_bytes)} bytes</MutedText>
        </div>
      </Link>
    );
  }

  private renderPlayer ({ contentId, meta }: Asset) {
    const { added_at } = meta;
    const { name, description, thumbnail: cover } = meta.parseJson();

    const { storageProvider } = this.props;
    const url = storageProvider.buildApiUrl(contentId);

    const { contentType = 'video/video' } = this.props;
    const prefix = contentType.substring(0, contentType.indexOf('/'));

    const content = () => {
      if (prefix === 'video') {
        const video = { url, name, pic: cover };
        return <DPlayer video={video} {...PLAYER_COMMON_PARAMS} />;
      } else if (prefix === 'audio') {
        const audio = { url, name, cover };
        return <APlayer audio={audio} {...PLAYER_COMMON_PARAMS} />;
      } else {
        return <em>Unsupported type of content: {contentType}</em>;
      }
    };

    return (
      <div className='PlayBox'>
        {content()}
        <div className='ContentHeader'>
          <a className='ui button outline DownloadBtn' href={`${url}?download`}><i className='cloud download icon'></i> Download</a>
          <h1>{name}</h1>
        </div>
        <div className='smaller grey text'>Published on {new Date(added_at.time).toLocaleString()}</div>
        { description && <ReactMarkdown className='JoyMemo--full ContentDesc' source={description.toString()} linkTarget='_blank' />}
      </div>
    );
  }
}

export const View = withMulti(
  InnerView,
  translate,
  withStorageProvider,
  withCalls<ViewProps>(
    ['query.dataDirectory.dataObjectByContentId', { paramName: 'contentId', propName: 'dataObjectOpt' } ],
    ['query.dataDirectory.metadataByContentId', { paramName: 'contentId', propName: 'metadataOpt' } ]
  )
);

type PlayProps = ApiProps & I18nProps & StorageProviderProps & {
  match: {
    params: {
      assetName: string
    }
  }
};

type PlayState = {
  contentType?: string,
  contentTypeRequested: boolean
};

class InnerPlay extends React.PureComponent<PlayProps, PlayState> {

  state: PlayState = {
    contentTypeRequested: false
  };

  requestContentType (contentId: string) {
    console.log('Request content type...');

    const { storageProvider } = this.props;
    const url = storageProvider.buildApiUrl(contentId);
    this.setState({ contentTypeRequested: true });

    axios
      .head(url)
      .then(response => {
        const contentType = response.headers['content-type'] || 'video/video';
        this.setState({ contentType });
      });
  }

  render () {
    const { match: { params: { assetName } } } = this.props;
    try {
      const contentId = new ContentId(stringToU8a(assetName));
      const { contentType, contentTypeRequested } = this.state;
      if (typeof contentType === 'string') {
        return <View contentId={contentId} contentType={contentType} />;
      } else if (!contentTypeRequested) {
        this.requestContentType(assetName);
      }
      return <em>Loading...</em>;
    } catch (err) {
      console.log('Invalid content ID:', assetName);
    }
    return <em>Content was not found by ID: {assetName}</em>;
  }
}

export const Play = withMulti(
  InnerPlay,
  translate,
  withStorageProvider
);
