import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";
import { configRoutes } from "../config/routes";
import { createRouteMatchers } from "@/lib/route";
import CurrentSession from "../services/auth/getSession"
const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
	const session = await CurrentSession()
	const { isPublicRoute, isProtectedRoute, isApiRoute, isAuthRoute } = createRouteMatchers(configRoutes, req);
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	
	if (isProtectedRoute && !isLoggedIn) {
		console.log("caindo asaqui")
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	if (isLoggedIn && isPublicRoute) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}


	// console.log(`Middleware: ${req.nextUrl.pathname}`);
});

export const config = {
	/*
	 * Match all request paths except for the ones starting with:
	 * - api (API routes)
	 * - _next/static (static files)
	 * - _next/image (image optimization files)
	 * - favicon.ico (favicon file)
	 */
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
