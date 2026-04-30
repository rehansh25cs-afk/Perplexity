import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import { Menu, Send, Compass, Library, Clock3 } from 'lucide-react';
import { MoonLoader } from 'react-spinners';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.chat);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const loading = useSelector((state) => state.chat.isLoading)

  const { initSocketConnection, handleGetChats, handleGetMessages, handleSendMessage } = useChat();

  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messageListRef = useRef(null);

  const displayName = useMemo(() => {
    return user?.username || user?.name || user?.email || 'Guest User';
  }, [user]);

  const firstName = useMemo(() => displayName.split(' ')[0], [displayName]);

  

  useEffect(() => {
    initSocketConnection();
    handleGetChats();
  }, [initSocketConnection, handleGetChats]);

  useEffect(() => {
    if (!currentChatId) return;
    handleGetMessages(currentChatId, chats);
  }, [currentChatId, chats, handleGetMessages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!messageListRef.current) return;
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [currentChatId, chats]);

  const currentMessages = chats?.[currentChatId]?.messages ?? [];

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    handleSendMessage(message, currentChatId);
    setMessage('');
  };

  return (
    <main className="h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="flex h-full">

        <aside
          className={`${sidebarOpen ? 'w-70 p-4 border-r border-white/10' : 'w-0 p-0 border-none overflow-hidden'} transition-all duration-300 bg-[#111111] flex flex-col`}
        >
          {sidebarOpen && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">perplexity</h1>
              </div>

              <button className="mb-5 w-full rounded-2xl bg-white text-black py-3 text-sm font-medium hover:opacity-90 transition">
                + New Thread
              </button>

              <div className="space-y-2 mb-6">
                <button className="flex items-center gap-3 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 w-full">
                  <Compass size={18} /> Discover
                </button>
                <button className="flex items-center gap-3 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 w-full">
                  <Library size={18} /> Library
                </button>
              </div>

              <div className="border-t border-white/10 pt-4 flex-1 overflow-y-auto no-scrollbar">
                <p className="text-xs text-slate-500 mb-3 px-2">Recent</p>

                <div className="space-y-2 pr-1 overflow-y-auto no-scrollbar">
                  {Object.values(chats || {}).map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleGetMessages(chat.id, chats)}
                      className={`w-full text-left rounded-xl px-3 py-3 text-sm transition ${currentChatId === chat.id
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock3 size={14} />
                        <p className="truncate">{chat.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        <section className="flex-1 flex flex-col bg-[#0f0f0f]">

          <header className="h-17.5 px-6 border-b border-white/5 flex items-center justify-between bg-[#0f0f0f]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-sm text-slate-400">Ask anything</p>
                <p className="text-sm font-medium">Welcome back, {firstName}</p>
              </div>
            </div>

            <button className="px-5 py-2 rounded-xl bg-white text-black text-sm font-medium hover:opacity-90 transition">
              Logout
            </button>
          </header>

          <div ref={messageListRef} className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
              {currentMessages.map((msg, index) => {
                const isAssistant = msg.role === 'assistant' || msg.role === 'ai';

                return isAssistant ? (
                  <div key={index} className="w-full pb-6 flex justify-center">
                    <div className="w-full max-w-3xl px-1 sm:px-2">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-[17px] leading-loose font-light text-slate-200 mb-5 tracking-[0.01em]">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-[40px] leading-tight font-medium text-white mb-5 tracking-tight">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-[30px] leading-tight font-medium text-white mb-4 tracking-tight">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-[22px] leading-tight font-medium text-white mb-3 tracking-tight">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-6 space-y-2 mb-5 text-slate-200 leading-[1.9]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 space-y-2 mb-5 text-slate-200 leading-[1.9]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="pl-1">
                              {children}
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-medium text-white">
                              {children}
                            </strong>
                          ),
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.95em] text-[#9ecbff]">
                                {children}
                              </code>
                            ) : (
                              <code className="block overflow-x-auto rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-[#c9ddff]">
                                {children}
                              </code>
                            ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l border-white/10 pl-4 italic text-slate-400 mb-5">
                              {children}
                            </blockquote>
                          ),
                          hr: () => <hr className="my-6 border-white/10" />,
                          a: ({ children, href }) => (
                            <a href={href} className="text-[#9ecbff] underline decoration-white/20 underline-offset-4">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex justify-end mt-2">
                    <div className="max-w-xl rounded-[22px] bg-[#1b1b1b] px-6 py-4 text-[15px] font-normal text-slate-100 border border-white/5 shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="px-6 pb-6 pt-4 border-t border-white/5 bg-[#0f0f0f]">
            <form onSubmit={handleSubmitMessage} className="max-w-4xl mx-auto">
              <div className="rounded-[28px] border border-white/10 bg-[#171717] px-6 py-5 flex items-center gap-4 shadow-xl">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-sm"
                />

                <button
                  type="submit"
                  className="h-11 w-11 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-[1.03] transition"
                >

                  {loading ? (
                  <MoonLoader size={18} loading={loading} color="#000" />):<Send size={18} />}
                  

                </button>
              </div>
            </form>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
