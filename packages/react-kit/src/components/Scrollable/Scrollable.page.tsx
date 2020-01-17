import React from 'react';
import { storiesOf } from '@storybook/react';
import { Scrollable } from './Scrollable';
import Demo from '../demo/Demo';
import css from './Scrollable.page.styl';
import { PURE } from '../../utils/pure';
import { Pure } from '../Pure/Pure';

const darkDemoTheme = {
	container: css.container,
};

const Heavy = () => (
	<div>
		<p>
			Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam
			incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor
			esse quis. Cillum sunt ad dolore quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor
			cupidatat consequat elit dolor adipisicing.
		</p>
		<p>
			Dolor eiusmod sunt ex incididunt cillum quis nostrud velit duis sit officia. Lorem aliqua enim laboris do
			dolor eiusmod officia. Mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident. Eiusmod et
			adipisicing culpa deserunt nostrud ad veniam nulla aute est. Labore esse esse cupidatat amet velit id elit
			consequat minim ullamco mollit enim excepteur ea. Adipisicing aliqua proident occaecat do do adipisicing
			adipisicing ut fugiat culpa. Pariatur ullamco aute sunt esse adipisicing. Excepteur eu non eiusmod occaecat
			commodo commodo et ad ipsum elit.
		</p>
		<p>
			Sit adipisicing sunt excepteur enim nostrud pariatur incididunt duis commodo mollit esse veniam.
			Exercitation dolore occaecat ea nostrud laboris nisi adipisicing occaecat fugiat fugiat irure. In magna non
			consectetur proident fugiat cupidatat commodo magna et. Elit sint cupidatat dolor sint. Ullamco enim cillum
			anim ex eu. Eiusmod commodo occaecat consequat laboris est do duis ullamco. Incididunt non culpa velit quis
			aute in elit. Ullamco in consequat ex proident do eu dolore incididunt mollit fugiat. Cupidatat ipsum
			laborum cillum quis commodo consequat velit cupidatat duis ex nisi non.
		</p>
		<p>
			Ea pariatur do culpa minim. Proident adipisicing tempor tempor qui pariatur voluptate dolor. Ea commodo id
			veniam voluptate cupidatat ex. Do ullamco in quis elit eiusmod veniam cillum proident veniam cupidatat
			pariatur.
		</p>
		<p>
			Cupidatat anim eiusmod id nostrud pariatur tempor reprehenderit incididunt do esse ullamco laboris sunt. Est
			ea exercitation cupidatat ipsum do Lorem eiusmod aliqua culpa ullamco consectetur veniam. Cillum velit dolor
			consequat cillum tempor laboris mollit laborum reprehenderit reprehenderit veniam aliqua deserunt cupidatat.
			Id aliqua occaecat est id tempor. Enim labore sint aliquip consequat duis minim tempor proident. Dolor
			incididunt aliquip minim elit ea. Exercitation non officia eu id. Ea ipsum ipsum consequat incididunt do
			aliquip pariatur nostrud aute qui. Sint culpa labore Lorem ex magna deserunt aliquip aute duis consectetur
			magna amet anim ad. Fugiat est nostrud veniam ad officia duis ea sunt aliqua laboris magna. Minim officia
			aute anim minim aute aliquip aute non in non. Ipsum aliquip proident ut dolore eiusmod ad fugiat fugiat ut
			ex. Ea velit Lorem ut et commodo nulla voluptate veniam ea et aliqua esse id. Pariatur dolor et adipisicing
			ea mollit.
		</p>
	</div>
);

const SmallContent = (props: { className: string }) => (
	<div className={props.className}>
		<p>
			Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam
			incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor
			esse quis. Cillum sunt ad dolore quis aute consequat ipsum magna exercitation reprehenderit magna. Tempor
			cupidatat consequat elit dolor adipisicing.
		</p>
	</div>
);

export type ScrollablePageState = {
	scrollTop: number;
	scrollLeft: number;
};

@PURE
class ScrollablePage extends React.Component<{}, ScrollablePageState> {
	state = {
		scrollTop: 0,
		scrollLeft: 0,
	};

	render() {
		return (
			<Demo theme={darkDemoTheme}>
				<Pure>
					{() => (
						<section className={css.section}>
							<h1>Origin</h1>
							<Scrollable onScroll={this.onScroll}>
								<div className={css.scrollable}>
									<Heavy />
								</div>
							</Scrollable>
						</section>
					)}
				</Pure>

				<Pure check={this.state.scrollTop}>
					{() => (
						<section className={css.section}>
							<h1>VSync</h1>
							<Scrollable scrollTop={this.state.scrollTop}>
								<div className={css.scrollable}>
									<Heavy />
								</div>
							</Scrollable>
						</section>
					)}
				</Pure>
				<Pure check={this.state.scrollLeft}>
					{() => (
						<section className={css.section}>
							<h1>HSync</h1>
							<Scrollable scrollLeft={this.state.scrollLeft}>
								<div className={css.scrollable}>
									<Heavy />
								</div>
							</Scrollable>
						</section>
					)}
				</Pure>

				<section className={css.section}>
					<h1>VHSync</h1>
					<Scrollable scrollTop={this.state.scrollTop} scrollLeft={this.state.scrollLeft}>
						<div className={css.scrollable}>
							<Heavy />
						</div>
					</Scrollable>
				</section>

				<section className={css.section}>
					<h1>Scrollbars overlay content</h1>
					<Scrollable shouldOverlayContent={true}>
						<div className={css.scrollable}>
							<Heavy />
						</div>
					</Scrollable>
				</section>

				<section className={css.section}>
					<h1>Only vertical scrollbar</h1>
					<Scrollable>
						<div className={css.scrollable}>
							<SmallContent className={css.contentLong} />
						</div>
					</Scrollable>
				</section>

				<section className={css.section}>
					<h1>Only horizontal scrollbar</h1>
					<Scrollable>
						<div className={css.scrollable}>
							<SmallContent className={css.contentWide} />
						</div>
					</Scrollable>
				</section>

				<section className={css.section}>
					<h1>No scrollbars</h1>
					<Scrollable>
						<div className={css.scrollable}>
							<SmallContent className={css.contentFit} />
						</div>
					</Scrollable>
				</section>
			</Demo>
		);
	}

	onScroll = (scrollLeft: number, scrollTop: number) => {
		this.setState({
			scrollLeft,
			scrollTop,
		});
		return {};
	};
}

storiesOf('Scrollable', module).add('default', () => <ScrollablePage />);
