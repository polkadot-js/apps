import * as React from 'react';
import './Tile.css';
import { Icon } from './Icon';

export interface Props {
  title: string;
  icon: string;
  children?: React.ReactNode;
}

export function Tile (props: Props) {
  return (
    <div className='Tile'>
      <Icon src={props.icon} alt={props.title} />
      <span className='Tile-label'>{props.title}</span>
      <span className='Tile-content'>{props.children}</span>
    </div>
  );
}
