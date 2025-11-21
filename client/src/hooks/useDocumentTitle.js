import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title ? `${title} | eAdventure` : 'eAdventure - Your Education Journey';

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
