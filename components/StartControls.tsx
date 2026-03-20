'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

type StartControlsProps = {
  generatedHandlerReady: boolean;
};

async function postJson(url: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<{ message: string }>;
}

export function StartControls({ generatedHandlerReady }: StartControlsProps) {
  const [status, setStatus] = useState('No handler has been materialized in this session yet.');
  const [handlerReady, setHandlerReady] = useState(generatedHandlerReady);
  const [isPending, startTransition] = useTransition();

  const materializeHandler = () => {
    startTransition(async () => {
      try {
        const result = await postJson('/api/materialize-handler');
        setHandlerReady(true);
        setStatus(result.message);
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : 'Failed to materialize the handler.'
        );
      }
    });
  };

  const resetHandlers = () => {
    startTransition(async () => {
      try {
        const result = await postJson('/api/reset-handler');
        setHandlerReady(false);
        setStatus(result.message);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Failed to reset handlers.');
      }
    });
  };

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 12,
        padding: '1rem',
        display: 'grid',
        gap: '0.75rem'
      }}
    >
      <p style={{ margin: 0 }}>
        Current action status: <strong>{status}</strong>
      </p>
      <div style={{ color: '#475569', display: 'grid', gap: '0.35rem' }}>
        <p style={{ margin: 0 }}>
          Handler route: <strong>{handlerReady ? 'ready' : 'missing'}</strong>
        </p>
      </div>
      <div
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: 10,
          padding: '0.85rem',
          display: 'grid',
          gap: '0.5rem'
        }}
      >
        <p style={{ margin: 0 }}>
          First-hit attempt
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              materializeHandler();
            }}
          >
            Materialize example
          </button>
          <Link href="/docs/example" prefetch={false}>
            Go to example
          </Link>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            resetHandlers();
          }}
        >
          Reset handlers
        </button>
      </div>
      <div style={{ color: '#475569', display: 'grid', gap: '0.35rem' }}>
        <p style={{ margin: 0 }}>
          Repro steps:
        </p>
        <p style={{ margin: 0 }}>
          1. Open <code>/docs/start</code>.
        </p>
        <p style={{ margin: 0 }}>
          2. Click <code>Materialize example</code>.
        </p>
        <p style={{ margin: 0 }}>
          3. Click <code>Go to example</code>.
        </p>
        <p style={{ margin: 0 }}>
          4. To retry the exact first-hit scenario, click <code>Reset handlers</code>{' '}
          and then restart <code>pnpm dev</code>.
        </p>
      </div>
    </div>
  );
}
