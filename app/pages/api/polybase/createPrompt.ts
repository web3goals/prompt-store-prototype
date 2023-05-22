import { Polybase } from "@polybase/client";
import { aescbc, decodeFromString, encodeToString } from "@polybase/util";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API to create prompt on polybase.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Define request params
    const prompt: string | undefined = req.body.prompt;
    const author: string | undefined = req.body.author;
    const created: number | undefined = req.body.created;
    if (!prompt || !author || !created) {
      throw new Error("Parameters are incorrect");
    }
    // Init polybase
    const db = new Polybase({
      defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE,
    });
    // Encrypt prompt
    const keyUint8Array = decodeFromString(
      process.env.NEXT_PUBLIC_POLYBASE_ENCRYPTION_PRIVATE_KEY || "",
      "utf8"
    );
    const promptUint8Array = decodeFromString(prompt, "utf8");
    const encryptedData = await aescbc.symmetricEncrypt(
      keyUint8Array,
      promptUint8Array
    );
    // Write data to polybase
    const id = `${author.toLowerCase()}_${created}`;
    const encryptionVersion = encryptedData.version;
    const encryptionNonceHex = encodeToString(encryptedData.nonce, "hex");
    const encryptionCiphertextHex = encodeToString(
      encryptedData.ciphertext,
      "hex"
    );
    const createResult = await db
      .collection("Prompt")
      .create([
        id,
        encryptionVersion,
        encryptionNonceHex,
        encryptionCiphertextHex,
      ]);
    // Return data
    res.status(200).json({ data: createResult });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
}
