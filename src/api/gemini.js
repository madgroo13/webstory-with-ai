export async function checkApiKeyValidity(apiKey) {
    if (!apiKey) {
        return { success: false, message: "API Key tidak boleh kosong." };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            if (data.models && data.models.length > 0) {
                const compatibleModels = data.models
                    .filter(model => model.supportedGenerationMethods.includes("generateContent"))
                    .map(model => model.name.split('/').pop()); // Return just the model ID

                if (compatibleModels.length > 0) {
                    return { success: true, models: compatibleModels };
                } else {
                    return { success: false, message: "Kunci valid, tetapi tidak ada model yang kompatibel ditemukan." };
                }
            } else {
                return { success: false, message: "Kunci valid, tetapi tidak ada model yang tersedia." };
            }
        }

        if (data.error) {
            if (data.error.code === 400) {
                 return { success: false, message: "API Key tidak valid atau salah format." };
            }
            return { success: false, message: `Error: ${data.error.message}` };
        }

        return { success: false, message: `Gagal memvalidasi. Status: ${response.status}` };

    } catch (e) {
        console.error("API Key check failed:", e);
        return { success: false, message: "Gagal terhubung ke server Google. Periksa koneksi internet Anda." };
    }
}
