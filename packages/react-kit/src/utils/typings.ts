import { Component, ReactNode, RefObject } from 'react';

export type ReactRef<P = any> = Component<P> | Element | null;

export type WithInnerRef<P> = P & {
	innerRef: RefObject<HTMLButtonElement>;
};

export type ReactChildren<C extends ReactNode> = C | C[];
