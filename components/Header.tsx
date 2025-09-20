import React, { useState } from 'react';
import { CompassIcon, GlobeIcon, LogOutIcon } from './IconComponents';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const t = useTranslations();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ml', name: 'മലയാളം' }
  ];

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsLangOpen(false);
  };

  const selectedLanguageName = languages.find(l => l.code === language)?.name;

  return (
    <header className="bg-brand-primary text-white shadow-md w-full">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <CompassIcon className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold tracking-tight">{t.appTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm font-medium">{t.header_welcome.replace('{name}', user.name)}</span>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md bg-brand-secondary hover:bg-opacity-80 transition text-sm"
                title={t.header_logout}
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-brand-secondary hover:bg-opacity-80 transition"
              aria-haspopup="true"
              aria-expanded={isLangOpen}
            >
              <GlobeIcon className="w-5 h-5" />
              <span className="hidden md:inline">{selectedLanguageName}</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                {languages.map(lang => (
                  <a
                    key={lang.code}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange(lang.code);
                    }}
                    className={`block px-4 py-2 text-sm ${language === lang.code ? 'font-bold text-brand-primary' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    {lang.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;