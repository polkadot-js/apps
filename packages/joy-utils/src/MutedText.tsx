import React from 'react';

type Props = {
  children?: React.ReactNode,
  smaller?: boolean
};

export const MutedText = ({ children, smaller = false }: Props) =>
  <div className={`grey text ${smaller ? 'smaller' : ''}`}>{children}</div>;

export default MutedText;
