// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import { z } from 'zod';

/**
 * An entry of the ./rpc/<chain-id>.json files
 */
export const RpcEndpointSchema = z.object({
  comment: z.string().optional(),
  disabled: z.boolean().optional(),
  name: z.string().trim().min(1),
  rpc: z.string().startsWith('wss://')
}).strict();

/**
 * The content of a ./rpc/<chain-id>.json file
 */
export const RpcEndpointsSchema = z.array(RpcEndpointSchema).superRefine((entries, ctx): void => {
  const names = new Set<string>();
  const rpcs = new Set<string>();

  entries.forEach(({ name, rpc }, index): void => {
    if (names.has(name)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `duplicate name '${name}'`, path: [index, 'name'] });
    }

    if (rpcs.has(rpc)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `duplicate rpc '${rpc}'`, path: [index, 'rpc'] });
    }

    names.add(name);
    rpcs.add(rpc);
  });
});

export type RpcEndpoint = z.infer<typeof RpcEndpointSchema>;

export function readRpcFiles (dir: URL): { content: unknown; file: string }[] {
  return fs
    .readdirSync(dir, { encoding: 'utf-8' })
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => ({
      content: JSON.parse(fs.readFileSync(new URL(file, dir), 'utf-8')) as unknown,
      file
    }));
}
