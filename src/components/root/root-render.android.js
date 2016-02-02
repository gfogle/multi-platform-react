'use strict';

import Render from './root-render.native';

export default function () {
	return Render.call(this, this.props, this.state);
}
