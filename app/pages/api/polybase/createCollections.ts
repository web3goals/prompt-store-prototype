import { Polybase } from "@polybase/client";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API to init collections on polybase.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = new Polybase({
      defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
    });
    const schema = `
        @public
        collection Prompt {
            id: string;
            encryptionVersion: string;
            encryptionNonceHex: string;
            encryptionCiphertextHex: string;
        
            constructor (id: string, encryptionVersion: string, encryptionNonceHex: string, encryptionCiphertextHex: string) {
                this.id = id;
                this.encryptionVersion = encryptionVersion;
                this.encryptionNonceHex = encryptionNonceHex;
                this.encryptionCiphertextHex = encryptionCiphertextHex;
            }
        }
    `;
    const applySchemaResult = await db.applySchema(
      schema,
      process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE
    );
    res.status(200).json({ data: applySchemaResult });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
}
