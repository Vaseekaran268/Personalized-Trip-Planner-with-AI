import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import { UserIcon, MailIcon, LockIcon, WandSparklesIcon } from './IconComponents';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t.login_error_all_fields);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError(t.login_error_invalid_email);
        return;
    }
    setError('');
    login({ name, email });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12 text-center bg-gray-50">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">{t.login_title}</h1>
            <p className="text-gray-600">{t.login_subtitle}</p>
        </div>
        <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.login_name_label}</label>
                    <div className="mt-1 relative">
                        <UserIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.login_email_label}</label>
                    <div className="mt-1 relative">
                        <MailIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">{t.login_password_label}</label>
                    <div className="mt-1 relative">
                        <LockIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105"
                    >
                        <WandSparklesIcon className="w-5 h-5 mr-2" />
                        {t.login_button}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Login;
