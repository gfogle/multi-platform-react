'use strict';

import Render from './root-render';

import { Component } from 'react';

export default class Root extends Component {
	render () {
		return Render.call(this, this.props, this.state);
	}
}
