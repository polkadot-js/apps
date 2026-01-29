// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';

export const filterDropdownItems = (items: DropdownItemProps[], query: string) => {
  return items.filter((item) => item.value?.toString().toLowerCase().includes(query.toLowerCase()));
};
