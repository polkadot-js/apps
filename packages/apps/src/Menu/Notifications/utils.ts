// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';

import React from 'react';

interface JsonElement {
  type: string;
  props?: Record<string, any>;
}

/**
 * Revives a JSON React object (from localStorage) into a real ReactNode.
 */
export function reviveElement (node: React.ReactNode): React.ReactNode {
  // Already valid React primitives
  if (
    node === null ||
    node === undefined ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
  ) {
    return node;
  }

  // Arrays -> revive each child
  if (Array.isArray(node)) {
    return node.map((child: ReactNode) => reviveElement(child));
  }

  // Objects (JSON React description)
  if (typeof node === 'object' && !React.isValidElement(node)) {
    const json = node as JsonElement;

    // If no `type`, it's not a JSON element
    if (typeof json.type !== 'string') {
      return node;
    }

    const { props = {}, type } = json;

    // Recursively revive all props (including children)
    const revivedProps: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') {
        revivedProps.children = Array.isArray(value)
          ? value.map((child: ReactNode) => reviveElement(child))
          : reviveElement(value as ReactNode);
      } else {
        revivedProps[key] = value as ReactNode;
      }
    }

    return React.createElement(type, revivedProps);
  }

  return null;
}
