import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Megaphone,
  MessageSquareText,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import './styles.css';

const updates = [
  {
    id: 1,
    type: 'Placements',
    title: 'Infosys pooled campus drive shortlist released',
    body: 'Eligible students from CSE, IT, ECE, and EEE can confirm availability before 5:00 PM.',
    time: '2 min ago',
    audience: 'Final year',
    priority: 'High',
    status: 'Live',
  },
  {
    id: 2,
    type: 'Events',
    title: 'AI product design workshop moved to Seminar Hall B',
    body: 'Registered participants should carry laptops and join by 10:15 AM for check-in.',
    time: '18 min ago',
    audience: 'All students',
    priority: 'Medium',
    status: 'Live',
  },
  {
    id: 3,
    type: 'Results',
    title: 'Semester 5 revaluation results published',
    body: 'Result sheets are available in the student portal. Queries close on Friday evening.',
    time: '42 min ago',
    audience: 'Third year',
    priority: 'Medium',
    status: 'Live',
  },
  {
    id: 4,
    type: 'Placements',
    title: 'TCS NQT mock assessment window opens tonight',
    body: 'The practice test will remain active from 8:00 PM to 11:00 PM.',
    time: '1 hr ago',
    audience: 'Placement batch',
    priority: 'Low',
    status: 'Scheduled',
  },
  {
    id: 5,
    type: 'Events',
    title: 'Cultural fest volunteer briefing at 4:30 PM',
    body: 'Team leads will receive updated duty charts in the volunteer group.',
    time: '2 hrs ago',
    audience: 'Volunteers',
    priority: 'Low',
    status: 'Live',
  },
];

const categories = [
  { name: 'All', icon: Bell },
  { name: 'Placements', icon: BriefcaseBusiness },
  { name: 'Events', icon: CalendarDays },
  { name: 'Results', icon: GraduationCap },
];

const stats = [
  { label: 'Active alerts', value: '24', tone: 'green' },
  { label: 'Student reach', value: '8.7k', tone: 'blue' },
  { label: 'Avg. read time', value: '3m', tone: 'amber' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(updates[0]);

  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
      const searchable = `${item.type} ${item.title} ${item.body} ${item.audience}`.toLowerCase();
      return matchesCategory && searchable.includes(query.toLowerCase());
    });
  }, [activeCategory, query]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Megaphone size={22} />
          </div>
          <div>
            <h1>Campus Notify</h1>
            <p>Student update console</p>
          </div>
        </div>

        <nav className="category-nav" aria-label="Notification categories">
          {categories.map(({ name, icon: Icon }) => (
            <button
              className={activeCategory === name ? 'active' : ''}
              key={name}
              onClick={() => setActiveCategory(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="trust-panel">
          <ShieldCheck size={20} />
          <div>
            <strong>Verified campus feed</strong>
            <span>Admin approved alerts only</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Realtime student communication</p>
            <h2>Notifications that reach the right students fast</h2>
          </div>
          <button className="primary-action">
            <Plus size={18} />
            <span>New alert</span>
          </button>
        </header>

        <section className="stats-grid" aria-label="Notification statistics">
          {stats.map((stat) => (
            <article className={`stat-card ${stat.tone}`} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="feed-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Live feed</p>
                <h3>Latest updates</h3>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search updates"
                  placeholder="Search notices"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="update-list">
              {filteredUpdates.map((item) => (
                <button
                  className={`update-item ${selected.id === item.id ? 'selected' : ''}`}
                  key={item.id}
                  onClick={() => setSelected(item)}
                >
                  <div className="item-topline">
                    <span className={`pill ${item.type.toLowerCase()}`}>{item.type}</span>
                    <span>{item.time}</span>
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <div className="item-meta">
                    <span>{item.audience}</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="detail-panel">
            <div className="detail-status">
              <span className="live-dot" />
              <span>{selected.status}</span>
            </div>
            <span className={`pill ${selected.type.toLowerCase()}`}>{selected.type}</span>
            <h3>{selected.title}</h3>
            <p>{selected.body}</p>

            <div className="detail-grid">
              <div>
                <span>Audience</span>
                <strong>{selected.audience}</strong>
              </div>
              <div>
                <span>Priority</span>
                <strong>{selected.priority}</strong>
              </div>
            </div>

            <div className="composer">
              <div className="composer-title">
                <MessageSquareText size={18} />
                <strong>Quick broadcast</strong>
              </div>
              <textarea
                aria-label="Compose broadcast"
                defaultValue="Reminder: Please check the portal and acknowledge this notification."
              />
              <div className="composer-actions">
                <button>
                  <Users size={17} />
                  <span>Audience</span>
                </button>
                <button className="send-button">
                  <Send size={17} />
                  <span>Send</span>
                </button>
              </div>
            </div>

            <div className="delivery">
              <div>
                <CheckCircle2 size={18} />
                <span>Push notification</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <span>Email digest</span>
              </div>
              <div>
                <Sparkles size={18} />
                <span>SMS fallback for urgent notices</span>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
