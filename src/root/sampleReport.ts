// An invented example of a FeedbackY report, shown on the start page. It
// describes no real manuscript. Kept in English, like a written report.
export type FindingKind = 'Error' | 'Should fix' | 'Style'

export const SAMPLE_REPORT = {
    title: 'Example manuscript check',
    scope: 'Report only',
    meta: [
        'draft v3',
        '12 pages',
        '0 build errors',
        '2 undefined references',
        'Figures checked',
    ],
    counts: [
        { label: 'Errors', value: '4' },
        { label: 'Should fix', value: '11' },
        { label: 'Style', value: '9' },
        { label: 'Writing patterns', value: '≈40' },
        { label: 'Needs decision', value: '3' },
    ],
    findings: [
        {
            kind: 'Error',
            where: 'results.tex:42',
            text: 'Table 2 reports n = 48, but the methods describe 52 participants. Give one number and say where the other four went.',
        },
        {
            kind: 'Error',
            where: 'methods.tex:17',
            text: 'The interval is called a 95% confidence interval but is computed as ±1 SD. Use 1.96 × SE, or call it what it is.',
        },
        {
            kind: 'Should fix',
            where: 'Fig. 3',
            text: 'The y-axis has no unit and the caption does not say what the error bars show.',
        },
        {
            kind: 'Style',
            where: 'intro.tex:5',
            text: 'Two sentences repeat the abstract word for word. Keep one.',
        },
    ] satisfies { kind: FindingKind; where: string; text: string }[],
}
