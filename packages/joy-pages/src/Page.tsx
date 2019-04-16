import React from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';

type Props = {
  md: string
};

export default class Page extends React.PureComponent<Props> {
  render () {
    return (
      <main className='JoyPage JoyViewMD'>
        <ReactMarkdown source={this.props.md} escapeHtml={false} />
      </main>
    );
  }
}
