import bem, {modifier} from 'dx-util/src/bem/bem.js';

export const CN_SCROLLABLE = 'scrollable';
export const CN_WITHVERTICALSCROLLBAR = modifier(CN_SCROLLABLE, 'withVerticalScrollbar');
export const CN_WITHHORIZONTALSCROLLBAR = modifier(CN_SCROLLABLE, 'withHorizontalScrollbar');

export const CN_SCROLLABLE__WRAPPER = bem(CN_SCROLLABLE, 'wrapper');
export const CN_SCROLLABLE__CONTAINER = bem(CN_SCROLLABLE, 'container');
export const CN_SCROLLABLE__CONTENT = bem(CN_SCROLLABLE, 'content');