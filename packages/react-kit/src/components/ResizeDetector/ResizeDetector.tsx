import React from 'react';
import { PURE } from '../../utils/pure';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

import detectorFactory from 'element-resize-detector';
import { raf } from '@devexperts/utils/dist/function/raf';

export const NativeResizeDetector = detectorFactory({
	strategy: 'scroll',
});

export const RESIZE_DETECTOR = Symbol('ResizeDetector') as symbol;

export type TFullResizeDetectorProps = {
	theme: {
		container?: string;
	};
	onResize: (element: Element) => any;
};

@PURE
class RawResizeDetector extends React.Component<TFullResizeDetectorProps> {
	private element!: HTMLDivElement | null;

	componentDidMount() {
		if (this.element) {
			NativeResizeDetector.listenTo(this.element, this.onResize);
		}
	}

	componentWillUnmount() {
		if (this.element) {
			NativeResizeDetector.uninstall(this.element);
		}
	}

	render() {
		const { theme } = this.props;
		return <div className={theme.container} ref={el => (this.element = el)} />;
	}

	onResize = raf((element: Element) => {
		this.props.onResize(element);
	});
}

export type TResizeDetectorProps = PartialKeys<TFullResizeDetectorProps, 'theme'>;
export const ResizeDetector: ComponentClass<TResizeDetectorProps> = withTheme(RESIZE_DETECTOR)(RawResizeDetector);
