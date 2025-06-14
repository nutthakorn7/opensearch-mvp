import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const fetchLogs = async () => {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (res.status === 401) {
      router.push('/');
      return;
    }
    const data = await res.json();
    setLogs(data.hits.hits);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <input className="p-2 border w-full my-4" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter query" />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={fetchLogs}>Search</button>
      <div className="mt-6 space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className="p-4 border rounded">
            <p><strong>Time:</strong> {log._source['@timestamp']}</p>
            <p><strong>Message:</strong> {log._source.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
