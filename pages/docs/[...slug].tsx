import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType
} from 'next';

import { DocRenderer } from '../../components/DocRenderer';
import { StartControls } from '../../components/StartControls';
import { buildCatchAllProps } from '../../lib/demo-page';

export const getStaticPaths: GetStaticPaths<{ slug: string[] }> = async () => {
  return {
    paths: [
      { params: { slug: ['start'] } },
      { params: { slug: ['example'] } }
    ],
    fallback: false
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug?: string[] }>
) {
  const props = await buildCatchAllProps(context.params?.slug ?? []);

  console.log('[bug-report catch-all] getStaticProps', {
    slugSegments: props.slugSegments
  });

  return {
    props
  };
}

export default function CatchAllDocsPage(
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
        Catch-all page module: <code>pages/docs/[...slug].tsx</code>
      </p>
      {props.pageKind === 'start' ? (
        <StartControls generatedHandlerReady={props.generatedHandlerReady} />
      ) : null}
      <DocRenderer blocks={props.blocks} registry={{}} />
    </main>
  );
}
