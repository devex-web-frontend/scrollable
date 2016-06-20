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
	<button class="button-close">Close</button>
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
	const node = scrollable.result.detail.block;
	let attached = true;
	main.querySelector('.button-detachAttach').addEventListener('click', e => {
		if (attached) {
			scrollable.notifyDetaching();
			main.removeChild(node);
			attached = false;
		} else {
			main.appendChild(node);
			scrollable.notifyAttached();
			attached = true;
		}
	});
	main.querySelector('.button-close').addEventListener('click', e => {
		scrollable.close();
	});
});