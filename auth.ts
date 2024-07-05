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
	},
	pages:{
		signIn:'/auth/login'
	},
	...authConfig,
});