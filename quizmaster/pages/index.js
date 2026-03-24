import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

const TOPICS = [
  { id: 'India Current Affairs',              label: '🇮🇳 India Current Affairs',    defaultOn: true },
  { id: 'World Current Affairs',              label: '🌍 World Current Affairs',     defaultOn: true },
  { id: "Who's Who in India",                 label: "👤 Who's Who in India",        defaultOn: true },
  { id: 'World Leaders',                      label: '🏛️ World Leaders',             defaultOn: true },
  { id: 'Bollywood',                          label: '🎬 Bollywood',                 defaultOn: true },
  { id: 'Sports',                             label: '⚽ Sports',                    defaultOn: true },
  { id: 'Dates and Major Events',             label: '📅 Dates & Events',            defaultOn: true },
  { id: 'Largest Biggest Smallest First Records', label: '🏆 Records & Firsts',      defaultOn: true },
  { id: 'Indian History',                     label: '📜 Indian History',            defaultOn: false },
  { id: 'Indian Politics and Constitution',   label: '⚖️ Indian Polity',             defaultOn: false },
  { id: 'Science and Technology',             label: '🔬 Science & Tech',            defaultOn: false },
  { id: 'Geography India and World',          label: '🗺️ Geography',                defaultOn: false },
  { id: 'Economics and Business India',       label: '💰 Economy & Business',        defaultOn: false },
  { id: 'Awards and Honours India',           label: '🏅 Awards & Honours',          defaultOn: false },
];

const DIFFICULTIES = ['Easy', 'Mixed', 'Hard'];
const TIMER_SECONDS = 20;
const LETTERS = ['A', 'B', 'C', 'D'];

/* ─── Tiny style helpers (inline styles keep this single-file) ─── */
const s = {
  app: { maxWidth: 820, margin: '0 auto', padding: '24px 16px 80px' },
  header: { textAlign: 'center', marginBottom: 32 },
  logo: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 50, padding: '8px 20px', marginBottom: 20,
  },
  logoDot: {
    width: 10, height: 10, borderRadius: '50%', background: '#FF6B1A',
    animation: 'pulse 2s infinite',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700,
    color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,6vw,50px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 },
  h1Span: { color: '#FF6B1A' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 10 },

  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 },
  statCard: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 14, padding: '14px 12px', textAlign: 'center',
  },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 },

  sectionTitle: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 },

  topics: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },

  diffRow: { display: 'flex', gap: 8, marginBottom: 24 },

  btnStart: {
    width: '100%', padding: 18, background: '#FF6B1A', color: '#fff', border: 'none',
    borderRadius: 16, fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.2s', marginBottom: 0,
  },

  card: {
    background: '#fff', borderRadius: 24, padding: 32, marginBottom: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'fadeUp 0.35s ease',
  },
  qMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  qCategory: {
    background: '#FFF3E8', color: '#FF6B1A', fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: 50,
  },
  qNumber: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  qText: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(17px,3vw,22px)', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.45, marginBottom: 28 },

  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },

  explanation: {
    marginTop: 20, padding: '14px 16px',
    background: '#F9FAFB', borderLeft: '4px solid #0D1B3E',
    borderRadius: '0 12px 12px 0', fontSize: 14, color: '#374151', lineHeight: 1.6,
  },
  explanationLabel: { display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D1B3E', marginBottom: 6, fontWeight: 700 },

  btnNext: {
    width: '100%', marginTop: 20, padding: 16, background: '#0D1B3E', color: '#fff',
    border: 'none', borderRadius: 14, fontFamily: "'Playfair Display', serif", fontSize: 17,
    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
  },

  loadingCard: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 24, padding: 56, textAlign: 'center',
  },
  spinner: {
    width: 44, height: 44, border: '3px solid rgba(255,107,26,0.2)', borderTopColor: '#FF6B1A',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
  },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 15 },

  resultCard: {
    background: '#fff', borderRadius: 24, padding: '48px 32px', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'fadeUp 0.35s ease',
  },
  resultScore: { fontFamily: "'Playfair Display', serif", fontSize: 60, fontWeight: 900, color: '#FF6B1A', lineHeight: 1, margin: '16px 0' },

  progressWrap: { background: 'rgba(255,255,255,0.08)', borderRadius: 50, height: 6, marginBottom: 20, overflow: 'hidden' },

  errorBox: {
    background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)',
    borderRadius: 12, padding: '14px 18px', color: '#FCA5A5', fontSize: 14,
    lineHeight: 1.6, marginBottom: 16,
  },

  streakBadge: {
    position: 'fixed', top: 20, right: 20, background: '#D4A017', color: '#fff',
    padding: '10px 18px', borderRadius: 50, fontWeight: 700, fontSize: 14,
    boxShadow: '0 4px 20px rgba(212,160,23,0.4)', animation: 'slideIn 0.4s ease', zIndex: 100,
  },
};

/* ─── Chip helpers ─── */
function topicChipStyle(active) {
  return {
    padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s',
    border: active ? '1.5px solid #FF6B1A' : '1.5px solid rgba(255,255,255,0.2)',
    background: active ? '#FF6B1A' : 'rgba(255,255,255,0.06)',
    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
  };
}

