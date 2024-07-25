
import type { NextRequest } from "next/server";
import { ConfigRoutes } from "../../../types/routes";



export const createRouteMatchers = (routes: ConfigRoutes, req: NextRequest) => {
	const { publicRoutes, protectedRoutes, authRoutes, apiRoutes } = routes;
	const pathName = req.nextUrl.pathname;

	// Preprocess route collections into sets
	const publicRouteSet = new Set(publicRoutes.flat());
	const protectedRouteSet = new Set(protectedRoutes.flat());
	const authRouteSet = new Set(authRoutes.flat());
	const apiRouteSet = new Set(apiRoutes.flat());

	return {
		isPublicRoute: publicRouteSet.has(pathName),
		isProtectedRoute: protectedRouteSet.has(pathName),
		isAuthRoute: authRouteSet.has(pathName),
		isApiRoute: apiRouteSet.has(pathName),
	};
};
