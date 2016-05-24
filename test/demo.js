import {Scrollable} from '../src/Scrollable';

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
	<button class="button-detachAttach">Detach/Attach</button>
	<section class="section section-new section-maxHeight">
		${content}
	</section>
	<section class="section section-new">
		${content}
	</section>
`;
document.body.appendChild(main);
Array.from(main.querySelectorAll('.section-new')).forEach(section => {
	const scrollable = new Scrollable(section);
	scrollable.init().then(result => {
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
	}).catch(console.error.bind(console, 'init error'));
});