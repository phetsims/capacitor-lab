/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;