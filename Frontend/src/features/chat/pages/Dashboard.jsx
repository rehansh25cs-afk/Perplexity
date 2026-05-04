import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useChat } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import { Menu, Send, Compass, Library, Clock3, Trash2, LogOut } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import { useNavigate } from "react-router";
import { setCurrentChatId } from '../chat.slice';


const Dashboard = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.chat);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const loading = useSelector((state) => state.chat.isLoading)

  const { initSocketConnection, handleGetChats, handleGetMessages, handleSendMessage, handleLogout, handleDeleteChat } = useChat();

  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
  const showWelcomeState = !currentChatId || currentMessages.length === 0;



  const handleLogOut = async () => {

    const isConfirmed = confirm("Are you sure you want to Logout?")
    if (isConfirmed) {
      await handleLogout();
      navigate("/login")
    }
  }


  const handleDelete = async (chatId) => {
    const isConfirmed = confirm("Are you sure you want to delete this conversation?")
    if (isConfirmed) {
      await handleDeleteChat(chatId);
      await handleGetChats();
    }
  }


  const handleSubmitMessage = async(e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await handleSendMessage(message, currentChatId);
    setMessage('');
    await handleGetChats();
  };


  const handleNewChat = async () => {
    dispatch(setCurrentChatId(null));
  }

  return (
    <main className="h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="flex h-full relative">

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 md:hidden bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`${sidebarOpen ? 'w-70 p-4 border-r border-white/10' : 'w-0 p-0 border-none overflow-hidden'} fixed md:relative md:z-auto z-50 h-full transition-all duration-300 bg-[#111111] flex flex-col`}
        >
          {sidebarOpen && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">perplexity</h1>
              </div>

              <button
                onClick={handleNewChat}
              className="mb-5 w-full rounded-2xl bg-white text-black py-3 text-sm font-medium hover:opacity-90 transition">
                + New Conversation
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
                    <div
                      key={chat.id}
                      onClick={() => handleGetMessages(chat.id, chats)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleGetMessages(chat.id, chats);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`w-full cursor-pointer rounded-xl text-sm transition ${currentChatId === chat.id
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center gap-2 px-3 py-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
                          <Clock3 size={14} />
                          <p className="truncate">{chat.title}</p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chat.id);
                          }}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-red-300"
                          aria-label={`Delete ${chat.title}`}
                          title="Delete conversation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        <section className="flex-1 flex flex-col bg-[#0f0f0f]">

          <header className="px-4 md:px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0f0f0f] relative">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition flex-shrink-0"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Ask anything</p>
                <p className="text-xs md:text-sm font-medium truncate">Welcome back, {firstName}</p>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="md:hidden h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition"
                title="User menu"
              >
                <LogOut size={20} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 bg-[#1b1b1b] border border-white/10 rounded-xl shadow-lg z-50 w-40">
                  <button
                    onClick={handleLogOut}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition flex items-center gap-2 rounded-xl m-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}

              <button
                onClick={handleLogOut}
                className="hidden md:block px-5 py-2 rounded-xl bg-white text-black text-sm font-medium hover:opacity-90 transition">
                Logout
              </button>
            </div>
          </header>

          <div ref={messageListRef} className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 no-scrollbar">
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
              {showWelcomeState ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">Perplexity</p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">Ask anything</h2>
                  <p className="mt-3 max-w-sm sm:max-w-xl text-xs sm:text-sm md:text-base text-slate-400 px-2">
                    Start a new conversation 
                  </p>
                </div>
              ) : currentMessages.map((msg, index) => {
                const isAssistant = msg.role === 'assistant' || msg.role === 'ai';

                return isAssistant ? (
                  <div key={index} className="w-full pb-4 sm:pb-6 md:pb-6 flex justify-center">
                    <div className="w-full max-w-3xl px-2 sm:px-3 md:px-2">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-sm sm:text-base md:text-[17px] leading-relaxed sm:leading-loose font-light text-slate-200 mb-3 sm:mb-5 tracking-[0.01em]">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-2xl sm:text-3xl md:text-[40px] leading-tight font-medium text-white mb-3 sm:mb-5 tracking-tight">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl sm:text-2xl md:text-[30px] leading-tight font-medium text-white mb-2 sm:mb-4 tracking-tight">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg sm:text-xl md:text-[22px] leading-tight font-medium text-white mb-2 sm:mb-3 tracking-tight">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 mb-3 sm:mb-5 text-slate-200 leading-[1.8] sm:leading-[1.9]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 sm:pl-6 space-y-1 sm:space-y-2 mb-3 sm:mb-5 text-slate-200 leading-[1.8] sm:leading-[1.9]">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="pl-1 text-sm sm:text-base">
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
                              <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.9em] sm:text-[0.95em] text-[#9ecbff] break-words">
                                {children}
                              </code>
                            ) : (
                              <code className="block overflow-x-auto rounded-lg sm:rounded-2xl border border-white/10 bg-[#111111] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#c9ddff]">
                                {children}
                              </code>
                            ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l border-white/10 pl-3 sm:pl-4 italic text-slate-400 mb-3 sm:mb-5 text-sm sm:text-base">
                              {children}
                            </blockquote>
                          ),
                          hr: () => <hr className="my-4 sm:my-6 border-white/10" />,
                          a: ({ children, href }) => (
                            <a href={href} className="text-[#9ecbff] underline decoration-white/20 underline-offset-4 break-words">
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
                    <div className="max-w-xs sm:max-w-sm md:max-w-xl rounded-xl sm:rounded-[22px] bg-[#1b1b1b] px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-[15px] font-normal text-slate-100 border border-white/5 shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="px-3 sm:px-6 md:px-6 pb-4 sm:pb-6 md:pb-6 pt-3 sm:pt-4 md:pt-4 border-t border-white/5 bg-[#0f0f0f]">
            <form onSubmit={handleSubmitMessage} className="max-w-4xl mx-auto">
              <div className="rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#171717] px-4 sm:px-6 py-3 sm:py-5 flex items-center gap-3 sm:gap-4 shadow-xl">
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
                    <MoonLoader size={18} loading={loading} color="#000" />) : <Send size={18} />}


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
