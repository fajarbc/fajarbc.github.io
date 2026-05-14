import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  requestSlot,
  releaseSlot,
  MAX_CONCURRENT,
  _resetAnimationLimiter,
} from './useAnimationLimiter';

describe('Animation Limiter', () => {
  beforeEach(() => {
    _resetAnimationLimiter();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('MAX_CONCURRENT is 3', () => {
    expect(MAX_CONCURRENT).toBe(3);
  });

  it('allows up to 3 concurrent slots immediately', async () => {
    const results: boolean[] = [];

    // Request 3 slots — all should resolve immediately
    const p1 = requestSlot().then(() => { results.push(true); });
    const p2 = requestSlot().then(() => { results.push(true); });
    const p3 = requestSlot().then(() => { results.push(true); });

    await Promise.all([p1, p2, p3]);
    expect(results).toHaveLength(3);
  });

  it('queues the 4th request until a slot is released', async () => {
    let fourthResolved = false;

    await requestSlot();
    await requestSlot();
    await requestSlot();

    // 4th request should be queued
    const p4 = requestSlot().then(() => { fourthResolved = true; });

    // Not yet resolved
    await Promise.resolve(); // flush microtasks
    expect(fourthResolved).toBe(false);

    // Release one slot
    releaseSlot();
    await p4;
    expect(fourthResolved).toBe(true);
  });

  it('processes queue in FIFO order', async () => {
    const order: number[] = [];

    await requestSlot();
    await requestSlot();
    await requestSlot();

    const p4 = requestSlot().then(() => { order.push(4); });
    const p5 = requestSlot().then(() => { order.push(5); });

    // Release two slots
    releaseSlot();
    await p4;
    releaseSlot();
    await p5;

    expect(order).toEqual([4, 5]);
  });
});
