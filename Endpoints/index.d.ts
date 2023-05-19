import React from 'react';
interface Props {
    className?: string;
    offset?: number | string;
    onClose: () => void;
}
declare function Endpoints({ className, offset, onClose }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof Endpoints>;
export default _default;
