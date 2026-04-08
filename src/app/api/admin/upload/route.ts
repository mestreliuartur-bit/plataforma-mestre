import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

// Retorna uma assinatura para upload direto e seguro do browser para o Cloudinary
// O browser envia a imagem diretamente ao Cloudinary — nunca passa pelo servidor Next.js
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const signature = generateUploadSignature();
  return NextResponse.json(signature);
}
