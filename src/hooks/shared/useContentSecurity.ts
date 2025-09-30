import DOMPurify from 'dompurify';

export function useContentSecurity() {
    const sanitize = (content: string): string => {
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
            ALLOWED_ATTR: ['href', 'target']
        });
    };

    return { sanitize };
} 