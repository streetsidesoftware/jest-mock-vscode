/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Constructable, Mock, Procedure } from './TestFrameworkTypes';

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

interface TF<P> {
    fn(implementation?: P): P;
}

export type GenericTestFramework = TestFramework | TF<Procedure> | TF<Constructable> | TF<Procedure | Constructable>;
