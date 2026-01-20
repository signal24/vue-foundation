export function highlight(text: string, searchTerm: string): string {
    if (!searchTerm) {
        return text;
    }

    const lowerCaseText = text.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let startIndex = 0;
    let result = '';

    while (startIndex < text.length) {
        const index = lowerCaseText.indexOf(lowerCaseSearchTerm, startIndex);
        if (index === -1) {
            result += text.substring(startIndex);
            break;
        }
        result += text.substring(startIndex, index);
        result += `<mark>${text.substring(index, index + searchTerm.length)}</mark>`;
        startIndex = index + searchTerm.length;
    }

    return result;
}
