/**
 * India Travel Pal — Voice Service
 * =====================================
 * Browser Web Speech API use karke text-to-speech karta hai.
 * Hindi, Gujarati, English — teeno languages mein sahi pronunciation ke saath.
 *
 * USAGE:
 *   import { speak, stopSpeaking, isSpeaking } from '../utils/voiceService';
 *   speak("Goa bahut sundar jagah hai!", 'hi');
 */

// ─── Language → Voice BCP-47 Language Code Mapping ───────────────────────────
const LANGUAGE_VOICE_MAP: Record<string, string[]> = {
    hi: [
        'hi-IN',       // Hindi India (primary)
        'hi',          // Hindi fallback
    ],
    gu: [
        'gu-IN',       // Gujarati India (primary)
        'gu',          // Gujarati fallback
        'hi-IN',       // Hindi fallback (closest to Gujarati phonetics)
    ],
    en: [
        'en-IN',       // English India (Indian accent — best for Indian travel content)
        'en-US',       // English US fallback
        'en-GB',       // English UK fallback
        'en',          // Generic English
    ],
};

// ─── Speech Settings per Language ─────────────────────────────────────────────
const SPEECH_SETTINGS: Record<string, { rate: number; pitch: number; volume: number }> = {
    hi: { rate: 1.05, pitch: 1.02, volume: 1.0 },
    gu: { rate: 0.98, pitch: 1.0, volume: 1.0 },
    en: { rate: 1.1, pitch: 1.05, volume: 1.0 },
};

// ─── Auto Language Detection ───────────────────────────────────────────────────
/**
 * Automatically detect if text is Hindi or English.
 *
 * Logic:
 *  1. Count Devanagari Unicode chars (\u0900–\u097F) — if any significant presence → Hindi
 *  2. If user passed a language hint ('hi'/'en') and detection is ambiguous → use hint
 *
 * @param text     - The text to analyse
 * @param langHint - Optional hint from backend ('hi' | 'en' | 'gu')
 * @returns        'hi' | 'gu' | 'en'
 */
