import NextAuth from "next-auth"
import authConfig from "./auth.config"
export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	session: {
		strategy: "jwt",
		maxAge: 60 * 60
	},
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register'
	},

	...authConfig,
	debug: false
});