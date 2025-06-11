import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store"; // Add this import

const OAuthCallbackPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const setUser = useStore((state) => state.setUser);
	const [inlineError, setInlineError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			const token = searchParams.get("token");
			const error = searchParams.get("error");
			const user = searchParams.get("user");

			if (error) {
				const decodedError = decodeURIComponent(error);
				toast.error(decodedError);
				// Show a more user-friendly inline error for Facebook missing email
				if (
					decodedError.includes("Facebook did not provide an email") ||
					(decodedError.toLowerCase().includes("facebook") &&
						decodedError.toLowerCase().includes("email"))
				) {
					setInlineError(
						"Facebook did not provide an email address. Please use a Facebook account with a verified email, or try another login method."
					);
				} else {
					setInlineError(decodedError);
				}
				return;
			}

			if (token && user) {
				try {
					// Parse user data
					const userData = JSON.parse(decodeURIComponent(user));
					const formattedUser = {
						id: userData.id,
						email: userData.email,
						name: userData.name,
						avatarUrl:
							userData.avatarUrl ||
							`https://ui-avatars.com/api/?name=${encodeURIComponent(
								userData.name
							)}&background=6366f1&color=fff`,
						isEmailVerified: userData.isEmailVerified || true, // OAuth users are typically verified
						token, // <-- Store the JWT token
					};

					localStorage.setItem("user", JSON.stringify(formattedUser));
					setUser(formattedUser); // <-- Add this line

					// NEW: Call backend to set cookies for session persistence (OAuth)
					await fetch(
						`${
							import.meta.env.VITE_API_URL || "http://localhost:5000/api"
						}/auth/set-cookies-from-token`,
						{
							method: "POST",
							credentials: "include",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
						}
					);

					// toast.success("Successfully signed in!");
					navigate("/dashboard");
				} catch (error) {
					console.error("Error parsing OAuth callback data:", error);
					toast.error("Authentication failed. Please try again.");
					setInlineError("Authentication failed. Please try again.");
					navigate("/login");
				}
			} else {
				toast.error("Authentication failed. Please try again.");
				setInlineError("Authentication failed. Please try again.");
				navigate("/login");
			}
		};

		handleCallback();
	}, [searchParams, navigate, setUser]);

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
				<div className='mt-4 flex items-center justify-center'>
					<FileText className='h-6 w-6 text-primary-600 mr-2' />
					<h2 className='text-lg font-medium text-gray-900'>
						Completing sign in...
					</h2>
				</div>
				{inlineError && (
					<div className='mt-6 bg-red-50 border border-red-200 rounded p-4'>
						<p className='text-red-700 text-sm font-medium'>{inlineError}</p>
						{inlineError.includes("Facebook did not provide an email") && (
							<p className='text-xs text-gray-500 mt-2'>
								This usually means your Facebook account does not have a
								verified email address. Please use a different Facebook account
								or try another login method (Google, LinkedIn, or
								email/password).
							</p>
						)}
						<button
							className='mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700'
							onClick={() => navigate("/login")}>
							Back to Login
						</button>
					</div>
				)}
				<p className='mt-2 text-sm text-gray-500'>
					Please wait while we finish setting up your account.
				</p>
			</div>
		</div>
	);
};

export default OAuthCallbackPage;
