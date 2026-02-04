import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMetrics } from './api';

export default function useAdminGuard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        await getAdminMetrics();
      } catch (err: any) {
        if (err?.code === 'FORBIDDEN' || err?.code === 'UNAUTHORIZED') {
          navigate('/admin/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [navigate]);

  return { loading };
}
