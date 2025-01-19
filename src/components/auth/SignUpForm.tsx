import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../providers/AuthProvider';
import { UserPlus } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SignUpForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>
        
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-xl">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}