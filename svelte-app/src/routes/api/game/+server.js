import { json } from '@sveltejs/kit';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { model } from '$lib/config.js';

export async function POST({ request }) {
    const { history, language, selectedGenres, selectedThemes, char, inventory, userInput } = await request.json();

    const context = `[HP:${char.hp}/${char.maxHp}][INV:${inventory.join(',')}] ${userInput}`;
    const historyForAPI = [...history, { role: "user", parts: [{ text: context }] }];

    const sys = `
        RPG GM. Language: '${language}'.
        Mechanics: ${selectedGenres.join(', ')}.
        Setting: ${selectedThemes.join(', ')}.
        OUTPUT JSON ONLY:
        {
            "story": "HTML string", "hp_change": int, "hp_set": int, "inventory_add": ["item"],
            "inventory_remove": ["item"], "atmosphere": "string", "summary": "recap",
            "mode": "text/choice/dice", "options": ["opt1"],
            "check": {"stat":"STR","dc":10,"reason":""}, "gameOver": boolean
        }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${PRIVATE_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: historyForAPI,
                systemInstruction: { parts: [{ text: sys }] }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            return json({ error: 'API request failed', details: errorText }, { status: response.status });
        }

        const data = await response.json();
        // The Gemini API response needs careful parsing.
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const gameResponse = JSON.parse(jsonText);

        return json(gameResponse);

    } catch (e) {
        console.error("Internal Server Error:", e);
        return json({ error: 'An internal error occurred' }, { status: 500 });
    }
}
