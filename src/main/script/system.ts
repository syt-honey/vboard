/**
 * used to open system preferences panel on macOS
 * only for macOS
 */
export const systemPreferencesKey = {
    // default path
    normal: 'Privacy',
    camera: 'Privacy_Camera',
    microphone: 'Privacy_Microphone',
    // Screen Recording is not available to open directly, so we use Privacy instead which is the parent path.
    // see: https://gist.github.com/rmcdongit/f66ff91e0dad78d4d6346a75ded4b751#privacy-anchors
    screen: 'Privacy'
} as const

export type MediaType = keyof typeof systemPreferencesKey

export const systemPreferencesShell = (mediaType: MediaType | string): string => {
    if (systemPreferencesKey[mediaType]) {
        return `x-apple.systempreferences:com.apple.preference.security?${systemPreferencesKey[mediaType]}`
    } else {
        return `x-apple.systempreferences:com.apple.preference.security?${systemPreferencesKey.normal}`
    }
}
