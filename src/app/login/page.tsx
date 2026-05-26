import { loginAction } from '@/actions/auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === '1';

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div className="login-title">Kenilworth Home</div>
          <div className="login-subtitle">Enter password to continue</div>
        </div>

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoFocus
              autoComplete="current-password"
              className={`input${hasError ? ' input--error' : ''}`}
            />
            {hasError && (
              <p className="field-error">Incorrect password</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
