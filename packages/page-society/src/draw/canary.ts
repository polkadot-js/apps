// Copyright 2017-2022 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Adapted (wih permission) from https://www.w3schools.com/code/tryit.asp?filename=GGIGKE2GG7N1

import type { AccountId } from '@polkadot/types/interfaces';

// const DEFAULT_FN = (ctx: CanvasRenderingContext2D, path: Path2D) => ctx.fill(path);
export const PADD = 25;
export const SIZE = 300; // 250

function canary (ctx: CanvasRenderingContext2D, w: number, h: number, s: number, f: (ctx: CanvasRenderingContext2D, path: Path2D) => void): void {
  const path = new Path2D('M373.1,126.9c-5.2-4.1-11.4-9.7-22.7-11.1c-10.6-1.4-21.4,5.7-28.7,10.4c-7.3,4.7-21.1,18.5-26.8,22.7 c-5.7,4.2-20.3,8.1-43.8,22.2s-115.7,73.3-115.7,73.3l24,0.3L52.4,299.8h10.7l-15.4,11.7c0,0,13.6,3.6,25-3.6l0,3.3 c0,0,127.4-50.2,152-37.2l-15,4.4c1.3,0,25.5,1.6,25.5,1.6s0.8,15.1,15.4,24.8c14.6,9.6,14.9,14.9,14.9,14.9s-7.6,3.1-7.6,7 c0,0,11.2-3.4,21.6-3.1c10.4,0.3,19.5,3.1,19.5,3.1s-0.8-4.2-10.9-7c-10.2-2.9-20.1-13.8-25-19.8c-4.9-6-8.3-16.7-4.1-27.4 c3.5-9.1,15.7-14.1,40.9-27.1c29.7-15.4,36.5-26.8,40.7-35.7c4.2-8.9,10.4-26.6,13.9-34.9c4.4-10.7,9.8-16.4,14.3-19.8 c4.4-3.4,24.5-10.9,24.5-10.9S378,130.8,373.1,126.9z');

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(s / 440, s / 440);
  ctx.translate(-220, -220);
  f(ctx, path);
  ctx.restore();
}

function addressToBits (publicKey: Uint8Array): boolean[] {
  return publicKey.reduce((bits: boolean[], byte): boolean[] => {
    for (let j = 0; j < 8; ++j) {
      bits.push((byte & (1 << (7 - j))) !== 0);
    }

    return bits;
  }, []);
}

function ring (ctx: CanvasRenderingContext2D, r: number, bits: boolean[], f: (ctx: CanvasRenderingContext2D, on: boolean) => void): void {
  ctx.save();
  ctx.translate(0.5, 0.5);

  for (let i = 0; i < bits.length; i++) {
    ctx.save();
    ctx.rotate(Math.PI * 2 / bits.length * i);
    ctx.translate(0, -r);
    f(ctx, bits[i]);
    ctx.restore();
  }

  ctx.restore();
}

function splitRows (bits: boolean[], rows: number[]) {
  let i = 0;

  // eslint-disable-next-line no-return-assign
  return rows.map((r) => bits.slice(i, i += r));
}

