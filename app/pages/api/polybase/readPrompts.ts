import { Polybase } from "@polybase/client";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API to read prompts from polybase.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Init polybase
    const db = new Polybase({
      defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
    });
    // Get prompt from polybase
    const records = await db.collection("Prompt").get();
    // Return data
    res.status(200).json({ data: records });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
}