export function detectLanguage(text: string, langHint?: string): string {
    if (!text || text.trim().length === 0) return langHint || 'en';

    // Gujarati Unicode range: \u0A80–\u0AFF
    const gujaratiCount = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
    if (gujaratiCount > 3) return 'gu';

    // Devanagari Unicode range: \u0900–\u097F (Hindi)
    const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;

    // If 1+ Devanagari characters OR >5% of total chars are Devanagari → Hindi
    if (devanagariCount >= 1 || (text.length > 10 && devanagariCount / text.length > 0.05)) {
        return 'hi';
    }

    // Use backend hint if given and non-English
    if (langHint && (langHint.startsWith('hi') || langHint === 'hi')) return 'hi';

    return 'en';
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

// ─── Global speaking tracker ──────────────────────────────────────────────────
// Tracks WHICH message is currently speaking — shared across all ChatMessage components
let _currentSpeakingId: string | null = null;
let _onStopCallback: (() => void) | null = null;

// ─── onSpeakEnd listeners — called when TTS finishes OR is stopped ───
const _speakEndListeners: Array<() => void> = [];

/** Register a callback to fire every time TTS finishes (natural end OR stopSpeaking) */
export function registerOnSpeakEnd(fn: () => void): void {
    if (!_speakEndListeners.includes(fn)) _speakEndListeners.push(fn);
}

/** Unregister a previously registered onSpeakEnd callback */
export function unregisterOnSpeakEnd(fn: () => void): void {
    const idx = _speakEndListeners.indexOf(fn);
    if (idx !== -1) _speakEndListeners.splice(idx, 1);
}

// ─── Bot speaking flag — prevents mic from picking up bot's own TTS voice ───
let _isBotSpeaking = false;

/**
 * Returns true if the bot's TTS is currently active.
 * Use this in STT onresult to discard accidental echo transcriptions.
 */
export function isBotSpeakingNow(): boolean {
    return _isBotSpeaking;
}

// ─── onSpeakStart listeners — fire the moment TTS begins ───
const _speakStartListeners: Array<() => void> = [];

/** Register a callback to fire the moment TTS starts speaking */
export function registerOnSpeakStart(fn: () => void): void {
    if (!_speakStartListeners.includes(fn)) _speakStartListeners.push(fn);
}

/** Unregister a previously registered onSpeakStart callback */
export function unregisterOnSpeakStart(fn: () => void): void {
    const idx = _speakStartListeners.indexOf(fn);
    if (idx !== -1) _speakStartListeners.splice(idx, 1);
}

/** Currently speaking message ID */
export function getCurrentSpeakingId(): string | null {
    return _currentSpeakingId;
}

/** Set which message is now speaking and register a stop callback */
export function setSpeakingId(id: string | null, onStop?: () => void): void {
    _currentSpeakingId = id;
    _onStopCallback = onStop || null;
}

/** INTERNAL: Cancel browser TTS only — does NOT fire component callbacks */
function cancelUtterance(force = false): void {
    if ('speechSynthesis' in window) {
        // If already speaking and not forced, we might want to let the queue flow
        // but typically synthesis.cancel() is needed for state resets
        if (force || !window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        currentUtterance = null;
    }
    _isBotSpeaking = false;
}

/**
 * Find the best available voice for a language
 */
function getBestVoice(language: string): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const preferredCodes = LANGUAGE_VOICE_MAP[language] || LANGUAGE_VOICE_MAP.en;

    // 1. Try for exact or prefix match in preferred codes
    for (const code of preferredCodes) {
        const match = voices.find(v => v.lang.toLowerCase() === code.toLowerCase() || v.lang.toLowerCase().startsWith(code.toLowerCase()));
        if (match) return match;
    }

    // 2. Try any voice that contains the language name in its name (e.g. "Hindi")
    const langNames: Record<string, string> = { hi: 'hindi', gu: 'gujarati', en: 'english' };
    const nameMatch = voices.find(v => v.name.toLowerCase().includes(langNames[language] || 'english'));
    if (nameMatch) return nameMatch;

    // 3. Try any voice that has a lang starting with the primary code (e.g. "hi-")
    const primaryCode = preferredCodes[0].split('-')[0].toLowerCase();
    const primaryMatch = voices.find(v => v.lang.toLowerCase().startsWith(primaryCode));
    if (primaryMatch) return primaryMatch;

    // 4. Absolute fallback — first available
    return voices[0];
}

/**
 * Clean text for speech — markdown, emojis, symbols hatao for natural Hindi/English TTS
 */
function cleanTextForSpeech(text: string): string {
    return text
        // Remove markdown headers
        .replace(/#{1,6}\s*/g, '')
        // Remove **bold** and *italic*
        .replace(/\*{1,3}(.*?)\*{1,3}/gs, '$1')
        // Remove code blocks
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
        // Remove [link text](url) → keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove ALL emoji — broad coverage using regex ranges
        // eslint-disable-next-line no-misleading-character-class
        .replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, '')
        // Remove common symbol characters
        .replace(/[➤→←↑↓►◄▶◀•●◦◘◙‣▪▸]/gu, '')
        // Remove table pipes and horizontal rules
        .replace(/\|/g, ' ')
        .replace(/---+/g, '. ')
        // Hindi danda (।) → period
        .replace(/।/g, '.')
        // ₹ → rupaye (works for Hindi and English)
        .replace(/₹\s*(\d[\d,]*)/g, '$1 rupaye')
        // Colons → natural pause
        .replace(/:\s*/g, '. ')
        // Multiple newlines → pause
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        // Remove leftover brackets
        .replace(/[()[\]{}<>]/g, ' ')
        // Clean multiple spaces
        .replace(/\s{2,}/g, ' ')
        .trim();
}

/**
 * Speak text in the given language
 * @param text - Text to speak
 * @param language - 'hi', 'gu', or 'en'
 * @param onEnd - Callback when speech ends
 */
export function speak(
    text: string,
    language: string = 'en',
    onEnd?: () => void,
    shouldCancel: boolean = true
): void {
    // Cancel only if it's the start of a new message or explicitly requested
    if (shouldCancel) {
        cancelUtterance(true);
    }

    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser');
        return;
    }

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
        onEnd?.();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const settings = SPEECH_SETTINGS[language] || SPEECH_SETTINGS.en;

    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Set language code
    const langCodes = LANGUAGE_VOICE_MAP[language] || LANGUAGE_VOICE_MAP.en;
    utterance.lang = langCodes[0];

    // Try to set best voice (voices may not load immediately)
    const setVoiceAndSpeak = () => {
        const voice = getBestVoice(language);
        if (voice) {
            utterance.voice = voice;
        }

        if (onEnd) {
            utterance.onend = () => {
                _isBotSpeaking = false;
                onEnd();
                // Natural end — notify auto-resume listeners
                _speakEndListeners.forEach(fn => fn());
            };
        } else {
            utterance.onend = () => {
                _isBotSpeaking = false;
                // Natural end — notify auto-resume listeners
                _speakEndListeners.forEach(fn => fn());
            };
        }

        utterance.onerror = (e) => {
            _isBotSpeaking = false;
            console.warn('Speech error:', e.error);
            onEnd?.();
        };

        currentUtterance = utterance;
        _isBotSpeaking = true;         
        _speakStartListeners.forEach(fn => fn()); 
        
        // Fix for Chrome/Edge: resume() before speak() to prevent silent state
        if ('speechSynthesis' in window) {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
        }
    };

    // Voices might not be loaded yet
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        // Wait for voices to load
        const voiceLoader = () => {
            if (window.speechSynthesis.getVoices().length > 0) {
                window.speechSynthesis.removeEventListener('voiceschanged', voiceLoader);
                setVoiceAndSpeak();
            }
        };
        window.speechSynthesis.addEventListener('voiceschanged', voiceLoader);

        // Timeout fallback — long waits felt like "voice is broken"
        setTimeout(() => {
            window.speechSynthesis.removeEventListener('voiceschanged', voiceLoader);
            setVoiceAndSpeak();
        }, 380);
    } else {
        setVoiceAndSpeak();
    }
}

