import { Polybase } from "@polybase/client";
import {
  aescbc,
  decodeFromString,
  EncryptedDataAesCbc256,
  encodeToString,
} from "@polybase/util";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API to read prompt from polybase.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Define request params
    const author = req.query.author?.toString();
    const created = req.query.created?.toString();
    if (!author || !created) {
      throw new Error("Parameters are incorrect");
    }
    // Init polybase
    const db = new Polybase({
      defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
    });
    // Get prompt from polybase
    const id = `${author.toLowerCase()}_${created.toLowerCase()}`;
    const record = await db.collection("Prompt").record(id).get();
    // Decrypt prompt
    const encryptedData: EncryptedDataAesCbc256 = {
      version: record.data.encryptionVersion,
      nonce: decodeFromString(record.data.encryptionNonceHex, "hex"),
      ciphertext: decodeFromString(record.data.encryptionCiphertextHex, "hex"),
    };
    const keyUint8Array = decodeFromString(
      process.env.NEXT_PUBLIC_POLYBASE_ENCRYPTION_PRIVATE_KEY || "",
      "utf8"
    );
    const promptUint8Array = await aescbc.symmetricDecrypt(
      keyUint8Array,
      encryptedData
    );
    // Return data
    res.status(200).json({ data: encodeToString(promptUint8Array, "utf8") });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
}
