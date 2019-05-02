/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { I18nProps } from '@polkadot/ui-app/types';
import { Tracks } from '../../types';

import React from 'react';
import Moment from 'react-moment';
import ContentLoader, { List } from 'react-content-loader';
import translate from '@polkadot/app-transfer/translate';

import SUICard from 'semantic-ui-react/dist/commonjs/views/Card/Card';
import SUIIcon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import SUIImage from 'semantic-ui-react/dist/commonjs/elements/Image/Image';

import TrackApi from '../../api/trackApi';

type Props = I18nProps;

type State = {};

class TracksPage extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { t } = this.props;
    const tracks: Tracks = TrackApi.getAllTracks();

    return (
      <section className='cards'>
        {
          tracks.map(track => (
            <div className='card'>
              <SUICard key={String(track.id)}>
                {track.icon ? <SUIImage src={track.icon} /> : <ContentLoader />}
                <SUICard.Content>
                  <SUICard.Header>{track.title}</SUICard.Header>
                  <SUICard.Meta>
                    <span><SUIIcon name='clock' />{track.duration} &bull; {track.kind} &bull; {track.courses.length} Courses</span>
                  </SUICard.Meta>
                  <SUICard.Meta>
                    <span><SUIIcon name='calendar alternate' />{t('Released')}: <Moment format='D MMM YYYY' date={track.dateReleased} /></span>
                  </SUICard.Meta>
                  <SUICard.Meta>
                    <span><SUIIcon name='calendar' />{t('Last Updated')}: <Moment format='D MMM YYYY' date={track.dateLastUpdated} /></span>
                  </SUICard.Meta>
                  <details>
                    {track.description ? <SUICard.Description>{track.description}</SUICard.Description> : <List />}
                  </details>
                </SUICard.Content>
                <SUICard.Content extra>
                  {track.votesUp && <a><SUIIcon name='thumbs up' />{track.votesUp.toString()}&nbsp;&bull;&nbsp;</a>}
                  {track.xp && <a><SUIIcon name='certificate' />{track.xp.toString()}&nbsp;&bull;&nbsp;</a>}
                  {track.tags && track.tags.length && <a><SUIIcon name='tags' />{track.tags.toString()}&nbsp;&bull;&nbsp;</a>}
                </SUICard.Content>
              </SUICard>
            </div>
          ))
        }
      </section>
    );
  }
}

export default translate(TracksPage);
