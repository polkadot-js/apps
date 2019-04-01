import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import translate from './translate';
import { Asset, buildApiUrl } from './utils';
import metamocks from './metamocks';

// TODO delete all this mocking stuff once integrated w/ runtime module for storage:
let mockIdx = 0;
function nextMock () {
  const mock = metamocks[mockIdx];
  mockIdx++;
  if (mockIdx === metamocks.length) {
    mockIdx = 0;
  }
  return mock;
}

type Props = ApiProps & I18nProps & {};

type State = {
  assets?: Asset[]
};

class Component extends React.PureComponent<Props, State> {

  state: State = {};

  componentDidMount () {
    axios
      .get<{ contents: Asset[] }>(buildApiUrl())
      .then(res => {
        const { contents: assets } = res.data;
        this.setState({ assets });
      });
  }

  render () {
    mockIdx = 0;
    const { assets } = this.state;
    if (assets === undefined) return <em>Loading...</em>;
    else if (assets.length === 0) return <em>No assets found.</em>;
    else return this.renderAssets(assets);
  }

  private renderAssets (assets: Asset[]) {
    return (
      <div>
        <div className='MediaGrid'>
        {assets.map(({ name, size }, i) => {
          const mock = nextMock();
          return (
            <Link className='MediaCell' key={i} to={`/media/play/${name}`}>
              <div className='CellContent'>
                <div className='ThumbBox'>
                  <img className='ThumbImg' src={mock.thumbnail} />
                </div>
                <div><b>{name}</b> ({size} bytes)</div>
              </div>
            </Link>
          );
        })}
        </div>
      </div>
    );
  }
}

export default translate(Component);
