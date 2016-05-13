import {Scrollable} from '../src/Scrollable.ts';

import './demo.styl';

const content = `
	<div>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
		<p>abc abc abc abc abc abc abc abc abc abc abc abc</p>
	</div>
`;

const main = document.createElement('main');
main.innerHTML = `
	<style type="text/css">
		.section {
			width: 300px;
			height: 300px;
			overflow: hidden;
			margin: 20px;
			border: 1px solid grey;
		}
	</style>
	<button class="button-detachAttach">Detach/Attach</button>
	<section class="section section-new">
		${content}
	</section>
`;
document.body.appendChild(main);
const section = main.querySelector('.section-new');
const scrollable = new Scrollable(section);
scrollable.init(section).then(result => {
	const node = result.detail.block;
	let attached = true;
	let isReady = true;
	main.querySelector('.button-detachAttach').addEventListener('click', e => {
		if (isReady) {
			if (attached) {
				scrollable.notifyDetaching();
				main.removeChild(node);
				attached = false;
			} else {
				isReady = false;
				main.appendChild(node);
				scrollable.notifyAttached().then(() => {
					attached = true;
					isReady = true;
				});
			}
		}
	});
});