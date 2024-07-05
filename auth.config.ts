import Credentials from "next-auth/providers/credentials";

import { NextAuthConfig } from "next-auth"

export default {
	providers: [
		Credentials({
			async authorize(credentials) {
				if (credentials) {
					return {
						id:'1234',
						name:'Deni',
						email:'deni@gmail.com',
					}
				}
				return null;
			},
		}),

	],

} satisfies NextAuthConfig;