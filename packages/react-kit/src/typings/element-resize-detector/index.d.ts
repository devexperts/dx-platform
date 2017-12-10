declare module 'element-resize-detector' {
	type TDetectoryFactoryOptions = {
		strategy?: 'scroll'
	};
	type THandler = (element: Element) => any;
	//tslint:disable max-line-length
	type TDetector = {
		/**
		 * Listens to the element for resize events and calls the listener function with the element as argument on resize events.
		 */
		listenTo: (element: Element, handler: THandler) => void,

		/**
		 * Removes the listener from the elemens.
		 */
		removeListener: (element: Element, handler: THandler) => void,
		/**
		 * Removes all listeners from the element, but does not completely remove the detector. Use this function if you may add listeners later and don't want the detector to have to initialize again.
		 */
		removeAllListeners: (element: Element) => void,
		/**
		 *
		 */
		uninstall: (element: Element) => void
	};
	//tslint:enable max-line-length

	const detectorFactory: (options: TDetectoryFactoryOptions) => TDetector;
	export = detectorFactory;
}