function diffBtnStyle(active) {
  return {
    flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: 'none',
    borderBottom: active ? '2px solid #D4A017' : '2px solid rgba(255,255,255,0.12)',
    background: active ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.05)',
    color: active ? '#D4A017' : 'rgba(255,255,255,0.55)',
  };
}

function optionBtnStyle(state) {
  const base = {
    padding: '15px 16px', border: '2px solid', borderRadius: 14, cursor: state === 'default' ? 'pointer' : 'default',
    textAlign: 'left', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
    transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: 12, lineHeight: 1.4,
    width: '100%',
  };
  if (state === 'correct') return { ...base, borderColor: '#1A7A4A', background: '#F0FFF6', color: '#1A7A4A' };
  if (state === 'wrong')   return { ...base, borderColor: '#C0392B', background: '#FFF5F5', color: '#C0392B' };
  return { ...base, borderColor: '#E5E7EB', background: '#FAFAFA', color: '#1A1A2E' };
}

function letterBadgeStyle(state) {
  const base = {
    width: 26, height: 26, minWidth: 26, borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
  };
  if (state === 'correct') return { ...base, background: '#1A7A4A', color: '#fff' };
  if (state === 'wrong')   return { ...base, background: '#C0392B', color: '#fff' };
  return { ...base, background: '#E5E7EB', color: '#6B7280' };
}

/* ─── Timer component ─── */
function Timer({ timeLeft }) {
  const pct = (timeLeft / TIMER_SECONDS) * 100;
  const color = timeLeft <= 5 ? '#C0392B' : timeLeft <= 10 ? '#E67E22' : '#FF6B1A';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 1s linear, background 0.5s' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 24, textAlign: 'right' }}>{timeLeft}</span>
    </div>
  );
}

