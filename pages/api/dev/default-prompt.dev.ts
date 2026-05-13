import type { NextApiRequest, NextApiResponse } from 'next'
import { buildAuthoringPrompt } from '../../../utils/dev/AuthoringPrompt'

if (process.env.NODE_ENV === 'production') {
  console.warn('default-prompt.dev.ts loaded in production — this should not happen')
}

type SuccessResponse = { prompt: string }
type ErrorResponse = { error: string }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const today = new Date().toLocaleDateString('sv-SE')
  const prompt = buildAuthoringPrompt({ today })

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ prompt })
}
