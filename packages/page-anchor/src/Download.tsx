// Button to download a blob the is already generated and local.

import React, { useState, useEffect } from 'react';

interface Props {
  content: Blob,
  children: React.ReactChild | React.ReactChildren,
  filename: string,
}

function Download({ content, children = <></>, filename }: Props): React.ReactElement {
  const [dataurl, setDataurl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = URL.createObjectURL(content);
    setDataurl(url);
    return () => URL.revokeObjectURL(url);
  }, [content]);

  return (
    <a href={dataurl} download={filename}>{children}</a>
  );
}

export default React.memo(Download);
