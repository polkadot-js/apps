import React from 'react';
import ReactMarkdown from 'react-markdown';
import { truncate } from 'lodash';

import { Bytes } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';
import { withCalls } from '@polkadot/ui-api/index';

import { nonEmptyStr } from '../index';
import './Memo.css';
import { Link } from 'react-router-dom';

const remark = require('remark');
const strip = require('strip-markdown');
const mdStripper = remark().use(strip);

type Props = {
  accountId: string,
  memo?: Bytes,
  preview?: boolean,
  className?: string,
  style?: any
};

class Component extends React.PureComponent<Props> {

  private mdToPlainText = (md: string): string => {
    if (nonEmptyStr(md)) {
      try {
        return mdStripper.processSync(md).toString().trim();
      } catch (err) {
        console.log('Failed to convert markdown to plain text', err);
      }
    }
    return md;
  }

  renderMemo () {
    const { memo, preview = true, accountId } = this.props;
    if (memo && !memo.isEmpty) {
      const md = u8aToString(memo).trim();
      if (preview) {
        const plainText = this.mdToPlainText(md);
        const previewText = truncate(plainText, { length: 80, omission: '…view full memo' });
        return (
          <span className='JoyMemo--preview'>
            <Link to={`/addresses/memo/${accountId}`}>{previewText}</Link>
          </span>
        );
      } else {
        return <ReactMarkdown className='JoyMemo--full' source={md} linkTarget='_blank' />;
      }
    } else {
      return <em className='JoyMemo--empty'>Memo is empty.</em>;
    }
  }

  render () {
    const { className, style } = this.props;
    return <div className={className} style={style}>{this.renderMemo()}</div>;
  }
}

export default withCalls<Props>(
  ['query.memo.memo',
    { paramName: 'accountId', propName: 'memo' }]
)(Component);
