import { ProtocolEnum, SpheronClient } from "@spheron/storage";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = new SpheronClient({
      token: process.env.NEXT_PUBLIC_SPHERON_API_KEY || "",
    });
    const { uploadToken } = await client.createSingleUploadToken({
      name: "browser-upload",
      protocol: ProtocolEnum.IPFS,
    });
    res.status(200).json({
      uploadToken: uploadToken,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
