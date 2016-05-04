type Dummy = (...args: Array<any>) => any;

declare module 'dx-util/src/bem/bem.js' {
	const bem: Dummy;
	export default bem;
	export const modifier: Dummy;
}

declare module 'dxjs/src/dx.dom.js' {
	const dom: {
		createElement: Dummy;
	};
	export default dom;
}