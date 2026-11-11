/**
 * Adds a sentence starter ("I liked…", "A question:") to a comment: as the
 * whole text when it is empty, on a new line otherwise. A trailing ellipsis is
 * a chip label hint, not text to insert.
 */
export const insertStarter = (text: string, starter: string): string => {
    const start = starter.replace(/(…|\.\.\.)$/, '').trimEnd() + ' '
    if (!text.trim()) {
        return start
    }
    return text.endsWith('\n') ? text + start : `${text}\n${start}`
}
