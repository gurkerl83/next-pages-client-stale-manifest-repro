import type { InferGetStaticPropsType } from 'next';

import Link from 'next/link';

import { DocRenderer } from '../../../components/DocRenderer';
import { RewrittenOnlyComponent } from '../../../components/RewrittenOnlyComponent';
import { buildHandlerProps } from '../../../lib/demo-page';

export async function getStaticProps() {
  console.log('[bug-report handler] getStaticProps');

  return {
    props: await buildHandlerProps('example')
  };
}

export default function ExampleHandlerPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <main
      style={{
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gap: '1rem'
      }}
    >
      <h1>{props.title}</h1>
      <p>
        This page statically imports <code>RewrittenOnlyComponent</code>.
      </p>
      <div>
        <Link
          href="/docs/start"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.55rem 0.9rem',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            textDecoration: 'none'
          }}
        >
          Back to start
        </Link>
      </div>
      <DocRenderer blocks={props.blocks} registry={{ RewrittenOnlyComponent }} />
    </main>
  );
}
