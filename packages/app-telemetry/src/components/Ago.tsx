import * as React from 'react';
import './Tile.css';
import { timestamp, Types } from '../../../app-telemetry-common/src';

export interface Props {
  when: Types.Timestamp;
}

export interface State {
  now: Types.Timestamp;
}

const tickers = new Map<Ago, (ts: Types.Timestamp) => void>();

function tick () {
  const now = timestamp();

  for (const ticker of tickers.values()) {
    ticker(now);
  }

  setTimeout(tick, 100);
}

tick();

export class Ago extends React.Component<Props, State> {
  public static timeDiff = 0 as Types.Milliseconds;

  public state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      now: (timestamp() - Ago.timeDiff) as Types.Timestamp
    };
  }

  public componentWillMount () {
    tickers.set(this, (now) => {
      this.setState({
        now: (now - Ago.timeDiff) as Types.Timestamp
      });
    })
  }

  public componentWillUnmount () {
    tickers.delete(this);
  }

  public render () {
    if (this.props.when === 0) {
      return <span>-</span>;
    }

    const ago = Math.max(this.state.now - this.props.when, 0) / 1000;

    let agoStr: string;

    if (ago < 10) {
      agoStr = `${ago.toFixed(1)}s`;
    } else if (ago < 60) {
      agoStr = `${ago | 0}s`;
    } else {
      agoStr = `${ ago / 60 | 0}m`;
    }

    return <span title={new Date(this.props.when).toUTCString()}>{agoStr} ago</span>
  }
}
