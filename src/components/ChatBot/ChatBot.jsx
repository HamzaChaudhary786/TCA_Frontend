import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ChatBot.css';
import { BACKEND_URL } from '../../constants/api';

const INITIAL_GREETING = {
    role: 'assistant',
    content: 'Hi! I am your AI assistant. How can I help you today? You can also switch to the Image or Voice tabs above! 🎨🎤',
};

// ─── small helpers ──────────────────────────────────────────────────────────
const isSpeechAvailable = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
const SpeechRecognitionAPI = isSpeechAvailable
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

// ─── main component ──────────────────────────────────────────────────────────
const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'image' | 'voice'

    // ── Chat state ──────────────────────────────────────────────────────────
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([INITIAL_GREETING]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    // ── Image state ─────────────────────────────────────────────────────────
    const [imgMode, setImgMode] = useState('generate'); // 'generate' | 'analyze'
    const [imgPrompt, setImgPrompt] = useState('');
    const [imgLoading, setImgLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null); // { mimeType, data }
    const [generatedText, setGeneratedText] = useState('');

    const [uploadedFile, setUploadedFile] = useState(null);   // File object
    const [uploadPreview, setUploadPreview] = useState('');    // data-url for preview
    const [analyzePrompt, setAnalyzePrompt] = useState('Describe this image in detail.');
    const [analyzeResult, setAnalyzeResult] = useState('');

    // ── Voice state ─────────────────────────────────────────────────────────
    const [voiceText, setVoiceText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceChatHistory, setVoiceChatHistory] = useState([INITIAL_GREETING]);
    const [voiceLoading, setVoiceLoading] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const recognitionRef = useRef(null);
    const voiceChatEndRef = useRef(null);

    // ─── auto-scroll ─────────────────────────────────────────────────────────
    const scrollToBottom = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => { scrollToBottom(chatEndRef); }, [chatHistory]);
    useEffect(() => { scrollToBottom(voiceChatEndRef); }, [voiceChatHistory]);

    // ─── TEXT CHAT ────────────────────────────────────────────────────────────
    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!message.trim()) return;

        const newHistory = [...chatHistory, { role: 'user', content: message }];
        setChatHistory(newHistory);
        setMessage('');
        setChatLoading(true);

        try {
            const historyToSend = chatHistory.filter(m => m !== INITIAL_GREETING);
            const { data } = await axios.post(`${BACKEND_URL}/chat`, {
                message,
                history: historyToSend,
            }, { withCredentials: true });

            setChatHistory([...newHistory, { role: 'assistant', content: data.data }]);
        } catch {
            setChatHistory([...newHistory, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // ─── IMAGE GENERATION ─────────────────────────────────────────────────────
    const handleGenerateImage = async (e) => {
        e.preventDefault();
        if (!imgPrompt.trim()) return;

        setImgLoading(true);
        setGeneratedImage(null);
        setGeneratedText('');

        try {
            const { data } = await axios.post(`${BACKEND_URL}/chat/generate-image`, {
                prompt: imgPrompt
            }, { withCredentials: true });

            if (data.type === 'image') {
                setGeneratedImage({ mimeType: data.mimeType, data: data.data });
            } else {
                setGeneratedText(data.data);
            }
        } catch (err) {
            setGeneratedText(`❌ ${err.response?.data?.message || 'Image generation failed. Please try again.'}`);
        } finally {
            setImgLoading(false);
        }
    };

    // ─── IMAGE ANALYSIS ───────────────────────────────────────────────────────
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFile(file);
        setAnalyzeResult('');
        const reader = new FileReader();
        reader.onloadend = () => setUploadPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleAnalyzeImage = async (e) => {
        e.preventDefault();
        if (!uploadedFile) return;

        setImgLoading(true);
        setAnalyzeResult('');

        try {
            const form = new FormData();
            form.append('image', uploadedFile);
            form.append('prompt', analyzePrompt || 'Describe this image in detail.');

            const { data } = await axios.post(`${BACKEND_URL}/chat/analyze-image`, form, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAnalyzeResult(data.data);
        } catch (err) {
            setAnalyzeResult(`❌ ${err.response?.data?.message || 'Analysis failed. Please try again.'}`);
        } finally {
            setImgLoading(false);
        }
    };

    const downloadImage = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = `data:${generatedImage.mimeType};base64,${generatedImage.data}`;
        link.download = 'ai-generated-image.png';
        link.click();
    };

    // ─── VOICE (Speech Recognition + TTS) ────────────────────────────────────
    const speak = useCallback((text) => {
        if (!ttsEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 1;
        utt.pitch = 1;
        window.speechSynthesis.speak(utt);
    }, [ttsEnabled]);

    const sendVoiceMessage = async (text) => {
        if (!text.trim()) return;

        const newHistory = [...voiceChatHistory, { role: 'user', content: text }];
        setVoiceChatHistory(newHistory);
        setVoiceLoading(true);

        try {
            const historyToSend = voiceChatHistory.filter(m => m !== INITIAL_GREETING);
            const { data } = await axios.post(`${BACKEND_URL}/chat`, {
                message: text,
                history: historyToSend,
            }, { withCredentials: true });

            setVoiceChatHistory([...newHistory, { role: 'assistant', content: data.data }]);
            speak(data.data);
        } catch {
            const errMsg = "Sorry, I couldn't process that. Please try again.";
            setVoiceChatHistory([...newHistory, { role: 'assistant', content: errMsg }]);
        } finally {
            setVoiceLoading(false);
        }
    };

    const handleMicClick = () => {
        if (!SpeechRecognitionAPI) return;

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceText(transcript);
            // Auto-send after transcription
            sendVoiceMessage(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const handleVoiceTextSend = (e) => {
        e.preventDefault();
        if (!voiceText.trim()) return;
        sendVoiceMessage(voiceText);
        setVoiceText('');
    };

    // ─── JSX ──────────────────────────────────────────────────────────────────
    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Toggle button */}
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)} title="Open AI Assistant">
                    <span className="chat-icon">🤖</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <div className="ai-avatar">✨</div>
                            <div>
                                <h3>AI Assistant</h3>
                                <span className="ai-status">Online</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    {/* Tab bar */}
                    <div className="chat-tabs">
                        <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                            💬 Chat
                        </button>
                        <button className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`} onClick={() => setActiveTab('image')}>
                            🎨 Image
                        </button>
                        <button className={`tab-btn ${activeTab === 'voice' ? 'active' : ''}`} onClick={() => setActiveTab('voice')}>
                            🎤 Voice
                        </button>
                    </div>

                    {/* ── CHAT TAB ── */}
                    {activeTab === 'chat' && (
                        <>
                            <div className="chat-messages">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`message ${msg.role}`}>
                                        <div className="message-content">{msg.content}</div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="message assistant loading">
                                        <div className="typing-indicator">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your message…"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={chatLoading}
                                />
                                <button type="submit" disabled={chatLoading || !message.trim()} className="send-btn">
                                    ➤
                                </button>
                            </form>
                        </>
                    )}

                    {/* ── IMAGE TAB ── */}
                    {activeTab === 'image' && (
                        <div className="image-tab">
                            {/* Sub-mode toggle */}
                            <div className="img-mode-toggle">
                                <button
                                    className={`img-mode-btn ${imgMode === 'generate' ? 'active' : ''}`}
                                    onClick={() => setImgMode('generate')}
                                >
                                    ✨ Generate
                                </button>
                                <button
                                    className={`img-mode-btn ${imgMode === 'analyze' ? 'active' : ''}`}
                                    onClick={() => setImgMode('analyze')}
                                >
                                    🔍 Analyze
                                </button>
                            </div>

                            {/* GENERATE */}
                            {imgMode === 'generate' && (
                                <div className="img-panel">
                                    <form onSubmit={handleGenerateImage} className="img-form">
                                        <textarea
                                            className="img-prompt-input"
                                            placeholder="Describe the image you want to create…&#10;e.g. A cartoon robot teaching in a classroom"
                                            value={imgPrompt}
                                            onChange={(e) => setImgPrompt(e.target.value)}
                                            rows={3}
                                            disabled={imgLoading}
                                        />
                                        <button type="submit" disabled={imgLoading || !imgPrompt.trim()} className="img-submit-btn">
                                            {imgLoading ? '⏳ Generating…' : '✨ Generate Image'}
                                        </button>
                                    </form>

                                    <div className="img-result">
                                        {imgLoading && (
                                            <div className="img-loading">
                                                <div className="img-loading-spinner" />
                                                <p>Creating your image…</p>
                                            </div>
                                        )}
                                        {generatedImage && !imgLoading && (
                                            <div className="gen-image-wrapper">
                                                <img
                                                    src={`data:${generatedImage.mimeType};base64,${generatedImage.data}`}
                                                    alt="AI Generated"
                                                    className="gen-image"
                                                />
                                                <button className="download-btn" onClick={downloadImage}>
                                                    ⬇ Download
                                                </button>
                                            </div>
                                        )}
                                        {generatedText && !imgLoading && (
                                            <div className="gen-text-result">{generatedText}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ANALYZE */}
                            {imgMode === 'analyze' && (
                                <div className="img-panel">
                                    <form onSubmit={handleAnalyzeImage} className="img-form">
                                        <label className="file-drop-zone" htmlFor="img-upload">
                                            {uploadPreview ? (
                                                <img src={uploadPreview} alt="Preview" className="upload-preview" />
                                            ) : (
                                                <>
                                                    <span className="drop-icon">📁</span>
                                                    <span>Click to upload an image</span>
                                                    <span className="drop-sub">PNG, JPG, WEBP (max 10 MB)</span>
                                                </>
                                            )}
                                            <input
                                                id="img-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                hidden
                                            />
                                        </label>

                                        <input
                                            type="text"
                                            className="analyze-prompt-input"
                                            placeholder="What do you want to know? (optional)"
                                            value={analyzePrompt}
                                            onChange={(e) => setAnalyzePrompt(e.target.value)}
                                            disabled={imgLoading}
                                        />

                                        <button type="submit" disabled={imgLoading || !uploadedFile} className="img-submit-btn">
                                            {imgLoading ? '⏳ Analyzing…' : '🔍 Analyze Image'}
                                        </button>
                                    </form>

                                    {analyzeResult && (
                                        <div className="analyze-result">
                                            <h4>AI Analysis</h4>
                                            <p>{analyzeResult}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── VOICE TAB ── */}
                    {activeTab === 'voice' && (
                        <div className="voice-tab">
                            {/* TTS toggle */}
                            <div className="tts-bar">
                                <span>🔊 Speak AI replies</span>
                                <button
                                    className={`tts-toggle ${ttsEnabled ? 'on' : 'off'}`}
                                    onClick={() => setTtsEnabled(t => !t)}
                                >
                                    {ttsEnabled ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            {/* Voice chat messages */}
                            <div className="chat-messages voice-messages">
                                {voiceChatHistory.map((msg, i) => (
                                    <div key={i} className={`message ${msg.role}`}>
                                        <div className="message-content">{msg.content}</div>
                                    </div>
                                ))}
                                {voiceLoading && (
                                    <div className="message assistant loading">
                                        <div className="typing-indicator">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                )}
                                <div ref={voiceChatEndRef} />
                            </div>

                            {/* Mic button */}
                            <div className="mic-area">
                                {isSpeechAvailable ? (
                                    <button
                                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                                        onClick={handleMicClick}
                                        title={isListening ? 'Stop listening' : 'Start speaking'}
                                    >
                                        {isListening ? '⏹' : '🎤'}
                                    </button>
                                ) : (
                                    <p className="no-mic">Speech recognition is not supported in this browser. Please use Chrome or Edge.</p>
                                )}
                                {isListening && <span className="listening-label">Listening…</span>}
                            </div>

                            {/* Or type manually */}
                            <form className="chat-input-area" onSubmit={handleVoiceTextSend}>
                                <input
                                    type="text"
                                    placeholder="Or type your message…"
                                    value={voiceText}
                                    onChange={(e) => setVoiceText(e.target.value)}
                                    disabled={voiceLoading}
                                />
                                <button type="submit" disabled={voiceLoading || !voiceText.trim()} className="send-btn">
                                    ➤
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBot;
