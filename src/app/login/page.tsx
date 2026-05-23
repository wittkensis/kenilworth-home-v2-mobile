import { loginAction } from '@/actions/auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === '1';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
         style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Kenilworth Home
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter password to continue
          </div>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoFocus
              autoComplete="current-password"
              className="w-full"
              style={{
                background: 'var(--surface)',
                border: hasError ? '1px solid var(--danger)' : '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '16px',
                color: 'var(--text)',
              }}
            />
            {hasError && (
              <p className="mt-2 text-sm" style={{ color: 'var(--danger)' }}>
                Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#1A1A1A' }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