function tattoo (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  const rows = splitRows(bits, [71, 61, 51, 41, 32]);

  for (let i = 0; i < rows.length; ++i) {
    ring(ctx, 0.5 - (31 / 500) * (i + 0.5), rows[i], (ctx, on) => {
      if (on) {
        ctx.beginPath();
        ctx.arc(0, 0, 8 / 500, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    });
  }

  ctx.lineWidth = 10;
  canary(ctx, 1, 1, 200 / 500, (ctx, path) => ctx.stroke(path));
}

function tattooSpiro (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  const cycles = 8;
  const limit = 0.75;
  const dot = 8 / 500;

  ctx.save();
  ctx.translate(0.5 - dot, 0.5 + dot);
  ctx.fillStyle = 'black';

  let radius = 0.5 - dot;

  for (let i = 0; i < bits.length; i++) {
    radius -= 0.5 / bits.length * limit / (radius * 4);
    ctx.rotate(Math.PI * 2 / bits.length * cycles / (radius * 4));
    ctx.save();
    ctx.translate(0, -radius);
    ctx.beginPath();
    ctx.arc(0, 0, (bits[i] ? dot : dot / 2), 0, 2 * Math.PI);
    ctx.fillStyle = bits[i] ? 'black' : '#e6007a';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  ctx.lineWidth = 10;
  canary(ctx, 1 - dot, 1 + dot, 220 / 500, (ctx, path) => ctx.stroke(path));
}

function tattooPink (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  const rows = splitRows(bits, [71, 61, 51, 41, 32]);

  for (let i = 0; i < rows.length; ++i) {
    ring(ctx, 0.5 - (31 / 500) * (i + 0.5), rows[i], (ctx, on) => {
      ctx.beginPath();
      ctx.arc(0, 0, (on ? 8 : 4) / 500, 0, 2 * Math.PI);
      ctx.fillStyle = on ? 'black' : '#e6007a';
      ctx.fill();
    });
  }

  canary(ctx, 1, 1, 220 / 500, (ctx, path) => ctx.fill(path));
}

function tattoo2 (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  const rows = splitRows(bits, [64, 64, 64, 64]);

  for (let i = 0; i < rows.length; ++i) {
    ring(ctx, 0.5 - (36 / 500) * (i + 0.5), rows[i], (ctx, on) => {
      if (on) {
        ctx.beginPath();
        ctx.moveTo(0, -18 / 500);
        ctx.lineTo(0, 18 / 500);
        ctx.lineWidth = 0.01;
        ctx.stroke();
      }
    });
  }

  canary(ctx, 1, 1, 220 / 500, (ctx, path) => ctx.fill(path));
}

function tattoo2b (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  const rows = splitRows(bits, [128, 128]);

  for (let i = 0; i < rows.length; ++i) {
    ring(ctx, 0.5 - (36 / 500) * (i + 0.5), rows[i], (ctx, on) => {
      if (on) {
        ctx.beginPath();
        ctx.moveTo(0, -18 / 500);
        ctx.lineTo(0, 18 / 500);
        ctx.lineWidth = 0.01;
        ctx.stroke();
      }
    });
  }

  ctx.lineWidth = 6;
  canary(ctx, 1, 1, 350 / 500, (ctx, path) => ctx.stroke(path));
}

function tattoo3 (ctx: CanvasRenderingContext2D, bits: boolean[]): void {
  ctx.lineWidth = 0.01;

  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 32; ++j) {
      if (bits[i * 32 + j]) {
        ctx.save();
        ctx.translate((j + 0.5) / 32, i / 8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 1 / 8);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  canary(ctx, 1, 1, 1, (ctx, path) => ctx.fill(path));
  ctx.lineWidth = 6;
  canary(ctx, 1, 1, 1, (ctx, path) => ctx.stroke(path));
}

export default function draw (ctx: CanvasRenderingContext2D, accountId: AccountId): void {
  console.log(`Generating ink for ${accountId.toString()} as ${accountId.toHex()}`);

  const bits = addressToBits(accountId.toU8a());

  ctx.save();
  ctx.translate(0, 0);
  ctx.scale(SIZE, SIZE);
  tattoo(ctx, bits);
  ctx.restore();

  ctx.save();
  ctx.translate(SIZE + PADD, 0);
  ctx.scale(SIZE, SIZE);
  tattooPink(ctx, bits);
  ctx.restore();

  ctx.save();
  ctx.translate(0, SIZE + PADD);
  ctx.scale(SIZE, SIZE);
  tattoo2(ctx, bits);
  ctx.restore();

  ctx.save();
  ctx.translate(SIZE + PADD, SIZE + PADD);
  ctx.scale(SIZE, SIZE);
  tattoo3(ctx, bits);
  ctx.restore();

  ctx.save();
  ctx.translate((SIZE + PADD) * 2, 0);
  ctx.scale(SIZE, SIZE);
  tattooSpiro(ctx, bits);
  ctx.restore();

  ctx.save();
  ctx.translate((SIZE + PADD) * 2, SIZE + PADD);
  ctx.scale(SIZE, SIZE);
  tattoo2b(ctx, bits);
  ctx.restore();
}
