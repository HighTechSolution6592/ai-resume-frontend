import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import api from "../utils/api";
import Button from "../components/ui/Button";

const SignupPage: React.FC = () => {
	const navigate = useNavigate();
	const { signup, user } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showSetPassword, setShowSetPassword] = useState(false);
	const [setPasswordData, setSetPasswordData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [setPasswordLoading, setSetPasswordLoading] = useState(false);
	const [setPasswordErrors, setSetPasswordErrors] = useState<
		Record<string, string>
	>({});

	// --- Set Password for Existing Social Users Section ---
	const [setPasswordEmail, setSetPasswordEmail] = useState("");
	const [setPasswordStep, setSetPasswordStep] = useState<"email" | "password">(
		"email"
	);
	const [setPasswordGeneralError, setSetPasswordGeneralError] = useState("");
	const [setPasswordEmailLoading, setSetPasswordEmailLoading] = useState(false);
	const [setPasswordUserExists, setSetPasswordUserExists] = useState(false);

	// Add show/hide state for set password (social user logged in)
	const [showSetPasswordPassword, setShowSetPasswordPassword] = useState(false);
	const [showSetPasswordConfirm, setShowSetPasswordConfirm] = useState(false);

	// Add show/hide state for set password (existing social user via email)
	const [showSocialSetPasswordPassword, setShowSocialSetPasswordPassword] =
		useState(false);
	const [showSocialSetPasswordConfirm, setShowSocialSetPasswordConfirm] =
		useState(false);

	useEffect(() => {
		// Show set password section if user is logged in via social and has no password
		if (
			user &&
			user.registration_method &&
			user.registration_method !== "manual" &&
			!user.hasPassword
		) {
			setShowSetPassword(true);
		} else {
			setShowSetPassword(false);
		}
	}, [user]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleEmailSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await signup(
				formData.email,
				formData.password,
				formData.name
			);

			console.log("Signup result:", result);

			if (result?.needsEmailVerification) {
				// Redirect to email verification page
				navigate("/verify-email", {
					state: { email: result.email, fromSignup: true },
				});
			} else {
				// User is verified and logged in, go to dashboard
				navigate("/dashboard");
			}
		} catch (error: any) {
			console.error("Signup error:", error);
			// Try to extract field errors from backend
			if (error.response?.data?.errors) {
				const serverErrors = error.response.data.errors;
				const newErrors: Record<string, string> = {};
				serverErrors.forEach((err: { field: string; message: string }) => {
					newErrors[err.field] = err.message;
				});
				setErrors(newErrors);
			} else {
				// Error is already shown via toast in AuthContext
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialSignup = (provider: "google" | "linkedin" | "facebook") => {
		// Redirect to OAuth provider
		const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
		// Remove /api if present in baseUrl
		const apiLessBaseUrl = baseUrl.replace(/\/api$/, "");
		window.location.href = `${apiLessBaseUrl}/auth/${provider}`;
	};

	const handleSetPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSetPasswordData((prev) => ({ ...prev, [name]: value }));
		if (setPasswordErrors[name]) {
			setSetPasswordErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		const errors: Record<string, string> = {};
		if (!setPasswordData.password) errors.password = "Password is required";
		if (setPasswordData.password.length < 6)
			errors.password = "Password must be at least 6 characters";
		if (setPasswordData.password !== setPasswordData.confirmPassword)
			errors.confirmPassword = "Passwords do not match";
		setSetPasswordErrors(errors);
		if (Object.keys(errors).length > 0) return;
		setSetPasswordLoading(true);
		try {
			if (!user) throw new Error("User not found");
			await api.post("/auth/social/set-password", {
				email: user.email,
				password: setPasswordData.password,
			});
			toast.success(
				"Password set successfully! You can now log in with email and password."
			);
			setShowSetPassword(false);
		} catch (err) {
			toast.error(
				(err as any)?.response?.data?.message || "Failed to set password"
			);
		} finally {
			setSetPasswordLoading(false);
		}
	};

	// --- Set Password for Existing Social Users Section ---
	const handleSetPasswordEmailCheck = async (e: React.FormEvent) => {
		e.preventDefault();
		setSetPasswordGeneralError("");
		setSetPasswordUserExists(false);
		if (!setPasswordEmail.trim()) {
			setSetPasswordGeneralError("Email is required");
			return;
		}
		setSetPasswordEmailLoading(true);
		try {
			// Check if user exists and is a social user (not manual, no password)
			const res = await api.get(
				`/auth/check-user?email=${encodeURIComponent(setPasswordEmail)}`
			);
			if (res.data && res.data.exists && res.data.isSocial) {
				setSetPasswordUserExists(true);
				setSetPasswordStep("password");
			} else if (res.data && res.data.exists && !res.data.isSocial) {
				setSetPasswordGeneralError(
					"This email is already registered with a password. Please login or reset your password."
				);
			} else {
				setSetPasswordGeneralError(
					"No user found with this email. Please sign up first."
				);
			}
		} catch (err) {
			setSetPasswordGeneralError(
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Error checking user"
			);
		} finally {
			setSetPasswordEmailLoading(false);
		}
	};

	const handleSetPasswordForSocial = async (e: React.FormEvent) => {
		e.preventDefault();
		setSetPasswordGeneralError("");
		const errors: Record<string, string> = {};
		if (!setPasswordData.password) errors.password = "Password is required";
		if (setPasswordData.password.length < 6)
			errors.password = "Password must be at least 6 characters";
		if (setPasswordData.password !== setPasswordData.confirmPassword)
			errors.confirmPassword = "Passwords do not match";
		setSetPasswordErrors(errors);
		if (Object.keys(errors).length > 0) return;
		setSetPasswordLoading(true);
		try {
			await api.post("/auth/social/set-password", {
				email: setPasswordEmail,
				password: setPasswordData.password,
			});
			toast.success(
				"Password set successfully! You can now log in with email and password."
			);
			// After setting password, check again if user is still eligible
			const res = await api.get(
				`/auth/check-user?email=${encodeURIComponent(setPasswordEmail)}`
			);
			if (res.data && res.data.exists && res.data.isSocial) {
				// Still eligible (should not happen, but fallback)
				setSetPasswordUserExists(true);
				setSetPasswordStep("password");
			} else {
				// No longer eligible, reset state and hide section for this email
				setSetPasswordStep("email");
				setSetPasswordEmail("");
				setSetPasswordData({ password: "", confirmPassword: "" });
				setSetPasswordUserExists(false);
			}
		} catch (err) {
			setSetPasswordGeneralError(
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to set password"
			);
		} finally {
			setSetPasswordLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='flex justify-center'>
					<FileText className='h-12 w-12 text-primary-600' />
				</div>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
					Welcome to ResumePilot
				</h2>
				<p className='mt-2 text-center text-sm text-gray-600'>
					Already have an account?{" "}
					<Link
						to='/login'
						className='font-medium text-primary-600 hover:text-primary-500'>
						Sign in
					</Link>
				</p>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<div className='space-y-6'>
						<div className='grid grid-cols-1 gap-3'>
							<button
								onClick={() => handleSocialSignup("google")}
								className='w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200'>
								<svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
									<path
										fill='#4285F4'
										d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
									/>
									<path
										fill='#34A853'
										d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
									/>
									<path
										fill='#FBBC05'
										d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
									/>
									<path
										fill='#EA4335'
										d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
									/>
								</svg>
								Sign up with Google
							</button>

							<button
								onClick={() => handleSocialSignup("facebook")}
								className='w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200'>
								<svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
									<path
										fill='#1877F2'
										d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
									/>
								</svg>
								Sign up with Facebook
							</button>

							<button
								onClick={() => handleSocialSignup("linkedin")}
								className='w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200'>
								<svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
									<path
										fill='#0A66C2'
										d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
									/>
								</svg>
								Sign up with LinkedIn
							</button>
						</div>

						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>
									Or sign up with email
								</span>
							</div>
						</div>

						<form onSubmit={handleEmailSignup} className='space-y-6'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700'>
									Full Name
								</label>
								<div className='mt-1'>
									<input
										id='name'
										name='name'
										type='text'
										autoComplete='name'
										required
										value={formData.name}
										onChange={handleInputChange}
										className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
											errors.name ? "border-red-300" : "border-gray-300"
										}`}
										placeholder='Enter your full name'
									/>
									{errors.name && (
										<p className='mt-1 text-sm text-red-600'>{errors.name}</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'>
									Email address
								</label>
								<div className='mt-1'>
									<input
										id='email'
										name='email'
										type='email'
										autoComplete='email'
										required
										value={formData.email}
										onChange={handleInputChange}
										className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
											errors.email ? "border-red-300" : "border-gray-300"
										}`}
										placeholder='Enter your email address'
									/>
									{errors.email && (
										<p className='mt-1 text-sm text-red-600'>{errors.email}</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<div className='mt-1 relative'>
									<input
										id='password'
										name='password'
										type={showPassword ? "text" : "password"}
										autoComplete='new-password'
										required
										value={formData.password}
										onChange={handleInputChange}
										className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
											errors.password ? "border-red-300" : "border-gray-300"
										}`}
										placeholder='Enter your password'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute inset-y-0 right-0 pr-3 flex items-center'>
										{showPassword ? (
											<EyeOff className='h-4 w-4 text-gray-400' />
										) : (
											<Eye className='h-4 w-4 text-gray-400' />
										)}
									</button>
									{errors.password && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.password}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='confirmPassword'
									className='block text-sm font-medium text-gray-700'>
									Confirm Password
								</label>
								<div className='mt-1 relative'>
									<input
										id='confirmPassword'
										name='confirmPassword'
										type={showConfirmPassword ? "text" : "password"}
										autoComplete='new-password'
										required
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
											errors.confirmPassword
												? "border-red-300"
												: "border-gray-300"
										}`}
										placeholder='Confirm your password'
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute inset-y-0 right-0 pr-3 flex items-center'>
										{showConfirmPassword ? (
											<EyeOff className='h-4 w-4 text-gray-400' />
										) : (
											<Eye className='h-4 w-4 text-gray-400' />
										)}
									</button>
									{errors.confirmPassword && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.confirmPassword}
										</p>
									)}
								</div>
							</div>

							<div>
								<Button
									type='submit'
									fullWidth
									isLoading={isLoading}
									disabled={isLoading}
									className='w-full flex justify-center py-2 px-4'>
									{isLoading ? "Creating Account..." : "Create Account"}
								</Button>
							</div>
						</form>

						{/* Divider for set password section */}
						{showSetPassword && (
							<React.Fragment>
								<div className='flex items-center my-6'>
									<div className='flex-grow border-t border-gray-200'></div>
									<span className='mx-4 text-primary-700 font-bold uppercase tracking-wide bg-primary-50 px-2 py-1 rounded shadow-sm border border-primary-200'>
										Social Logged In Users: Set Password
									</span>
									<div className='flex-grow border-t border-gray-200'></div>
								</div>
								<div className='bg-primary-50 border border-primary-200 rounded-lg p-6 mb-4 shadow-inner'>
									<p className='mb-4 text-primary-800 font-semibold text-center'>
										Set a password to enable manual (email/password) login for
										your account.
									</p>
									<form onSubmit={handleSetPassword} className='space-y-4'>
										<div>
											<label
												htmlFor='setPassword'
												className='block text-sm font-medium text-gray-700'>
												New Password
											</label>
											<div className='relative'>
												<input
													id='setPassword'
													name='password'
													type={showSetPasswordPassword ? "text" : "password"}
													autoComplete='new-password'
													value={setPasswordData.password}
													onChange={handleSetPasswordChange}
													className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
														setPasswordErrors.password
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder='Enter your new password'
												/>
												<button
													type='button'
													onClick={() => setShowSetPasswordPassword((v) => !v)}
													className='absolute inset-y-0 right-0 pr-3 flex items-center'>
													{showSetPasswordPassword ? (
														<EyeOff className='h-4 w-4 text-gray-400' />
													) : (
														<Eye className='h-4 w-4 text-gray-400' />
													)}
												</button>
											</div>
											{setPasswordErrors.password && (
												<p className='mt-1 text-sm text-red-600'>
													{setPasswordErrors.password}
												</p>
											)}
										</div>
										<div>
											<label
												htmlFor='setConfirmPassword'
												className='block text-sm font-medium text-gray-700'>
												Confirm New Password
											</label>
											<div className='relative'>
												<input
													id='setConfirmPassword'
													name='confirmPassword'
													type={showSetPasswordConfirm ? "text" : "password"}
													autoComplete='new-password'
													value={setPasswordData.confirmPassword}
													onChange={handleSetPasswordChange}
													className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
														setPasswordErrors.confirmPassword
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder='Confirm your new password'
												/>
												<button
													type='button'
													onClick={() => setShowSetPasswordConfirm((v) => !v)}
													className='absolute inset-y-0 right-0 pr-3 flex items-center'>
													{showSetPasswordConfirm ? (
														<EyeOff className='h-4 w-4 text-gray-400' />
													) : (
														<Eye className='h-4 w-4 text-gray-400' />
													)}
												</button>
											</div>
											{setPasswordErrors.confirmPassword && (
												<p className='mt-1 text-sm text-red-600'>
													{setPasswordErrors.confirmPassword}
												</p>
											)}
										</div>
										<Button
											type='submit'
											isLoading={setPasswordLoading}
											className='w-full'>
											Set Password
										</Button>
									</form>
								</div>
							</React.Fragment>
						)}

						{/* --- Set Password for Social Users Section (Visible to All) --- */}
						<div className='my-8'>
							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-gray-300' />
								</div>
								<div className='relative flex justify-center text-sm mb-5'>
									<span className='px-2 bg-white text-gray-500'>
										Set Password for Existing Social Users
									</span>
								</div>
							</div>
							<div className='bg-white border border-gray-200 rounded-lg shadow p-8'>
								{setPasswordStep === "email" && (
									<form
										onSubmit={handleSetPasswordEmailCheck}
										className='space-y-6'>
										<div>
											<label
												htmlFor='setPasswordEmail'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Enter your email (used for social login)
											</label>
											<input
												id='setPasswordEmail'
												name='setPasswordEmail'
												type='email'
												autoComplete='email'
												value={setPasswordEmail}
												onChange={(e) => setSetPasswordEmail(e.target.value)}
												className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base'
												placeholder='Enter your email'
												required
											/>
										</div>
										{setPasswordGeneralError && (
											<p className='text-sm text-red-600 text-left'>
												{setPasswordGeneralError}
											</p>
										)}
										<Button
											type='submit'
											isLoading={setPasswordEmailLoading}
											className='w-full text-base font-semibold py-3'>
											Check Email
										</Button>
									</form>
								)}
								{setPasswordStep === "password" && setPasswordUserExists && (
									<form
										onSubmit={handleSetPasswordForSocial}
										className='space-y-6'>
										<div>
											<label
												htmlFor='setPassword'
												className='block text-sm font-medium text-gray-700 mb-1'>
												New Password
											</label>
											<div className='relative'>
												<input
													id='setPassword'
													name='password'
													type={
														showSocialSetPasswordPassword ? "text" : "password"
													}
													autoComplete='new-password'
													value={setPasswordData.password}
													onChange={handleSetPasswordChange}
													className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
														setPasswordErrors.password
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder='Enter your new password'
													required
												/>
												<button
													type='button'
													onClick={() =>
														setShowSocialSetPasswordPassword((v) => !v)
													}
													className='absolute inset-y-0 right-0 pr-3 flex items-center'>
													{showSocialSetPasswordPassword ? (
														<EyeOff className='h-4 w-4 text-gray-400' />
													) : (
														<Eye className='h-4 w-4 text-gray-400' />
													)}
												</button>
											</div>
											{setPasswordErrors.password && (
												<p className='mt-1 text-sm text-red-600'>
													{setPasswordErrors.password}
												</p>
											)}
										</div>
										<div>
											<label
												htmlFor='setConfirmPassword'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Confirm New Password
											</label>
											<div className='relative'>
												<input
													id='setConfirmPassword'
													name='confirmPassword'
													type={
														showSocialSetPasswordConfirm ? "text" : "password"
													}
													autoComplete='new-password'
													value={setPasswordData.confirmPassword}
													onChange={handleSetPasswordChange}
													className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base ${
														setPasswordErrors.confirmPassword
															? "border-red-300"
															: "border-gray-300"
													}`}
													placeholder='Confirm your new password'
													required
												/>
												<button
													type='button'
													onClick={() =>
														setShowSocialSetPasswordConfirm((v) => !v)
													}
													className='absolute inset-y-0 right-0 pr-3 flex items-center'>
													{showSocialSetPasswordConfirm ? (
														<EyeOff className='h-4 w-4 text-gray-400' />
													) : (
														<Eye className='h-4 w-4 text-gray-400' />
													)}
												</button>
											</div>
											{setPasswordErrors.confirmPassword && (
												<p className='mt-1 text-sm text-red-600'>
													{setPasswordErrors.confirmPassword}
												</p>
											)}
										</div>
										{setPasswordGeneralError && (
											<p className='text-sm text-red-600 text-left'>
												{setPasswordGeneralError}
											</p>
										)}
										<Button
											type='submit'
											isLoading={setPasswordLoading}
											className='w-full text-base font-semibold py-3'>
											Set Password
										</Button>
									</form>
								)}
							</div>
						</div>
					</div>

					<div className='mt-6'>
						<div className='relative'>
							<div className='relative flex justify-center text-xs text-gray-500'>
								By continuing, you agree to our Terms of Service and Privacy
								Policy
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
