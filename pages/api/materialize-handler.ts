import type { NextApiRequest, NextApiResponse } from 'next';

import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { GENERATED_HANDLER_SLUG, getHandlerPagePath } from '../../lib/demo-page';

export default async function materializeHandler(
  request: NextApiRequest,
  response: NextApiResponse<{ message: string }>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  const destinationDirectory = path.join(process.cwd(), 'pages', 'docs', '_handlers');
  const fixturePath = path.join(process.cwd(), 'fixtures', 'example-handler.tsx');
  const destinationPath = getHandlerPagePath(GENERATED_HANDLER_SLUG);

  await mkdir(destinationDirectory, { recursive: true });
  await copyFile(fixturePath, destinationPath);

  console.log('[bug-report api] materialized handler', {
    slug: GENERATED_HANDLER_SLUG,
    destinationPath
  });

  response.status(200).json({
    message: 'Generated handler file materialized for /docs/example.'
  });
}
