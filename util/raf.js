export const raf = (cb) => {
	let id;

	const invoke = (ctx, args) => () => {
		// eslint-disable-next-line
		id = undefined;
		cb.apply(ctx, args);
	};

	// eslint-disable-next-line
	function synced(...args) {
		if (typeof id === 'undefined') {
			id = requestAnimationFrame(invoke(this, args));
		}
	}

	synced['cancel'] = () => {
		if (id) {
			cancelAnimationFrame(id);
		}
	};

	return synced;
};