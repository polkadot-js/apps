// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

module.exports = function container (diameter: number, background: string = 'white', className: string = '', _style: { [string]: string } = {}): HTMLElement {
  const element = document.createElement('div');
  const style = Object.assign({
    background,
    borderRadius: `${diameter / 2}px`,
    display: 'inline-block',
    height: `${diameter}px`,
    margin: '0px',
    overflow: 'hidden',
    padding: '0px',
    width: `${diameter}px`
  }, _style);

  element.className = className;
  element.style.background = background;

  // FIXME Flow seems to believe element.style[key] has number keys
  // flowlint-next-line unclear-type:off
  Object.keys(style).forEach((key: any) => {
    element.style[key] = style[key];
  });

  return element;
};
