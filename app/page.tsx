'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  MessageSquare,
  Settings,
  FileText,
  Send,
  ChevronRight,
  Layout,
  AlertCircle,
  Loader2,
  Database,
  Sparkles,
  X,
} from 'lucide-react';

// --- Constants ---
const SAMPLE_QUESTIONS = [
  'What is the net profit reported in 3Q25?',
  'Summarize the capital return dividend details.',
  'Are there any specific diagrams or charts showing growth?',
  'Extract the performance metrics from the main table.',
];

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const MAX_IMAGE_PAGES = 6;
const IMAGE_SCALE = 1.6;

export default function Home() {
  // --- State ---
  const [apiKey, setApiKey] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'config'>('chat');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Scroll to bottom ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Convert PDF to Base64 for Vision API ---
  const convertPDFToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const renderPdfToImages = async (file: File): Promise<string[]> => {
    const [pdfjsLib, fileBuffer] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf'),
      file.arrayBuffer(),
    ]);

    const { getDocument, GlobalWorkerOptions, version } = pdfjsLib as {
      getDocument: typeof import('pdfjs-dist/legacy/build/pdf').getDocument;
      GlobalWorkerOptions: typeof import('pdfjs-dist/legacy/build/pdf').GlobalWorkerOptions;
      version: string;
    };

    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

    const pdf = await getDocument({ data: fileBuffer }).promise;
    const pagesToRender = Math.min(pdf.numPages, MAX_IMAGE_PAGES);
    const images: string[] = [];

    for (let pageIndex = 1; pageIndex <= pagesToRender; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex);
      const viewport = page.getViewport({ scale: IMAGE_SCALE });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;
      images.push(canvas.toDataURL('image/png', 0.92));
    }

    return images;
  };

  // --- Handle File Upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setError(null);

      try {
        const base64 = await convertPDFToBase64(file);
        let renderedImages: string[] = [];
        try {
          renderedImages = await renderPdfToImages(file);
        } catch (renderError) {
          console.warn('PDF image render failed:', renderError);
        }
        setPdfFile(file);
        setPdfBase64(base64);
        setPdfImages(renderedImages);
        setIsUploading(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: `Successfully uploaded: ${file.name}. Rendered ${renderedImages.length} page(s) as images for diagrams/tables.`,
          },
        ]);
      } catch (err) {
        setError('Failed to process PDF file.');
        setIsUploading(false);
      }
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  // --- Handle Query ---
  const handleQuery = async (queryText: string = input) => {
    if (!queryText.trim()) return;
    if (!apiKey) {
      setError('Please enter your OpenAI API Key in the settings.');
      setActiveTab('config');
      return;
    }
    if (!pdfFile || !pdfBase64) {
      setError('Please upload a PDF first.');
      return;
    }

    const userMessage: Message = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          messages: [...messages, userMessage],
          pdfBase64,
          pdfImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Clear Chat ---
  const clearChat = () => {
    setMessages([]);
    setPdfFile(null);
    setPdfBase64('');
    setPdfImages([]);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 glass-morphism flex flex-col shadow-xl border-r border-white/50">
        {/* Header */}
        <div className="p-6 border-b border-white/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl gradient-text tracking-tight">
                Vision RAG
              </h1>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                PDF Analyzer
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'hover:bg-white/50 text-slate-600'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Chat Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'config'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'hover:bg-white/50 text-slate-600'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Configuration</span>
          </button>
        </nav>

        {/* Current Document */}
        <div className="p-4 border-t border-white/50">
          <div className="bg-white/60 rounded-xl p-4 border border-white/70 shadow-sm">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              Current Document
            </h3>
            {pdfFile ? (
              <div className="space-y-2">
                <div className="text-sm truncate text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  {pdfFile.name}
                </div>
                <button
                  onClick={clearChat}
                  className="w-full text-xs text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1 py-1"
                >
                  <X size={14} /> Clear
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No PDF uploaded
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'chat' ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-8 animate-fade-in">
                  {/* Hero Section */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl text-white shadow-2xl">
                      <Layout size={56} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Multimodal PDF Insight
                    </h2>
                    <p className="text-slate-600 text-xl max-w-2xl">
                      Upload your document to begin querying{' '}
                      <span className="font-semibold text-purple-600">
                        tables
                      </span>
                      ,{' '}
                      <span className="font-semibold text-blue-600">
                        diagrams
                      </span>
                      , and{' '}
                      <span className="font-semibold text-pink-600">text</span>{' '}
                      with OpenAI Vision power.
                    </p>
                  </div>

                  {/* Upload Box */}
                  <label className="w-full max-w-lg cursor-pointer group">
                    <div className="relative border-2 border-dashed border-purple-300 group-hover:border-purple-500 rounded-3xl p-12 bg-white/80 backdrop-blur-sm transition-all flex flex-col items-center justify-center space-y-4 shadow-lg group-hover:shadow-2xl group-hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        {isUploading ? (
                          <Loader2 className="animate-spin" size={40} />
                        ) : (
                          <Upload size={40} />
                        )}
                      </div>
                      <div className="relative text-center">
                        <p className="font-bold text-lg text-slate-800 flex items-center gap-2 justify-center">
                          <Sparkles
                            size={20}
                            className="text-purple-500 animate-pulse"
                          />
                          Click or drag PDF here
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          Files up to 20MB supported
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Sample Questions */}
                  {!pdfFile && (
                    <div className="w-full max-w-2xl">
                      <p className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2 justify-center">
                        <Sparkles size={16} className="text-purple-500" />
                        Try these sample questions
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        {SAMPLE_QUESTIONS.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (!pdfFile) {
                                setError('Please upload a PDF first');
                                return;
                              }
                              handleQuery(q);
                            }}
                            className="p-4 text-sm text-slate-700 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl hover:border-purple-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                          >
                            <span className="flex-1">{q}</span>
                            <ChevronRight
                              size={16}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-none'
                          : msg.role === 'system'
                          ? 'bg-white/80 backdrop-blur-sm text-slate-600 text-sm border border-purple-200'
                          : 'bg-white/90 backdrop-blur-sm border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}

              {isProcessing && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-3 shadow-lg">
                    <Loader2
                      size={20}
                      className="animate-spin text-purple-600"
                    />
                    <span className="text-slate-600 text-sm">
                      Analyzing document...
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-lg animate-fade-in">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-6 glass-morphism border-t border-white/50">
              <div className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder={
                    pdfFile
                      ? 'Ask about the PDF...'
                      : 'Please upload a PDF first'
                  }
                  disabled={!pdfFile || isProcessing}
                  className="w-full pl-6 pr-16 py-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all outline-none text-slate-700 disabled:opacity-50 shadow-lg"
                />
                <button
                  onClick={() => handleQuery()}
                  disabled={!input.trim() || isProcessing}
                  className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Configuration View */
          <div className="p-10 max-w-2xl mx-auto space-y-8 animate-fade-in">
            <header>
              <h2 className="text-4xl font-bold mb-3 gradient-text">
                API Configuration
              </h2>
              <p className="text-slate-600 text-lg">
                Manage your connection to OpenAI services.
              </p>
            </header>

            <div className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm"
                />
                <p className="text-xs text-slate-500 flex items-center gap-1.5 bg-blue-50 p-3 rounded-lg">
                  <AlertCircle size={14} className="text-blue-600" />
                  Your key is stored locally in browser state and never sent to
                  our servers.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full shadow-lg ${
                      apiKey
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {apiKey ? 'API Key Set' : 'Awaiting Key'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Save & Return
                </button>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-3xl shadow-lg">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                How it works
              </h4>
              <ul className="text-sm text-purple-800 space-y-2.5">
                <li className="flex items-start gap-2">
                  <ChevronRight
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-purple-600"
                  />
                  <span>
                    PDF text is extracted on the server; the first 6 pages are
                    rendered to images for diagrams and layout.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-purple-600"
                  />
                  <span>
                    The system identifies tables, diagrams, and structural
                    elements.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-purple-600"
                  />
                  <span>
                    Vision-enabled RAG allows for visual reasoning across
                    document pages.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
