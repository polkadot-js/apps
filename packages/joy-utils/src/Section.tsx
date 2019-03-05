import React from 'react';
import { BareProps } from '@polkadot/ui-app/types';

type Props = BareProps & {
  title?: JSX.Element | string,
  level?: number
};

type State = {};

export default class Section extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { children } = this.props;
    return (
      <section className='JoySection'>
        {this.renderTitle()}
        <div>{children}</div>
      </section>
    );
  }

  private renderTitle = () => {
    const { title, level = 2 } = this.props;
    if (!title) return null;

    const className = 'JoySection-title';
    return React.createElement(
      `h${level}`,
      { className },
      title
    );
  }
}
