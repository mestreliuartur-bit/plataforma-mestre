import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

// POST — assina os parâmetros enviados pelo CldUploadWidget (signed upload)
// O browser envia a imagem diretamente ao Cloudinary, nunca passa pelo servidor.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const paramsToSign: Record<string, string | number> = body.paramsToSign ?? {};

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({ signature, timestamp: paramsToSign.timestamp });
}
