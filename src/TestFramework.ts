/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mock } from './TestFrameworkTypes';

export interface TestFramework {
    /**
     * Creates a mock function. Optionally takes a mock implementation.
     */
    fn(): Mock;
    /**
     * Creates a mock function. Optionally takes a mock implementation.
     */
    fn<T, Y extends any[], C = any>(implementation?: (this: C, ...args: Y) => T): Mock<T, Y, C>;
}
