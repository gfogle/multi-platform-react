'use strict';

import React, {
	StyleSheet,
	View,
	Text
} from 'react-native';

export default function () {
	return (
		<View style={styles.container}>
			<Text>Hello World</Text>
		</View>
	);
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		backgroundColor: "#303030"
	}
});
