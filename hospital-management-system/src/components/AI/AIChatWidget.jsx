import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Bot, Sparkles, ThumbsUp, ThumbsDown, User, ArrowRight, HeartPulse, RefreshCw, Mic, Volume2, VolumeX } from 'lucide-react';
import { aiApi } from '../../services/api';

const SUGGESTIONS = [
  { text: "🔍 I have chest pain & cough", type: "symptom" },
  { text: "💊 How should I take Amlodipine?", type: "medicine" },
  { text: "📅 I need a heart specialist", type: "appointment" },
  { text: "📊 Analyze hospital performance", type: "report" }
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MedCare AI Assistant. How can I help you with hospital operations or health queries today?",
      sender: 'bot',
      isWelcome: true
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), text: query, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const lowerQuery = query.toLowerCase();
      let responseObj = { id: Date.now() + 1, sender: 'bot' };

      if (lowerQuery.includes('symptom') || lowerQuery.includes('fever') || lowerQuery.includes('pain') || lowerQuery.includes('headache') || lowerQuery.includes('cough')) {
        const { data } = await aiApi.analyzeSymptoms(query);
        responseObj.type = 'symptom_analysis';
        responseObj.data = data;
      } else if (lowerQuery.includes('prescription') || lowerQuery.includes('medicine') || lowerQuery.includes('dosage') || lowerQuery.includes('take') || lowerQuery.includes('amlodipine')) {
        const { data } = await aiApi.explainPrescription(null, query);
        responseObj.type = 'prescription_explanation';
        responseObj.data = data;
      } else if (lowerQuery.includes('appointment') || lowerQuery.includes('doctor') || lowerQuery.includes('specialist') || lowerQuery.includes('book')) {
        const { data } = await aiApi.assistAppointment(query);
        responseObj.type = 'appointment_assistant';
        responseObj.data = data;
      } else if (lowerQuery.includes('revenue') || lowerQuery.includes('performance') || lowerQuery.includes('report') || lowerQuery.includes('analytics') || lowerQuery.includes('operations')) {
        const { data } = await aiApi.operationsInsights(query);
        responseObj.type = 'operations_insights';
        responseObj.data = data;
      } else {
        const { data } = await aiApi.askGeneral(query);
        responseObj.text = data.text;
      }

      // Local translation for spoken output if needed
      if (selectedLang !== 'en') {
        const translatedText = translateMedicalQuery(responseObj.text || '', selectedLang);
        responseObj.translatedSubtext = translatedText;
      }

      setMessages(prev => [...prev, responseObj]);
      
      // Text to Speech with accent support
      if (!isMuted && 'speechSynthesis' in window) {
        let speakText = responseObj.text || (responseObj.type === 'symptom_analysis' ? "Here is the symptom analysis report." : "Here is the information you requested.");
        if (selectedLang !== 'en') {
          speakText = translateMedicalQuery(speakText, selectedLang);
        }
        const firstSentence = speakText.split(/[.!\n]/)[0];
        const utterance = new SpeechSynthesisUtterance(firstSentence);
        const langCodes = { en: 'en-US', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR' };
        utterance.lang = langCodes[selectedLang] || 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm having trouble processing that right now. Could you please try again?"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = (msgId, type) => {
    setFeedback(prev => ({ ...prev, [msgId]: type }));
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Chrome.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      handleSend(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const renderRichContent = (msg) => {
    // If has translated subtext, render it alongside main text
    if (msg.text) {
      return (
        <div className="bot-text-message">
          {msg.text.split('\n').map((line, i) => (
            <p key={i} style={{ margin: '4px 0' }}>
              {line.split('**').map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
            </p>
          ))}
          {msg.translatedSubtext && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #CBD5E0', fontSize: '0.8rem', color: '#4A5568', fontStyle: 'italic' }}>
              🌐 Translated: {msg.translatedSubtext}
            </div>
          )}
        </div>
      );
    }

    if (msg.type === 'symptom_analysis' && msg.data) {
      const { possibleConditions, recommendedDepartment, urgencyLevel, disclaimer } = msg.data;
      return (
        <div className="ai-rich-card symptom-card">
          <div className="card-badge-row">
            <span className={`status-badge urgency-${urgencyLevel.toLowerCase()}`} style={{
              background: urgencyLevel === 'High' ? '#FFF5F5' : '#FFFAF0',
              color: urgencyLevel === 'High' ? '#C53030' : '#DD6B20',
              fontWeight: 600
            }}>
              Urgency: {urgencyLevel}
            </span>
            <span className="badge badge-teal">{recommendedDepartment}</span>
          </div>

          <h4 style={{ margin: '10px 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <HeartPulse size={16} style={{ color: '#6EC89B' }} /> Possible Conditions
          </h4>

          {possibleConditions.map((cond, i) => (
            <div key={i} className="condition-item" style={{ padding: '8px 0', borderBottom: i < possibleConditions.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>{cond.name}</span>
                <span style={{ color: '#6FA8DC' }}>{cond.probability}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#718096', margin: '2px 0 0' }}>{cond.description}</p>
            </div>
          ))}

          <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 12 }} onClick={() => {
            setIsOpen(false);
            navigate('/book-appointment');
          }}>
            Book Consultation <ArrowRight size={14} />
          </button>
          <div style={{ fontSize: '0.7rem', color: '#A0AEC0', marginTop: 8, fontStyle: 'italic' }}>{disclaimer}</div>
        </div>
      );
    }

    if (msg.type === 'prescription_explanation' && msg.data) {
      return (
        <div className="ai-rich-card prescription-card">
          <h4 style={{ margin: '0 0 8px', color: '#2D3748' }}>💊 Medicine Information</h4>
          <div style={{ background: '#F8FAFB', padding: 12, borderRadius: 8, fontSize: '0.85rem', lineHeight: 1.5, borderLeft: '3px solid #6FA8DC' }}>
            {msg.data.explanation.split('\n').map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)}
          </div>
        </div>
      );
    }

    if (msg.type === 'appointment_assistant' && msg.data) {
      const { suggestedDepartment, availableDoctors } = msg.data;
      return (
        <div className="ai-rich-card doctors-card">
          <div style={{ marginBottom: 8, fontSize: '0.85rem', fontWeight: 500 }}>
            🏥 Suggested: <span style={{ color: '#6EC89B', fontWeight: 600 }}>{suggestedDepartment}</span>
          </div>
          {availableDoctors.map((doc, i) => (
            <div key={i} className="ai-doc-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < availableDoctors.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{doc.specialization} • {doc.experience}</div>
                <div style={{ fontSize: '0.75rem', color: '#6FA8DC', marginTop: 2 }}>Next slot: {doc.nextSlot}</div>
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => {
                setIsOpen(false);
                navigate('/book-appointment');
              }}>
                Book
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === 'operations_insights' && msg.data) {
      return (
        <div className="ai-rich-card insights-card">
          <h4 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={16} style={{ color: '#6EC89B' }} /> Operations Analysis</h4>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4A5568' }}>
            {msg.data.insights.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '4px 0' }}>{line}</p>
            ))}
          </div>
          <button className="btn btn-outline btn-sm w-full" style={{ marginTop: 12 }} onClick={() => {
            setIsOpen(false);
            navigate('/reports');
          }}>
            View Full Reports
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {!isOpen && (
        <button className="ai-fab" onClick={() => setIsOpen(true)} title="AI Assistant">
          <Sparkles size={24} />
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-panel animate-fade-in-up">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ai-header-bot-icon">
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>MedCare AI</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#A0AEC0' }}>
                  <span className="ai-online-dot"></span> Online Assistant
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <select 
                value={selectedLang} 
                onChange={(e) => setSelectedLang(e.target.value)}
                style={{ fontSize: 11, background: '#fff', border: '1px solid #CBD5E0', borderRadius: 4, padding: '2px 4px', cursor: 'pointer', color: '#4A5568' }}
              >
                <option value="en">English 🇬🇧</option>
                <option value="hi">Hindi 🇮🇳</option>
                <option value="es">Spanish 🇪🇸</option>
                <option value="fr">French 🇫🇷</option>
              </select>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096', display: 'flex', padding: 4 }}
                title={isMuted ? "Unmute Voice output" : "Mute Voice output"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button className="modal-close" onClick={() => setIsOpen(false)} style={{ width: 28, height: 28, margin: 0 }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Message Area */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message-wrapper ${msg.sender}`}>
                <div className={`ai-avatar-icon ${msg.sender}`}>
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className={`ai-message ${msg.sender}`}>
                  {renderRichContent(msg)}

                  {msg.sender === 'bot' && !msg.isWelcome && (
                    <div className="ai-feedback-actions">
                      <button
                        className={`feedback-btn ${feedback[msg.id] === 'up' ? 'active' : ''}`}
                        onClick={() => handleFeedback(msg.id, 'up')}
                        title="Helpful"
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        className={`feedback-btn ${feedback[msg.id] === 'down' ? 'active' : ''}`}
                        onClick={() => handleFeedback(msg.id, 'down')}
                        title="Not helpful"
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="ai-message-wrapper bot">
                <div className="ai-avatar-icon bot">
                  <Bot size={14} />
                </div>
                <div className="ai-message bot typing" style={{ padding: '12px 16px' }}>
                  <div className="dot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="ai-suggestions-grid">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  className="ai-suggestion-pill"
                  onClick={() => handleSend(sug.text)}
                >
                  {sug.text}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <div className="ai-chat-input">
            <button 
              className={`mic-btn ${isListening ? 'active' : ''}`} 
              onClick={startListening} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isListening ? '#E53E3E' : '#718096', padding: '0 8px 0 0', display: 'flex' }}
              title="Dictate with voice"
            >
              <Mic size={18} className={isListening ? "animate-pulse" : ""} />
            </button>
            <input
              type="text"
              placeholder={isListening ? "Listening..." : "Ask about symptoms, prescriptions, doctors..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Multi-lingual Translation Dictionary
const translateMedicalQuery = (text, targetLang) => {
  if (targetLang === 'en') return text;
  
  const dict = {
    hi: {
      "hello": "नमस्ते! मैं मेडकेयर का एआई सहायक हूं। मैं आपकी क्या मदद कर सकता हूँ?",
      "symptom": "यहाँ आपकी लक्षण विश्लेषण रिपोर्ट है। कृपया इसे ध्यान से देखें।",
      "appointment": "मैंने आपके लिए कार्डियोलॉजी विभाग में डॉक्टर का समय उपलब्ध देखा है।",
      "prescription": "दवाओं के सेवन के निर्देश: भोजन के बाद दवा लें।",
      "clinical": "चिकित्सीय विवरण नीचे दिए गए हैं।",
      "common": "आमतौर पर यह सामान्य सर्दी या थकान से संबंधित है। आराम करें।",
      "timings": "अस्पताल का समय: ओपीडी सुबह 9 बजे से शाम 6 बजे तक।",
      "error": "माफ करें, मुझे समझने में समस्या आ रही है।"
    },
    es: {
      "hello": "¡Hola! Soy el asistente virtual de MedCare. ¿Cómo puedo ayudarle hoy?",
      "symptom": "Aquí está su informe de análisis de síntomas.",
      "appointment": "He encontrado citas disponibles en Cardiología.",
      "prescription": "Instrucciones de medicamentos: Tomar después de las comidas.",
      "clinical": "Los detalles clínicos se muestran a continuación.",
      "common": "Normalmente esto se asocia con fatiga o resfriado. Descanse.",
      "timings": "Horario del hospital: OPD de 9 AM a 6 PM.",
      "error": "Lo siento, tengo problemas para procesar esto."
    },
    fr: {
      "hello": "Bonjour! Je suis l'assistant de santé IA de MedCare. Comment puis-je vous aider?",
      "symptom": "Voici votre rapport d'analyse des symptômes.",
      "appointment": "J'ai trouvé des rendez-vous disponibles en cardiologie.",
      "prescription": "Instructions de traitement: Prendre après les repas.",
      "clinical": "Les détails cliniques sont présentés ci-dessous.",
      "common": "Ceci est généralement lié à un rhume ou de la fatigue. Reposez-vous.",
      "timings": "Horaires de l'hôpital: consultation externe de 9h à 18h.",
      "error": "Désolé, je rencontre des difficultés pour traiter votre demande."
    }
  };

  const lower = text.toLowerCase();
  let key = "hello";
  if (lower.includes("symptom") || lower.includes("symptômes") || lower.includes("laxon")) key = "symptom";
  else if (lower.includes("appointment") || lower.includes("doctor") || lower.includes("rendez-vous")) key = "appointment";
  else if (lower.includes("prescription") || lower.includes("ordonnance") || lower.includes("medicine")) key = "prescription";
  else if (lower.includes("timings") || lower.includes("hours") || lower.includes("horaire")) key = "timings";
  else if (lower.includes("symptom") || lower.includes("pain") || lower.includes("fever")) key = "common";
  else if (lower.includes("error") || lower.includes("sorry")) key = "error";

  return dict[targetLang]?.[key] || dict[targetLang]?.["hello"];
};
