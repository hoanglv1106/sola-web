import { Metadata } from 'next';
import { AuthLayout, RegisterForm } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Create your account | SOLA',
  description: 'Join SOLA and start your English learning journey today.',
};

export default function RegisterPage() {
  return (
    <AuthLayout variant="register">
      <RegisterForm />
    </AuthLayout>
  );
}
