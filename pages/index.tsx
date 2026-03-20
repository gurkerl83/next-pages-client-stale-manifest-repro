import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem'
      }}
    >
      <h1>Pages Router rewrite repro</h1>
      <p>
        Open <Link href="/docs/start">/docs/start</Link> to reproduce the stale
        client rewrite bug.
      </p>
    </main>
  );
}

