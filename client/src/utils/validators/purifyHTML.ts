import DOMPurify from 'dompurify';

export default function (HTMLLine: string) {
    return DOMPurify.sanitize(HTMLLine, {
        ALLOWED_TAGS: ['p', 'em', 'strong', 'u', 'ul', 'li', 'h1', 'h2', 'blockquote'],
    })
}