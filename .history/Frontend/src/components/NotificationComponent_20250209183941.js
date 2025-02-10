import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asumiendo que usas Expo

const NotificationComponent = ({
	title = "Nueva Notificación",
	message = "Este es el contenido de la notificación",
	duration = 6000,
	autoClose = true,
	onClose = () => { }
}) => {
	const [visible, setVisible] = useState(true);
	const translateY = new Animated.Value(-100);

	useEffect(() => {
		// Animación de entrada
		Animated.spring(translateY, {
			toValue: 0,
			useNativeDriver: true,
			speed: 12,
			bounciness: 5
		}).start();

		// Auto cerrado
		if (autoClose) {
			const timer = setTimeout(() => {
				closeNotification();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, []);

	const closeNotification = () => {
		Animated.timing(translateY, {
			toValue: -100,
			duration: 300,
			useNativeDriver: true
		}).start(() => {
			setVisible(false);
			onClose();
		});
	};

	if (!visible) return null;

	return React.createElement(
		Animated.View,
		{
			style: [
				styles.container,
				{
					transform: [{ translateY }]
				}
			]
		},
		[
			// Barra superior estilo iOS
			React.createElement(
				View,
				{ style: styles.grabber, key: 'grabber' },
				React.createElement(View, { style: styles.grabberHandle })
			),
			React.createElement(
				View,
				{ style: styles.content, key: 'content' },
				[
					// Icono
					React.createElement(
						View,
						{ style: styles.iconContainer, key: 'iconContainer' },
						React.createElement(Ionicons, { name: "notifications", size: 24, color: "#007AFF" })
					),
					// Textos
					React.createElement(
						View,
						{ style: styles.textContainer, key: 'textContainer' },
						[
							React.createElement(Text, { style: styles.title, key: 'title' }, title),
							React.createElement(Text, { style: styles.message, key: 'message' }, message)
						]
					),
					// Botón cerrar
					React.createElement(
						TouchableOpacity,
						{
							style: styles.closeButton,
							onPress: closeNotification,
							key: 'closeButton'
						},
						React.createElement(Ionicons, { name: "close", size: 20, color: "#999" })
					)
				]
			)
		]
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		marginHorizontal: 16,
		marginTop: 8,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	grabber: {
		width: '100%',
		height: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F8F8F8',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	grabberHandle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#DDD',
	},
	content: {
		flexDirection: 'row',
		padding: 16,
		alignItems: 'center',
	},
	iconContainer: {
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
		marginBottom: 4,
	},
	message: {
		fontSize: 14,
		color: '#666',
	},
	closeButton: {
		marginLeft: 12,
		padding: 4,
	}
});

export default NotificationComponent;