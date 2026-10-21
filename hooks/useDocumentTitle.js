'use client';

import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.title = title ? `${title} | Global Pathway Hub` : 'Global Pathway Hub';
        }
    }, [title]);
};
