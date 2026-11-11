import { describe, expect, test } from 'vitest'
import { personColors } from './personColors'

describe('personColors', () => {
    test('gives the first twelve people twelve different cards', () => {
        const tints = Array.from(
            { length: 12 },
            (_, i) => personColors(i + 1).tint
        )
        expect(new Set(tints).size).toBe(12)
    })
})
