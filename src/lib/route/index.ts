
import type { NextRequest } from "next/server";
import { ConfigRoutes } from "../../../types/routes";



export const createRouteMatchers = (routes: ConfigRoutes, req: NextRequest) => {
	const { publicRoutes, protectedRoutes, authRoutes, apiRoutes } = routes;
	const pathName = req.nextUrl.pathname;

	// Preprocess route collections into sets
	const publicRouteSet = new Set(publicRoutes);
	const protectedRouteSet = new Set(protectedRoutes);
	const authRouteSet = new Set(authRoutes);
	const apiRouteSet = new Set(apiRoutes);

	return {
		isPublicRoute: publicRouteSet.has(pathName),
		isProtectedRoute: protectedRouteSet.has(pathName),
		isAuthRoute: authRouteSet.has(pathName),
		isApiRoute: apiRouteSet.has(pathName),
	};
};
