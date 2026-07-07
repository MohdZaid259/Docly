import GoogleLoginButton from "../components/GoogleButton";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/70 p-6 text-center shadow-[0_25px_120px_-25px_rgba(129,140,248,0.6)] backdrop-blur-xl sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">IDoc</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to manage and preview your documents in one calm, elegant workspace.
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;