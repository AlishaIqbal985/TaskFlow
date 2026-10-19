
import { useState } from "react";
import api from "../services/api.js";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ListTodo,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

const initialResetToken =
  new URLSearchParams(window.location.search).get("resetToken") || "";

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState(
    initialResetToken ? "reset" : "login",
  );
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateName(value) {
    const fullName = value.trim();

    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(fullName)) {
      return "Name must contain only English letters and spaces.";
    }

    if (fullName.split(/\s+/).length < 2) {
      return "Please enter your first name and last name.";
    }

    return "";
  }

  function validateEmail(value) {
    const emailValue = value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  function validatePassword(value) {
    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Za-z]/.test(value)) {
      return "Password must contain at least one letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character, such as @, #, or !.";
    }

    return "";
  }

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function clearResetTokenFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("resetToken");

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();

    if (mode !== "reset") {
      const emailError = validateEmail(normalizedEmail);

      if (emailError) {
        setError(emailError);
        return;
      }
    }

    if (mode === "register") {
      const nameError = validateName(name);

      if (nameError) {
        setError(nameError);
        return;
      }
    }

    if (mode === "register" || mode === "reset") {
      const passwordError = validatePassword(password);

      if (passwordError) {
        setError(passwordError);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (mode === "login" && !password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "reset" && !resetToken) {
      setError(
        "This password reset link is missing or invalid. Please request a new link.",
      );
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "register") {
        await api.post("/api/auth/register", {
          name: name.trim().replace(/\s+/g, " "),
          email: normalizedEmail,
          password,
        });

        setMode("login");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);

        setSuccess(
          "Account created successfully! Please log in to continue.",
        );
        return;
      }

      if (mode === "forgot") {
        const response = await api.post("/api/auth/forgot-password", {
          email: normalizedEmail,
        });

        setSuccess(
          response.data.message ||
            "If an account exists for this email, a password reset link will be sent.",
        );
        return;
      }

      if (mode === "reset") {
        const response = await api.post("/api/auth/reset-password", {
          token: resetToken,
          password,
        });

        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setResetToken("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        clearResetTokenFromUrl();

        setSuccess(
          response.data.message ||
            "Password reset successful. Please log in with your new password.",
        );
        return;
      }

      const response = await api.post("/api/auth/login", {
        email: normalizedEmail,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem("taskflow-token", token);
      onAuthenticated(user);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    clearMessages();
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (nextMode !== "reset") {
      setResetToken("");
      clearResetTokenFromUrl();
    }
  }

  const isPasswordMode = mode === "login" || mode === "register" || mode === "reset";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const heading = {
    login: "Welcome back",
    register: "Create your account",
    forgot: "Forgot your password?",
    reset: "Create a new password",
  }[mode];

  const description = {
    login: "Sign in to continue managing your tasks.",
    register: "Create an account to start your personal workspace.",
    forgot: "Enter your registered email and we'll send a reset link.",
    reset: "Choose a strong new password for your TaskFlow account.",
  }[mode];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-800 p-10 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <ListTodo size={27} />
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight">
              TaskFlow
            </h1>

            <p className="mt-4 max-w-sm text-lg leading-8 text-teal-50/80">
              Organize your work, focus on your priorities, and make progress
              every day.
            </p>
          </div>

          <div className="relative space-y-4">
            {[
              "Keep your tasks organized",
              "Track priorities and deadlines",
              "Access your own workspace",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-sm text-white/90"
              >
                <CheckCircle2 size={19} className="shrink-0 text-teal-300" />
                {feature}
              </div>
            ))}

            <p className="pt-8 text-xs text-white/50">
              Your productivity, in one place.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
              <ListTodo size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              TaskFlow
            </span>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wider text-teal-700">
              YOUR PERSONAL WORKSPACE
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {heading}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          {(mode === "login" || isRegister) && (
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  isRegister
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Register
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
                  <UserRound size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    maxLength={60}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      clearMessages();
                    }}
                    placeholder="e.g. Alisha Iqbal"
                    required
                    disabled={isLoading}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-slate-900 outline-none focus:ring-0"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Enter your first name and last name.
                </p>
              </div>
            )}

            {mode !== "reset" && (
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
                  <Mail size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearMessages();
                    }}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-slate-900 outline-none focus:ring-0"
                  />
                </div>
              </div>
            )}

            {isPasswordMode && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="auth-password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {isReset ? "New password" : "Password"}
                  </label>

                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
                  <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    minLength={mode === "login" ? undefined : 8}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      clearMessages();
                    }}
                    placeholder={
                      mode === "login"
                        ? "Enter your password"
                        : "Create a strong password"
                    }
                    required
                    disabled={isLoading}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-slate-900 outline-none focus:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {(isRegister || isReset) && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    At least 8 characters, including a letter, a number, and
                    a special character such as @ or #.
                  </p>
                )}
              </div>
            )}

            {(isRegister || isReset) && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
                  <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      clearMessages();
                    }}
                    placeholder="Enter your password again"
                    required
                    disabled={isLoading}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-slate-900 outline-none focus:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="shrink-0 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <p>{success}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <LoaderCircle size={19} className="animate-spin" />
              )}

              {isLoading
                ? "Please wait..."
                : mode === "login"
                  ? "Log In"
                  : isRegister
                    ? "Create Account"
                    : isForgot
                      ? "Send Reset Link"
                      : "Reset Password"}
            </button>
          </form>

          {mode === "forgot" || isReset ? (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <ArrowLeft size={17} />
              Back to Log In
            </button>
          ) : (
            <p className="mt-6 text-center text-sm text-slate-500">
              {mode === "login"
                ? "New to TaskFlow?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "login" ? "register" : "login")
                }
                className="font-semibold text-teal-700 hover:text-teal-800"
              >
                {mode === "login" ? "Create account" : "Log in"}
              </button>
            </p>
          )}

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Your tasks are linked to your account. Never share your password
            with anyone.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Auth;
