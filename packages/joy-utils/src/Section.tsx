import React from 'react';
import { BareProps } from '@polkadot/ui-app/types';

type Props = BareProps & {
  title?: string
};

type State = {};

export default class Section extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { children, title } = this.props;
    return (
      <section className='JoySection'>
        {title && <h2 className='JoySection-title'>{title}</h2>}
        <div>{children}</div>
      </section>
    );
  }
}
