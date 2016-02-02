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

### Web and Electron

Each of the web and electron, which uses the web code, have their own file for
the `index.html` and `index.electron.js` files.
