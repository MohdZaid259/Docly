import GoogleLoginButton from "../components/GoogleButton";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Docly</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground sm:text-5xl">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
