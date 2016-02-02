
# multi-platform-react
Sharing of React code across Web, iOS, Android, Electron as Hello World example

## FOLDER STRUCTURE

### React Native init

Repo was created using `react-native init MultiPlatformReact` which initially
created a folder named the same in the root project. In addition, this uses
eslint so there was an addition `npm install --save-dev eslint-plugin-react`
command run. The initial structure looked like:

![Initial Project structure](https://github.com/gfogle/multi-platform-react/blob/master/readme/initial-project.png)

### Moving things around

To make the project a little easier to navigate (I hope). Ideally, the specific
index files would be in their respective folders but there are issues where parts
of the project expect them in the root, so they're all there for consistency.
The files now reside at the following:

![Initial Project structure](https://github.com/gfogle/multi-platform-react/blob/master/readme/move-things.png)

### Shared Components

The goal of these components are that, to extent you can, keep react-native
in the native files and react in the plain `.js` files. There's only a root
component that imports a `root-render` function. The web / electron files
pickup the standard `root-render.js` file. The base root file looks like:

```javascript
'use strict';

import Render from './root-render';

import { Component } from 'react';

export default class Root extends Component {
	render () {
		return Render.call(this, this.props, this.state);
	}
}
```

but the iOS and Android platforms will look for the specific `root-render.ios.js`
and `root-render.android.js` files, based on the platform, and both of those
redirect to `root-render.native.js` and look like:

```javascript
'use strict';

import Render from './root-render.native';

export default function () {
	return Render.call(this, this.props, this.state);
}
```

### Web and [ELECTRON](http://electron.atom.io/)

Each of the web and electron, which uses the web code, have their own file for
the `index.html` and `index.electron.js` files. Webpack is the build system for
web code and will output its bundle files to the web folder. In order to not
cause issues with react native, we need to add an `rn-cli.config.js` file to
blacklist the web folder for weird duplicate entry / dependency errors. Pretty
simple:

```javascript
var blacklist = require('react-native/packager/blacklist');

var config = {
	getBlacklistRE(platform) {
		return blacklist(platform, [
			/web/
		]);
	}
};

module.exports = config;
```

## [WEBPACK](http://webpack.github.io/)

The project uses webpack for bundling the web code and webpack-dev-server for
basic hosting of the app locally. This is because the project I started this for
is a static hosted app on Amazon S3 so I don't need a server in production.
The config will be found by webpack automatically based on its name and looks like:

```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		path: './web',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /.js?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query:
				{
					presets:['es2015','react']
				}
			}
		]
	},
	debug: true,
	devtool: "source-map",
	plugins: [
		new webpack.DefinePlugin({
			__DEV__: process.env.NODE_ENV === "development"
		})
	]
};
```

The webpack config is pretty basic but does inject a nice `__DEV__` variable
that you can use to hide things in development you don't quite want in prod such
as, say in a component's render function you wanted to hide a <button> tag:

```javascript
export default function () {
	let forgotPassword;

	// this code will show up for you locally, but not when the webpack
	// production build kicks off
	if (__DEV__) {
		forgotPassword =
			<button
				style={styles.forgot}
			>Forgot Password?</button>;
	}

	return (
		<div>
			<h2>Hello World</h2>
			{forgotPassword}
		</div>
	);
}
```

And, the commands for all of this to work are in the `package.json` file and
look like this:

```
"scripts": {
  "start:electron": "node_modules/.bin/electron electron/index.electron.js",
  "start:ios": "node_modules/react-native/packager/packager.sh",
  "start:web": "NODE_ENV=development node_modules/.bin/webpack-dev-server --progress --colors  --content-base web/",
  "start:android": "node_modules/react-native run-android",
  "build:web": "NODE_ENV=production node_modules/.bin/webpack -p",
  "build:ios": "react-native bundle --entry-file index.ios.js --bundle-output ios/main.jsbundle --platform ios --dev false",
  "build:android": "node_modules/react-native bundle --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --platform android --dev false"
}
```

At this point, the project _should_ be working assuming you followed the
[Getting Started with React Native](https://facebook.github.io/react-native/docs/getting-started.html)

## [REDUX](http://redux.js.org/)

At some point you'll probably want to add Redux because, well, the internet told
you too (just kidding it's dope!) and there's a little gotcha to remember: as of
writing this repo you have to use a specific version of the `react-redux` package.
So, make sure you have `"react-redux": "^3.1.2",` in your `package.json` file and
then also install these:

```
- redux
- redux-thunk
```

Then, to keep things simple I'd start with a folder called `redux` and have
the following files in it:

```
- actions.js
- reducers.js
- constants.js
- store.js
```

The root component would then get updated to look something like:

```javascript
import Render from './root-render';
import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from "../../redux/actions";


class Root extends Component {
	constructor(props) {
		super(props);
	}
	render () {
		return Render.call(this, this.props, this.state);
	}
}

function mapStateToProps(state) {
	// add as many properties as you want mapped to props of root
	return {
		example: state.default.example,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
```

I'll leave the constants, actions, and reducers to you but these store file
would look something like:

```javascript
'use strict';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default store;
```

And finally your `index.js` file would then wrap your root component with the
react redux magic and look like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './src/redux/store';
import Root from './src/components/root/root';

ReactDOM.render(
	<Provider store={store}>
		<Root />
	</Provider>,
	document.getElementById('root')
);
```
