
import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const LoadingSpinner: React.FC = () => {
    const t = useTranslations();
    const loadingMessages = t.loadingMessages;
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [loadingMessages.length]);

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
            <p className="mt-6 text-lg text-brand-secondary font-semibold transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default LoadingSpinner;
