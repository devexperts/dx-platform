/**
 * @typedef {Object} TScrollbarSize
 * @property {Number} width
 * @property {Number} height
 */

let scrollbarSize: {
	width: number;
	height: number;
};

/**
 * size
 * @param {String} scrollbarContainerClassName
 * @returns {*}
 */
function getScrollbarSize(scrollbarContainerClassName: string) {
	if (!scrollbarSize) {
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
			height: dummy.offsetHeight - dummy.clientHeight,
		};
		document.body.removeChild(dummy);
	}
	return scrollbarSize;
}

export default getScrollbarSize;
