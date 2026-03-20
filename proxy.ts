import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { access } from 'node:fs/promises';
import path from 'node:path';

const DATA_PREFIX = '/_next/data/';
const ROUTES = {
  '/docs/example': {
    rewriteDestination: '/docs/_handlers/example',
    generatedHandlerPath: path.join(process.cwd(), 'pages', 'docs', '_handlers', 'example.tsx')
  }
} as const;

const doesGeneratedHandlerExist = async (generatedHandlerPath: string) => {
  try {
    await access(generatedHandlerPath);
    return true;
  } catch {
    return false;
  }
};

const resolvePublicPathname = (pathname: string) => {
  if (!pathname.startsWith(DATA_PREFIX)) {
    return pathname;
  }

  const remainder = pathname.slice(DATA_PREFIX.length);
  const slashIndex = remainder.indexOf('/');

  if (slashIndex === -1) {
    return null;
  }

  const dataPath = remainder.slice(slashIndex + 1);

  if (!dataPath.endsWith('.json')) {
    return null;
  }

  return `/${dataPath.slice(0, -'.json'.length)}`;
};

export async function proxy(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  const publicPathname = resolvePublicPathname(rawPathname);

  if (publicPathname == null || publicPathname.startsWith('/docs/_handlers/')) {
    return NextResponse.next();
  }

  const route = ROUTES[publicPathname as keyof typeof ROUTES];

  if (route == null) {
    return NextResponse.next();
  }

  const handlerExists = await doesGeneratedHandlerExist(route.generatedHandlerPath);

  if (!handlerExists) {
    return NextResponse.next();
  }

  const rewriteUrl = new URL(route.rewriteDestination, request.url);
  rewriteUrl.search = request.nextUrl.search;

  console.log('[bug-report proxy] rewrite', {
    rawPathname,
    publicPathname,
    rewriteDestination: route.rewriteDestination
  });

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ['/docs/:path*', '/_next/data/:path*']
};
