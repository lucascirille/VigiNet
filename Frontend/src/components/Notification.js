import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"

export default function BookingBanner() {
	return (
		<TouchableOpacity style={styles.container} activeOpacity={0.7}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Image
						source={{
							uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5EsZRcqYR0eetzG7OVG46cUGk0U8Lq.png",
						}}
						style={styles.logo}
						resizeMode="contain"
					/>
				</View>
				<View style={styles.textContainer}>
					<View style={styles.header}>
						<Text style={styles.title}>Booking.com</Text>
						<Text style={styles.time}>• Hace 22 min</Text>
					</View>
					<Text style={styles.offer}>Reserva un viaje y te devolvemos un 10%</Text>
					<Text style={styles.subtitle}>Toca para activar la oferta</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		marginHorizontal: 16,
		marginVertical: 8,
	},
	content: {
		flexDirection: "row",
		padding: 16,
		alignItems: "center",
	},
	logoContainer: {
		width: 24,
		height: 24,
		marginRight: 12,
	},
	logo: {
		width: "100%",
		height: "100%",
	},
	textContainer: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	title: {
		fontSize: 14,
		fontWeight: "600",
		color: "#000000",
	},
	time: {
		fontSize: 12,
		color: "#666666",
		marginLeft: 8,
	},
	offer: {
		fontSize: 14,
		fontWeight: "500",
		color: "#000000",
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 14,
		color: "#666666",
	},
})
