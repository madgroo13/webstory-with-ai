import React from 'react';
import { useGame } from './hooks/useGame';
import SettingsModal from './components/SettingsModal'; // Import the new component

// --- Placeholder Screen Components ---
const LanguageScreen = ({ onLanguageSelect }) => (
    <div id="screen-language" className="screen-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="screen-title">SELECT LANGUAGE</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Ketik bahasa yang Anda inginkan untuk cerita.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <input type="text" id="input-language" placeholder="Indonesia, English, Jawa, Sunda..."
                style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', width: '250px', textAlign: 'center' }}
                onKeyDown={(e) => { if (e.key === 'Enter') onLanguageSelect(e.target.value); }} />
            <button className="big-btn" onClick={() => onLanguageSelect(document.getElementById('input-language').value)}>LANJUT / NEXT</button>
        </div>
    </div>
);
const MenuScreen = () => <div id="screen-menu" className="screen-overlay" style={{display: 'flex'}}>Setup Dunia</div>;
const CharScreen = () => <div id="screen-char" className="screen-overlay" style={{display: 'flex'}}>Karakter</div>;
const GameScreen = () => <div id="game-container">Game UI</div>;


function App() {
    const { state, actions } = useGame();

    const renderActiveScreen = () => {
        switch (state.activeScreen) {
            case 'language':
                return <LanguageScreen onLanguageSelect={actions.setLanguage} />;
            case 'menu':
                return <MenuScreen />;
            case 'character':
                return <CharScreen />;
            case 'game':
                return <GameScreen />;
            default:
                return <LanguageScreen onLanguageSelect={actions.setLanguage} />;
        }
    };

    return (
        <>
            {/* BG */}
            <div id="dynamic-bg" className="bg-neutral"></div>

            {/* Main Content */}
            {renderActiveScreen()}

            {/* Global UI Elements */}
            <SettingsModal
                isOpen={state.isSettingsModalOpen}
                onClose={actions.closeSettingsModal}
            />

            {/* We will add Sidebar and other global elements back later */}
        </>
    );
}

export default App;