import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Briefcase } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
});

type FormData = z.infer<typeof schema>;

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function CreateWorkspaceModal({ onClose, onSubmit }: CreateWorkspaceModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: FormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-xl transform transition-all animate-fade-in"
        style={{ '--delay': '0.1s' } as React.CSSProperties}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Workspace</h2>
              <p className="text-sm text-gray-500">Create a new workspace for your agents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              placeholder="My Workspace"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Workspace</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}