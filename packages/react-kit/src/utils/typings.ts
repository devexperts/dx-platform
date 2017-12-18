import { Component, ReactNode } from 'react';

export type ReactRef<P = any> = Component<P> | Element | null;

export type WithInnerRef<P> = P & {
	innerRef: (instance: ReactRef) => void
};

export type ReactChildren<C extends ReactNode> = C | C[];