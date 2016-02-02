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
