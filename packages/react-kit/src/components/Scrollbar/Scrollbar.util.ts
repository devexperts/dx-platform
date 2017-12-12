/**
 * @typedef {Object} TScrollbarSize
 * @property {Number} width
 * @property {Number} height
 */

/**
 * Apply necessary styles for proper computation of scrollbar sizes.
 * It returns clearer function which removes all added styles from DOM.
 * @param {String} scrollbarContainerClassName
 * @returns {Function} clearer function, removing inlined styles from DOM
 */
function fixScrollStyles(scrollbarContainerClassName: string) {
	const styleFixEl = document.createElement('style') as any;
	const styleFixText = `.${scrollbarContainerClassName}::-webkit-scrollbar { display: none; }`;

	styleFixEl.type = 'text/css';

	if (styleFixEl.styleSheet) { // IE < 11
		styleFixEl.styleSheet.cssText = styleFixText;
	} else {
		styleFixEl.innerHTML = styleFixText;
	}

	document.head.appendChild(styleFixEl);

	return function() {
		document.head.removeChild(styleFixEl);
	};
}

let scrollbarSize: {
	width: number
	height: number
};

/**
 * size
 * @param {String} scrollbarContainerClassName
 * @returns {*}
 */
function getScrollbarSize(scrollbarContainerClassName: string) {
	if (!scrollbarSize) {
		fixScrollStyles(scrollbarContainerClassName);

		const dummy = document.createElement('div');
		dummy.className = scrollbarContainerClassName;
		dummy.style.width = '100px';
		dummy.style.height = '100px';
		dummy.style.position = 'absolute';
		dummy.style.top = '-200%';
		dummy.style.left = '-200%';
		dummy.style.overflow = 'scroll';
		dummy.style.opacity = '0';

		document.body.appendChild(dummy);
		scrollbarSize = {
			width: dummy.offsetWidth - dummy.clientWidth,
			height: dummy.offsetHeight - dummy.clientHeight
		};
		document.body.removeChild(dummy);
	}
	return scrollbarSize;
}

export default getScrollbarSize;