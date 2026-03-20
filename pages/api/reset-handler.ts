import type { NextApiRequest, NextApiResponse } from 'next';

import { rm } from 'node:fs/promises';

import { GENERATED_HANDLER_SLUG, getHandlerPagePath } from '../../lib/demo-page';

export default async function resetHandler(
  request: NextApiRequest,
  response: NextApiResponse<{ message: string }>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ message: 'Method not allowed.' });
    return;
  }

  await rm(getHandlerPagePath(GENERATED_HANDLER_SLUG), { force: true });

  console.log('[bug-report api] reset handlers', {
    slugs: [GENERATED_HANDLER_SLUG]
  });

  response.status(200).json({
    message: 'Generated handler file removed.'
  });
}
