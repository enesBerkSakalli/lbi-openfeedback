// Pastel hues as in the LBI reference: blue, yellow, green, coral, violet, pink.
const HUES = [205, 48, 140, 12, 265, 320]

/** Colors of one person's comment group, from their (stable) number. */
export interface PersonColors {
    /** Card background, a tint of the person's hue. */
    tint: string
    /** The label background; `#1a1a1a` text on it is above 7:1. */
    strong: string
    /** Secondary text (times) on the tint, above 4.5:1. */
    muted: string
    /** Rules between the comments of the group. */
    rule: string
}

export const personColors = (
    personNumber: number,
    isDark: boolean
): PersonColors => {
    // After the six reference hues, the golden angle spreads the next ones
    const hue =
        personNumber <= HUES.length
            ? HUES[personNumber - 1]
            : Math.round((personNumber * 137.508) % 360)
    return {
        tint: isDark ? `hsl(${hue} 28% 22%)` : `hsl(${hue} 85% 93%)`,
        strong: `hsl(${hue} 72% 72%)`,
        muted: isDark ? 'rgba(255, 255, 255, 0.78)' : 'rgba(0, 0, 0, 0.7)',
        rule: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)',
    }
}
