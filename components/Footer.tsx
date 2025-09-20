
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const Footer: React.FC = () => {
  const t = useTranslations();
  return (
    <footer className="w-full mt-auto bg-white text-gray-600 border-t">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center">
        <p>{t.footer_text.replace('{year}', new Date().getFullYear().toString())}</p>
      </div>
    </footer>
  );
};

export default Footer;
