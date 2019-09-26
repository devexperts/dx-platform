import { createGlobalStyle } from 'styled-components';

export const GlobalDemoStyles = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header, hgroup,
	main, menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure,
	footer, header, hgroup, main, menu, nav, section {
		display: block;
	}
	/* HTML5 hidden-attribute fix for newer browsers */
	*[hidden] {
	    display: none;
	}
	body {
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	* {
		box-sizing: border-box;
	}
	a {
		text-decoration: none;
	}
	html {
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap');

	body {
	  	line-height: normal;
	  	font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		font-weight: 400;
		background-color: #1f1f1f;
		color: #ffffff;
	}
     
    button, input, textarea {
    	font: inherit;
    }
`;