/**
 * Stop current speech and notify the speaking component
 * @param fireEndListeners - set to false to prevent triggering auto-resume (default: true for natural end)
 */
export function stopSpeaking(fireEndListeners = false): void {
    _isBotSpeaking = false;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
    }
    // Synchronously notify the speaking component to reset its button/highlight state
    if (_onStopCallback) {
        const cb = _onStopCallback;
        _onStopCallback = null;
        _currentSpeakingId = null;
        cb();
    } else {
        _currentSpeakingId = null;
    }
    // Only fire onSpeakEnd listeners when explicitly requested (natural end)
    // Manual stops (user clicked stop, page changed) should NOT trigger auto-resume
    if (fireEndListeners) {
        _speakEndListeners.forEach(fn => fn());
    }
}

/**
 * Check if currently speaking (running)
 */
export function isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused;
}

/**
 * Check if currently paused
 */
export function isPaused(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.paused;
}

/**
 * Pause current speech
 */
export function pauseSpeaking(): void {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
    }
}

/**
 * Resume paused speech
 */
export function resumeSpeaking(): void {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
    }
}

/**
 * Get available voices for a language (for debugging)
 */
export function getAvailableVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const voices = window.speechSynthesis.getVoices();
    const codes = LANGUAGE_VOICE_MAP[language] || [];
    return voices.filter(v =>
        codes.some(code => v.lang === code || v.lang.startsWith(code.split('-')[0]))
    );
}

/** Prime async voice list (Chrome loads voices after first interaction / event) */
if (typeof window !== 'undefined' && window.speechSynthesis) {
    const primeVoices = () => {
        try {
            window.speechSynthesis.getVoices();
        } catch {
            /* ignore */
        }
    };
    primeVoices();
    window.speechSynthesis.addEventListener('voiceschanged', primeVoices, { once: true });
}
