import React from 'react';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Vector } from '@polkadot/types/codec';

import translate from './translate';
import { ContentId } from './types';
import { View } from './View';

type Props = ApiProps & I18nProps & {
  contentIds?: Vector<ContentId>
};

class Component extends React.PureComponent<Props> {

  render () {
    const { contentIds } = this.props;
    if (contentIds === undefined) return <em>Loading...</em>;
    else if (contentIds.length === 0) return <em>No content found.</em>;
    else return this.renderPreviews(contentIds);
  }

  private renderPreviews (contentIds: Vector<ContentId>) {
    return (
      <div>
        <div className='MediaGrid'>
        {contentIds.map((contentId, i) =>
          <View key={i} contentId={contentId} preview={true} />
        )}
        </div>
      </div>
    );
  }
}

export default translate(
  withCalls<Props>(
    ['query.dataDirectory.knownContentIds', { propName: 'contentIds' } ]
  )(Component)
);