/* ─── Main component ─── */
export default function QuizApp() {
  const [screen, setScreen] = useState('home'); // home | loading | quiz | result
  const [selectedTopics, setSelectedTopics] = useState(() => TOPICS.filter(t => t.defaultOn).map(t => t.id));
  const [difficulty, setDifficulty] = useState('Mixed');
  const [questions, setQuestions]   = useState([]);
  const [qIdx, setQIdx]             = useState(0);
  const [answered, setAnswered]     = useState(false);
  const [chosen, setChosen]         = useState(null);
  const [timeLeft, setTimeLeft]     = useState(TIMER_SECONDS);
  const [error, setError]           = useState('');
  const [showStreak, setShowStreak] = useState(false);

  // Persistent stats
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  // Session stats
  const [session, setSession] = useState({ answered: 0, correct: 0 });

  const timerRef = useRef(null);
  const streakTimer = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearTimer(); return 0; }
        return t - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Time out
  useEffect(() => {
    if (screen === 'quiz' && !answered && timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, answered, screen]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  function toggleTopic(id) {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  async function startQuiz() {
    if (selectedTopics.length === 0) { setError('Please select at least one topic.'); return; }
    setError('');
    setScreen('loading');
    setSession({ answered: 0, correct: 0 });
    setQIdx(0);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selectedTopics, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions.');
      setQuestions(data.questions);
      setScreen('quiz');
      setAnswered(false);
      setChosen(null);
      startTimer();
    } catch (err) {
      setError(err.message);
      setScreen('home');
    }
  }

  function handleTimeout() {
    setAnswered(true);
    clearTimer();
    setStats(prev => {
      const newStreak = 0;
      return { ...prev, total: prev.total + 1, streak: newStreak };
    });
    setSession(prev => ({ ...prev, answered: prev.answered + 1 }));
  }

  function selectAnswer(idx) {
    if (answered) return;
    setAnswered(true);
    setChosen(idx);
    clearTimer();
    const isCorrect = idx === questions[qIdx].answer;
    setStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newBest = Math.max(prev.bestStreak, newStreak);
      if (newStreak >= 3) {
        setShowStreak(true);
        clearTimeout(streakTimer.current);
        streakTimer.current = setTimeout(() => setShowStreak(false), 2500);
      } else {
        setShowStreak(false);
      }
      return {
        total: prev.total + 1,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        streak: newStreak,
        bestStreak: newBest,
      };
    });
    setSession(prev => ({
      answered: prev.answered + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
    }));
  }

  function nextQuestion() {
    if (qIdx + 1 >= questions.length) {
      setScreen('result');
      clearTimer();
    } else {
      setQIdx(i => i + 1);
      setAnswered(false);
      setChosen(null);
      startTimer();
    }
  }

  function getOptionState(idx) {
    if (!answered) return 'default';
    const correctIdx = questions[qIdx]?.answer;
    if (idx === correctIdx) return 'correct';
    if (idx === chosen && chosen !== correctIdx) return 'wrong';
    return 'default';
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  const q = questions[qIdx];
  const sessionPct = questions.length > 0 ? (qIdx / questions.length) * 100 : 0;

  function ResultScreen() {
    const pct = session.answered > 0 ? Math.round((session.correct / session.answered) * 100) : 0;
    let emoji, title, msg;
    if (pct >= 90) { emoji = '🏆'; title = 'Outstanding!'; msg = 'You are quiz-ready! Excellent performance.'; }
    else if (pct >= 70) { emoji = '🎉'; title = 'Great Job!'; msg = 'Strong performance — keep practising the tricky ones.'; }
    else if (pct >= 50) { emoji = '👍'; title = 'Good Effort!'; msg = 'Solid foundation. More practice will sharpen your edge.'; }
    else { emoji = '💪'; title = 'Keep Going!'; msg = 'Every question is a lesson — you will improve with practice!'; }
    return (
      <div style={s.resultCard}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: '#1A1A2E', marginBottom: 8 }}>{title}</h2>
        <p style={{ color: '#6B7280', fontSize: 16 }}>Session complete — here&apos;s how you did</p>
        <div style={s.resultScore}>{session.correct}/{session.answered}</div>
        <p style={{ color: '#6B7280', marginBottom: 28 }}>{msg} Accuracy: {pct}%</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={startQuiz} style={{ ...s.btnStart, width: 'auto', padding: '14px 28px', fontSize: 16, borderRadius: 12 }}>
            🔄 Play Again
          </button>
          <button onClick={() => setScreen('home')} style={{ ...s.btnStart, width: 'auto', padding: '14px 28px', fontSize: 16, borderRadius: 12, background: '#0D1B3E' }}>
            🏠 Change Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>QuizMaster Pro — India & World GK</title>
        <meta name="description" content="AI-powered India & World General Knowledge quiz training" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>" />
      </Head>

      {/* Streak badge */}
      {showStreak && (
        <div style={s.streakBadge}>
          🔥 {stats.streak} in a row!
        </div>
      )}

      <div style={s.app}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>
            <div style={s.logoDot} />
            <span style={s.logoText}>QuizMaster Pro</span>
          </div>
          <h1 style={s.h1}>India & World<br /><span style={s.h1Span}>General Knowledge</span></h1>
          <p style={s.subtitle}>AI-powered training for competitive quiz excellence</p>
        </div>

        {/* Stats bar */}
        <div style={s.statsBar}>
          {[
            { label: 'Attempted', value: stats.total, color: '#fff' },
            { label: 'Correct',   value: stats.correct, color: '#4ADE80' },
            { label: 'Accuracy',  value: accuracy !== null ? accuracy + '%' : '—', color: '#D4A017' },
            { label: 'Best Streak', value: stats.bestStreak, color: '#FF6B1A' },
          ].map(({ label, value, color }) => (
            <div key={label} style={s.statCard}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── HOME ── */}
        {screen === 'home' && (
          <>
            <div style={s.sectionTitle}>Choose Topics</div>
            <div style={s.topics}>
              {TOPICS.map(t => (
                <div key={t.id} style={topicChipStyle(selectedTopics.includes(t.id))} onClick={() => toggleTopic(t.id)}>
                  {t.label}
                </div>
              ))}
            </div>

            <div style={s.sectionTitle}>Difficulty</div>
            <div style={s.diffRow}>
              {DIFFICULTIES.map(d => (
                <div key={d} style={diffBtnStyle(difficulty === d)} onClick={() => setDifficulty(d)}>{d}</div>
              ))}
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <button style={s.btnStart} onClick={startQuiz}>🚀 Start Quiz Session</button>
          </>
        )}

        {/* ── LOADING ── */}
        {screen === 'loading' && (
          <div style={s.loadingCard}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Generating your questions…</p>
          </div>
        )}

        {/* ── QUIZ ── */}
        {screen === 'quiz' && q && (
          <>
            {/* Session progress bar */}
            <div style={s.progressWrap}>
              <div style={{ height: '100%', width: `${sessionPct}%`, background: 'linear-gradient(90deg,#FF6B1A,#D4A017)', borderRadius: 50, transition: 'width 0.5s ease' }} />
            </div>

            <div style={s.card}>
              {/* Meta row */}
              <div style={s.qMeta}>
                <span style={s.qCategory}>{q.topic}</span>
                <Timer timeLeft={timeLeft} />
              </div>

              <div style={s.qNumber}>Question {qIdx + 1} of {questions.length}</div>
              <div style={s.qText}>{q.question}</div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
                {q.options.map((opt, i) => {
                  const state = getOptionState(i);
                  return (
                    <button key={i} onClick={() => selectAnswer(i)} disabled={answered} style={optionBtnStyle(state)}>
                      <span style={letterBadgeStyle(state)}>{LETTERS[i]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div style={s.explanation}>
                  <strong style={s.explanationLabel}>📚 Did you know?</strong>
                  {q.explanation}
                </div>
              )}

              {/* Next button */}
              {answered && (
                <button style={s.btnNext} onClick={nextQuestion}>
                  {qIdx + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
                </button>
              )}
            </div>
          </>
        )}

        {/* ── RESULT ── */}
        {screen === 'result' && <ResultScreen />}

      </div>
    </>
  );
}
