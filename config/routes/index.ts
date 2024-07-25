import { ConfigRoutes } from "../../types/routes";

export const configRoutes: ConfigRoutes = {
	publicRoutes: [
		"/",
		"/auth/login",
		"/auth/register",
		"/auth/password-reset",
		"/auth/password-reset-request",
		"/auth/verify-email",
		"/dataEstablishment",
	],
	authRoutes: ["/api/auth/signin"],
	apiRoutes: ["/api/protected-api"],
	protectedRoutes: [
		"/dashboard",
		"/example/multi-step-form/campaign",
	],
};
