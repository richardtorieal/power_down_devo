import { useState, useEffect, useRef } from 'react';

const LS_PREFIX = 'devo_';

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function useDevoState() {
  const [hisProgress, setHisProgress] = useState<Record<number, boolean>>({});
  const [herProgress, setHerProgress] = useState<Record<number, boolean>>({});
  const [hisRead, setHisRead] = useState<Record<number, boolean>>({});
  const [herRead, setHerRead] = useState<Record<number, boolean>>({});
  const [hisJournal, setHisJournal] = useState<Record<number, string>>({});
  const [herJournal, setHerJournal] = useState<Record<number, string>>({});
  const [hisReflections, setHisReflections] = useState<Record<number, string>>({});
  const [herReflections, setHerReflections] = useState<Record<number, string>>({});
  const [hisName, setHisName] = useState<string>('');
  const [herName, setHerName] = useState<string>('');
  const [hisEmail, setHisEmail] = useState<string>('');
  const [herEmail, setHerEmail] = useState<string>('');
  const [activeUser, setActiveUser] = useState<'his' | 'her' | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [ownerRole, setOwnerRole] = useState<'his' | 'her' | ''>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Use refs to track values for polling function to avoid stale closures
  const activeUserRef = useRef(activeUser);
  const sessionIdRef = useRef(sessionId);
  useEffect(() => { activeUserRef.current = activeUser; }, [activeUser]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  // On mount: load localStorage, then detect/generate session ID
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(`${LS_PREFIX}session_id`);

      // Check URL for ?join=UUID (magic link)
      const urlParams = new URLSearchParams(window.location.search);
      const joinSession = urlParams.get('join');

      let resolvedSession: string;

      if (joinSession) {
        // User arrived via magic link — use that session
        resolvedSession = joinSession;
        localStorage.setItem(`${LS_PREFIX}session_id`, resolvedSession);
        // Clear the URL param without reload
        const url = new URL(window.location.href);
        url.searchParams.delete('join');
        window.history.replaceState({}, '', url.toString());
      } else if (storedSession) {
        resolvedSession = storedSession;
      } else {
        // First-time user: generate a new session
        resolvedSession = generateSessionId();
        localStorage.setItem(`${LS_PREFIX}session_id`, resolvedSession);
      }

      setSessionId(resolvedSession);

      // Load cached local state
      const storedHisProgress = localStorage.getItem(`${LS_PREFIX}his_progress`);
      const storedHerProgress = localStorage.getItem(`${LS_PREFIX}her_progress`);
      const storedHisRead = localStorage.getItem(`${LS_PREFIX}his_read`);
      const storedHerRead = localStorage.getItem(`${LS_PREFIX}her_read`);
      const storedHisJournal = localStorage.getItem(`${LS_PREFIX}his_journal`);
      const storedHerJournal = localStorage.getItem(`${LS_PREFIX}her_journal`);
      const storedHisReflections = localStorage.getItem(`${LS_PREFIX}his_reflections`);
      const storedHerReflections = localStorage.getItem(`${LS_PREFIX}her_reflections`);
      const storedHisName = localStorage.getItem(`${LS_PREFIX}his_name`);
      const storedHerName = localStorage.getItem(`${LS_PREFIX}her_name`);
      const storedHisEmail = localStorage.getItem(`${LS_PREFIX}his_email`);
      const storedHerEmail = localStorage.getItem(`${LS_PREFIX}her_email`);
      const storedActiveUser = localStorage.getItem(`${LS_PREFIX}active_user`);
      const storedOwnerRole = localStorage.getItem(`${LS_PREFIX}owner_role`);

      if (storedHisProgress) setHisProgress(JSON.parse(storedHisProgress));
      if (storedHerProgress) setHerProgress(JSON.parse(storedHerProgress));
      if (storedHisRead) setHisRead(JSON.parse(storedHisRead));
      if (storedHerRead) setHerRead(JSON.parse(storedHerRead));
      if (storedHisJournal) setHisJournal(JSON.parse(storedHisJournal));
      if (storedHerJournal) setHerJournal(JSON.parse(storedHerJournal));
      if (storedHisReflections) setHisReflections(JSON.parse(storedHisReflections));
      if (storedHerReflections) setHerReflections(JSON.parse(storedHerReflections));
      if (storedHisName) setHisName(storedHisName);
      if (storedHerName) setHerName(storedHerName);
      if (storedHisEmail) setHisEmail(storedHisEmail);
      if (storedHerEmail) setHerEmail(storedHerEmail);
      if (storedActiveUser) setActiveUser(storedActiveUser as 'his' | 'her');
      if (storedOwnerRole) setOwnerRole(storedOwnerRole as 'his' | 'her');
    } catch (e) {
      console.error('Error loading local devotions state', e);
    }
    setIsLoaded(true);
  }, []);

  // Fetch state from server (role-partitioned to prevent overwriting active typing)
  const fetchServerState = async (isInitial = false) => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      const res = await fetch(`/api/devo/state?session=${encodeURIComponent(sid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          const s = data.state;
          const currentActiveUser = activeUserRef.current;

          if (s.ownerRole) setOwnerRole(s.ownerRole);

          if (isInitial || !currentActiveUser) {
            setHisProgress(s.hisProgress || {});
            setHerProgress(s.herProgress || {});
            setHisRead(s.hisRead || {});
            setHerRead(s.herRead || {});
            setHisJournal(s.hisJournal || {});
            setHerJournal(s.herJournal || {});
            setHisReflections(s.hisReflections || {});
            setHerReflections(s.herReflections || {});
            if (s.hisName) setHisName(s.hisName);
            if (s.herName) setHerName(s.herName);
            if (s.hisEmail) setHisEmail(s.hisEmail);
            if (s.herEmail) setHerEmail(s.herEmail);
          } else {
            // Role Partitioning: Only sync partner's data
            if (currentActiveUser === 'his') {
              setHerProgress(s.herProgress || {});
              setHerRead(s.herRead || {});
              setHerJournal(s.herJournal || {});
              setHerReflections(s.herReflections || {});
              if (s.herName) setHerName(s.herName);
              if (s.herEmail) setHerEmail(s.herEmail);
            } else if (currentActiveUser === 'her') {
              setHisProgress(s.hisProgress || {});
              setHisRead(s.hisRead || {});
              setHisJournal(s.hisJournal || {});
              setHisReflections(s.hisReflections || {});
              if (s.hisName) setHisName(s.hisName);
              if (s.hisEmail) setHisEmail(s.hisEmail);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to sync server state:', err);
    }
  };

  // Initial load sync
  useEffect(() => {
    if (isLoaded && sessionId) {
      fetchServerState(true);
    }
  }, [isLoaded, sessionId]);

  // Set owner role on first onboarding
  useEffect(() => {
    if (isLoaded && activeUser && !ownerRole) {
      const partnerExists = activeUser === 'his' ? !!herName : !!hisName;
      if (!partnerExists) {
        setOwnerRole(activeUser);
      }
    }
  }, [activeUser, ownerRole, hisName, herName, isLoaded]);

  // Polling for updates every 2 minutes
  useEffect(() => {
    if (!isLoaded || !sessionId) return;
    const interval = setInterval(() => {
      fetchServerState(false);
    }, 120000);
    return () => clearInterval(interval);
  }, [isLoaded, sessionId]);

  // Debounced server POST whenever tracked state changes
  useEffect(() => {
    if (!isLoaded || !sessionId) return;
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/devo/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            state: {
              hisProgress, herProgress,
              hisRead, herRead,
              hisJournal, herJournal,
              hisReflections, herReflections,
              hisName, herName,
              hisEmail, herEmail,
              ownerRole
            }
          })
        });
      } catch (err) {
        console.error('Failed to save state to server:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    hisProgress, herProgress, hisRead, herRead,
    hisJournal, herJournal, hisReflections, herReflections,
    hisName, herName, hisEmail, herEmail, ownerRole,
    isLoaded, sessionId
  ]);

  // Persist each slice to localStorage
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}his_progress`, JSON.stringify(hisProgress)); }, [hisProgress, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}her_progress`, JSON.stringify(herProgress)); }, [herProgress, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}his_read`, JSON.stringify(hisRead)); }, [hisRead, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}her_read`, JSON.stringify(herRead)); }, [herRead, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}his_journal`, JSON.stringify(hisJournal)); }, [hisJournal, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}her_journal`, JSON.stringify(herJournal)); }, [herJournal, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}his_reflections`, JSON.stringify(hisReflections)); }, [hisReflections, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem(`${LS_PREFIX}her_reflections`, JSON.stringify(herReflections)); }, [herReflections, isLoaded]);
  useEffect(() => { if (isLoaded) { if (hisName) localStorage.setItem(`${LS_PREFIX}his_name`, hisName); else localStorage.removeItem(`${LS_PREFIX}his_name`); } }, [hisName, isLoaded]);
  useEffect(() => { if (isLoaded) { if (herName) localStorage.setItem(`${LS_PREFIX}her_name`, herName); else localStorage.removeItem(`${LS_PREFIX}her_name`); } }, [herName, isLoaded]);
  useEffect(() => { if (isLoaded) { if (hisEmail) localStorage.setItem(`${LS_PREFIX}his_email`, hisEmail); else localStorage.removeItem(`${LS_PREFIX}his_email`); } }, [hisEmail, isLoaded]);
  useEffect(() => { if (isLoaded) { if (herEmail) localStorage.setItem(`${LS_PREFIX}her_email`, herEmail); else localStorage.removeItem(`${LS_PREFIX}her_email`); } }, [herEmail, isLoaded]);
  useEffect(() => { if (isLoaded) { if (activeUser) localStorage.setItem(`${LS_PREFIX}active_user`, activeUser); else localStorage.removeItem(`${LS_PREFIX}active_user`); } }, [activeUser, isLoaded]);
  useEffect(() => { if (isLoaded) { if (ownerRole) localStorage.setItem(`${LS_PREFIX}owner_role`, ownerRole); else localStorage.removeItem(`${LS_PREFIX}owner_role`); } }, [ownerRole, isLoaded]);

  const toggleHisProgress = (day: number) => setHisProgress(prev => ({ ...prev, [day]: !prev[day] }));
  const toggleHerProgress = (day: number) => setHerProgress(prev => ({ ...prev, [day]: !prev[day] }));
  const updateHisRead = (day: number, isRead: boolean) => setHisRead(prev => ({ ...prev, [day]: isRead }));
  const updateHerRead = (day: number, isRead: boolean) => setHerRead(prev => ({ ...prev, [day]: isRead }));
  const updateHisJournal = (week: number, note: string) => setHisJournal(prev => ({ ...prev, [week]: note }));
  const updateHerJournal = (week: number, note: string) => setHerJournal(prev => ({ ...prev, [week]: note }));

  const updateHisReflection = (day: number, answer: string) => {
    setHisReflections(prev => ({ ...prev, [day]: answer }));
    setHisProgress(prev => ({ ...prev, [day]: answer.trim().length > 0 }));
  };

  const updateHerReflection = (day: number, answer: string) => {
    setHerReflections(prev => ({ ...prev, [day]: answer }));
    setHerProgress(prev => ({ ...prev, [day]: answer.trim().length > 0 }));
  };

  const resetAll = async () => {
    const empty = {
      hisProgress: {}, herProgress: {}, hisRead: {}, herRead: {},
      hisJournal: {}, herJournal: {}, hisReflections: {}, herReflections: {},
      hisName, herName, hisEmail, herEmail,
      ownerRole
    };
    setHisProgress({}); setHerProgress({});
    setHisRead({}); setHerRead({});
    setHisJournal({}); setHerJournal({});
    setHisReflections({}); setHerReflections({});

    try {
      await fetch('/api/devo/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, state: empty })
      });
    } catch (err) {
      console.error('Failed to reset server state:', err);
    }
  };

  return {
    hisProgress, herProgress,
    hisRead, herRead,
    hisJournal, herJournal,
    hisReflections, herReflections,
    hisName, herName,
    hisEmail, herEmail,
    activeUser, sessionId, ownerRole, isLoaded,
    setHisName, setHerName,
    setHisEmail, setHerEmail,
    setActiveUser,
    toggleHisProgress, toggleHerProgress,
    updateHisRead, updateHerRead,
    updateHisJournal, updateHerJournal,
    updateHisReflection, updateHerReflection,
    resetAll
  };
}

export type DevoState = ReturnType<typeof useDevoState>;
