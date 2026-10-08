import { Metadata } from 'next';
import { AuthLayout, LoginForm } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Log in to SOLA | Speak a brighter you',
  description: 'Log in to continue your English learning journey on SOLA.',
};

export default function LoginPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}

