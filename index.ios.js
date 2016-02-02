'use strict';

// it is important to import the react package before anything else
import React from 'react';
import {
  AppRegistry
} from 'react-native';

import Root from './src/components/root/root';

AppRegistry.registerComponent('MultiPlatformReact', () => Root);
