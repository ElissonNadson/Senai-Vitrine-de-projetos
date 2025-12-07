import { useState, useEffect, useCallback } from 'react';
import { 
  getSessions, 
  revokeSession, 
  revokeOtherSessions,
  Session,
  SessionsResponse 
} from '../api/sessions';

interface UseSessionsReturn {
  sessions: Session[];
  total: number;
  loading: boolean;
  error: string | null;
  refreshSessions: () => Promise<void>;
  endSession: (sessionId: string) => Promise<boolean>;
  endOtherSessions: () => Promise<boolean>;
  endingSession: string | null;
  endingOthers: boolean;
  successMessage: string | null;
}

export function useSessions(): UseSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endingSession, setEndingSession] = useState<string | null>(null);
  const [endingOthers, setEndingOthers] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Limpa mensagem de sucesso após 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const refreshSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessions();
      setSessions(data.sessoes);
      setTotal(data.total);
    } catch (err: any) {
      console.error('Erro ao buscar sessões:', err);
      setError(err.response?.data?.message || 'Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setEndingSession(sessionId);
      await revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.uuid !== sessionId));
      setTotal(prev => prev - 1);
      setSuccessMessage('Sessão encerrada com sucesso');
      return true;
    } catch (err: any) {
      console.error('Erro ao encerrar sessão:', err);
      setError(err.response?.data?.message || 'Erro ao encerrar sessão');
      return false;
    } finally {
      setEndingSession(null);
    }
  }, []);

  const endOtherSessions = useCallback(async (): Promise<boolean> => {
    try {
      setEndingOthers(true);
      const result = await revokeOtherSessions();
      setSessions(prev => prev.filter(s => s.is_current));
      setTotal(1);
      
      if (result.count === 0) {
        setSuccessMessage('Não há outras sessões para encerrar');
      } else {
        setSuccessMessage(`${result.count} sessão(ões) encerrada(s) com sucesso`);
      }
      return true;
    } catch (err: any) {
      console.error('Erro ao encerrar outras sessões:', err);
      setError('Erro ao encerrar outras sessões');
      return false;
    } finally {
      setEndingOthers(false);
    }
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return {
    sessions,
    total,
    loading,
    error,
    refreshSessions,
    endSession,
    endOtherSessions,
    endingSession,
    endingOthers,
    successMessage,
  };
}
