import type { ItemRoute } from './types.js';
import React from 'react';
interface Props {
    className?: string;
    classNameText?: string;
    isLink?: boolean;
    isToplevel?: boolean;
    route: ItemRoute;
}
declare function Item({ className, classNameText, isLink, isToplevel, route: { Modal, href, icon, name, text, useCounter } }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof Item>;
export default _default;
