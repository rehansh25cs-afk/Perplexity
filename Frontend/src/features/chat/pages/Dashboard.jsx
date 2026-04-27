import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';

const conversationList = [
  'Roadmap discussion',
  'React perf checklist',
  'Email copy ideas',
  'Data model review',
  'Marketing sprint prep',
  'API naming pass',
  'Landing page strategy',
  'User interview notes',
  'Sprint retro insights',
  'Pricing copy rewrite',
  'Support ticket themes',
  'Onboarding friction points',
];

const chatMessages = [
  {
    role: 'user',
    text: 'How do we make this product onboarding feel premium and fast?',
  },
  {
    role: 'assistant',
    text:
      'Start with a single guided flow: one input, one visible result, then progressive disclosure. Keep copy outcome-focused, prefill examples, and show immediate value in less than 15 seconds. Also use a confidence-building moment like an instant personalized suggestion.',
  },
  {
    role: 'user',
    text: 'Give me launch-ready improvements for this week.',
  },
  {
    role: 'assistant',
    text:
      'Ship 3 things: (1) intent chips under the input, (2) reusable prompt templates in the sidebar, and (3) richer loading states with contextual progress text. These changes improve first-session completion and perceived quality without deep backend work.',
  },
  {
    role: 'user',
    text: 'Can you suggest a cleaner information hierarchy for the dashboard?',
  },
  {
    role: 'assistant',
    text:
      'Prioritize three layers: 1) active conversation and composer, 2) conversation history and navigation, 3) secondary context. Keep the first layer visually dominant with stronger contrast and more breathing room.',
  },
  {
    role: 'user',
    text: 'What can we improve for mobile users?',
  },
  {
    role: 'assistant',
    text:
      'Use a single-column conversation-first layout, keep input pinned, and avoid nested panels. Reduce decorative elements by 20 percent on smaller screens and preserve touch-friendly targets at 44px minimum height.',
  },
  {
    role: 'user',
    text: 'Generate a QA checklist before launch.',
  },
  {
    role: 'assistant',
    text:
      'Validate auth persistence, reconnect behavior, keyboard interaction, auto-scroll after send, long-message rendering, and responsiveness across breakpoints. Add visual regression checks for sidebar, composer, and message bubbles.',
  },
  {
    role: 'user',
    text: 'What should the empty state of a new chat look like?',
  },
  {
    role: 'assistant',
    text:
      'Show a calm welcome card with two lines of guidance and three high-value starter actions. Keep the area lightweight and remove it immediately once the first user message is sent.',
  },
  {
    role: 'user',
    text: 'Give me a short launch plan for this chat product.',
  },
  {
    role: 'assistant',
    text:
      'Week 1: stabilize chat reliability and UI polish. Week 2: instrument analytics and optimize funnel drop-off. Week 3: release sharing, exports, and team-workspace controls with iterative feedback loops.',
  },
  {
    role: 'user',
    text: 'How should we present trust and reliability in UI copy?',
  },
  {
    role: 'assistant',
    text:
      'Use plain language, avoid hype, and communicate capabilities with boundaries. Add subtle status messaging for connection health and response state so users always understand what the system is doing.',
  },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { initSocketConnection } = useChat();
  const messageListRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const displayName = useMemo(() => {
    return user?.username || user?.name || user?.email || 'Guest User';
  }, [user]);

  const firstName = useMemo(() => displayName.split(' ')[0], [displayName]);

  useEffect(() => {
    initSocketConnection();
  }, [initSocketConnection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!messageListRef.current) return;
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 220);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-[#05070f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(17,24,39,0.15),rgba(2,6,23,0.85))]" />
      </div>

      <div className={`flex h-full w-full p-3 md:p-6 ${isSidebarCollapsed ? 'gap-0 md:gap-0' : 'gap-4 md:gap-6'}`}>
        <div
          className={`hidden h-full overflow-hidden xl:block xl:shrink-0 xl:transition-all xl:duration-300 xl:ease-in-out ${
            isSidebarCollapsed ? 'xl:w-0' : 'xl:w-[320px]'
          }`}
        >
          <aside
            className={`flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-800/90 bg-[#060b17]/80 p-5 backdrop-blur transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'pointer-events-none -translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
            }`}
          >
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Perplexity</h1>
              <p className="mt-2 text-sm text-slate-400">Welcome back, {firstName}.</p>
            </div>

            <button className="mb-5 w-full rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-3 text-left text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20">
              + New conversation
            </button>

            <div className="custom-scrollbar mt-1 flex-1 space-y-3 overflow-y-auto pr-1 pb-8">
              {conversationList.map((title, index) => (
                <button
                  key={title}
                  className={`w-full truncate rounded-xl border px-4 py-3 text-left text-sm transition ${
                    index === 0
                      ? 'border-cyan-400/40 bg-slate-900/80 text-white'
                      : 'border-slate-700/70 bg-[#070f20]/60 text-slate-300 hover:border-slate-500/80 hover:text-slate-100'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <section className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#040813]/75 p-3 shadow-[0_0_0_1px_rgba(56,189,248,0.08)] backdrop-blur-sm md:p-5">
          <div className="mb-3 rounded-2xl border border-slate-800/90 bg-slate-950/35 p-3 md:hidden">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Perplexity</p>
            <p className="mt-1 text-sm text-slate-300">Hi {firstName}, continue your conversation.</p>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800/90 bg-slate-950/35 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-slate-200 transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-100 xl:flex"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V5.5Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 4.75V19.25" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M14.5 10L12.25 12L14.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-sm font-medium tracking-wide text-slate-200">Strategic Product Copilot</p>
            </div>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
              Online
            </span>
          </div>

          <div ref={messageListRef} className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-1 pb-6 scroll-smooth">
            {chatMessages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                style={{ animationDelay: `${index * 70}ms` }}
                className={`message-enter max-w-3xl rounded-2xl border p-4 md:p-5 ${
                  message.role === 'assistant'
                    ? 'border-slate-700 bg-linear-to-br from-slate-900/90 to-slate-900/70 text-slate-200'
                    : 'ml-auto border-cyan-400/30 bg-cyan-500/10 text-cyan-50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {message.role === 'assistant' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="leading-relaxed">{message.text}</p>
              </article>
            ))}
          </div>

          <footer className="mt-4 rounded-2xl border border-slate-700/80 bg-[#050d1d]/85 p-3 md:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Type your message..."
                className="h-12 flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button className="h-12 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#031025] transition hover:brightness-110">
                Send
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
