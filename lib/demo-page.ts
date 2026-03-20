import { access } from 'node:fs/promises';
import path from 'node:path';

export const GENERATED_HANDLER_SLUG = 'example' as const;

export type GeneratedHandlerSlug = typeof GENERATED_HANDLER_SLUG;

export type DemoBlock =
  | {
      kind: 'paragraph';
      text: string;
    }
  | {
      kind: 'handler-only';
    };

export type DemoPageProps = {
  pageKind: 'start' | 'example';
  title: string;
  blocks: DemoBlock[];
  slugSegments: string[];
  generatedHandlerReady: boolean;
};

export function getHandlerPagePath(slug: GeneratedHandlerSlug) {
  return path.join(process.cwd(), 'pages', 'docs', '_handlers', `${slug}.tsx`);
}

export async function doesGeneratedHandlerExist(slug: GeneratedHandlerSlug) {
  try {
    await access(getHandlerPagePath(slug));
    return true;
  } catch {
    return false;
  }
}

export async function getGeneratedHandlerReadiness() {
  return doesGeneratedHandlerExist(GENERATED_HANDLER_SLUG);
}

export async function buildCatchAllProps(
  slugSegments: string[]
): Promise<DemoPageProps> {
  const slugPath = slugSegments.join('/');
  const generatedHandlerReady = await getGeneratedHandlerReadiness();

  if (slugPath === 'start') {
    return {
      pageKind: 'start',
      title: 'Catch-all start page',
      blocks: [
        {
          kind: 'paragraph',
          text: 'This is the light catch-all page. Materialize the handler after this page has already booted, then navigate to /docs/example.'
        }
      ],
      slugSegments,
      generatedHandlerReady
    };
  }

  return {
    pageKind: 'example',
    title: `Catch-all route for /docs/${slugPath || '(empty)'}`,
    blocks: [
      {
        kind: 'paragraph',
        text: 'This content came from the catch-all page. If you see a missing RewrittenOnlyComponent error after navigating to /docs/example, the client stayed on this page component.'
      }
    ],
    slugSegments,
    generatedHandlerReady
  };
}

export async function buildHandlerProps(
  slug: GeneratedHandlerSlug
): Promise<DemoPageProps> {
  const generatedHandlerReady = await getGeneratedHandlerReadiness();

  return {
    pageKind: 'example',
    title: 'Rewritten handler page',
    blocks: [
      {
        kind: 'paragraph',
        text: 'These props came from the rewritten handler page and require the special rewritten-only component entry.'
      },
      {
        kind: 'handler-only'
      }
    ],
    slugSegments: [slug],
    generatedHandlerReady
  };
}
