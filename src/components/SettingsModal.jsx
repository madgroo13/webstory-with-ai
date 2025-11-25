import React, { useState, useEffect } from 'react';
import { checkApiKeyValidity } from '/src/api/gemini.js';
import GamingDropdown from './GamingDropdown'; // Import the new dropdown component

const SettingsModal = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [feedback, setFeedback] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const storedKey = localStorage.getItem('gemini_api_key') || '';
            const storedModels = JSON.parse(localStorage.getItem('gemini_models') || '[]');
            const storedSelectedModel = localStorage.getItem('gemini_model') || (storedModels.length > 0 ? storedModels[0] : '');

            setApiKey(storedKey);
            setModels(storedModels);
            setSelectedModel(storedSelectedModel);
            setFeedback({ text: '', type: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCheckKey = async () => {
        setIsLoading(true);
        setFeedback({ text: 'Mengecek...', type: 'loading' });

        const result = await checkApiKeyValidity(apiKey);

        setIsLoading(false);
        if (result.success) {
            setFeedback({ text: 'API Key valid! Model berhasil dimuat.', type: 'success' });
            setModels(result.models);
            localStorage.setItem('gemini_models', JSON.stringify(result.models));
            // Automatically select the first model if none is selected
            if (!selectedModel && result.models.length > 0) {
                setSelectedModel(result.models[0]);
            }
        } else {
            setFeedback({ text: result.message || 'API Key tidak valid.', type: 'error' });
            setModels([]);
        }
    };

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('gemini_model', selectedModel);
        alert("Pengaturan Disimpan!");
        onClose();
    };

    // Format models for the GamingDropdown component
    const dropdownOptions = models.map(model => ({
        value: model,
        label: model
    }));

    return (
        <div className="modal-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-box w-full max-w-md bg-slate-950/80 backdrop-blur-xl border-cyan-500/30">
                <h3 className="text-cyan-400 border-b border-cyan-500/20 pb-2 mb-6 font-mono tracking-widest">🔑 PENGATURAN API</h3>

                <div className="space-y-6">
                    <div className="input-group">
                        <label className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest pl-1 font-mono">
                            Google Gemini API Key
                        </label>
                        <div className="flex items-center bg-slate-900 border-2 border-slate-700 rounded-none overflow-hidden focus-within:border-cyan-500 transition-colors">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="flex-grow bg-transparent p-3 text-white outline-none font-mono"
                                placeholder="Paste key di sini..."
                            />
                            <button onClick={handleCheckKey} disabled={isLoading} className="bg-slate-800 hover:bg-cyan-500 hover:text-black disabled:bg-slate-900 disabled:cursor-not-allowed text-cyan-400 font-bold py-3 px-4 transition-colors uppercase tracking-wider text-sm">
                                {isLoading ? '...' : 'Cek'}
                            </button>
                        </div>
                        {feedback.text && (
                            <div className={`mt-2 text-xs p-2 rounded-none ${
                                feedback.type === 'success' ? 'bg-cyan-950/50 text-cyan-300' :
                                feedback.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                                {feedback.text}
                            </div>
                        )}
                    </div>

                    <GamingDropdown
                        label="Model Gemini"
                        options={dropdownOptions}
                        selected={selectedModel}
                        onSelect={setSelectedModel}
                    />

                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-dashed border-slate-700">
                    <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-none uppercase text-xs tracking-widest">Batal</button>
                    <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-none uppercase text-xs tracking-widest">Simpan</button>
                </div>
                 <div style={{ marginTop: '15px', fontSize: '0.8rem', textAlign: 'center' }}>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }} data-i18n="link-get-key">Dapatkan API Key di sini</a>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;