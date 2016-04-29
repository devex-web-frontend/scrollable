import {Scrollable} from '../src/Scrollable.ts';
import OldScrollable from '../src/js/scrollable';

import '../src/styl/scrollable.styl';
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
	<h3>old</h3>
	<section class="section section-old">
		${content}
	</section>
	<h3>new</h3>
	<section class="section section-new">
		${content}
	</section>
`;
document.body.appendChild(main);
new OldScrollable(main.querySelector('.section-old'));
Scrollable.create(main.querySelector('.section-new'));