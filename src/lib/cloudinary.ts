import { v2 as cloudinary } from "cloudinary";

// Configuração server-side do Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Gera assinatura para uploads seguros (signed upload)
export function generateUploadSignature(folder: string = "mestre-liu-artur/events") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = { timestamp, folder, transformation: "c_fill,ar_9:16,q_auto,f_auto" };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return { timestamp, signature, folder, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME };
}

// Remove imagem do Cloudinary pelo public_id
export async function deleteCloudinaryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

// Verifica se uma string é um public_id do Cloudinary (não começa com http)
export function isCloudinaryPublicId(src: string | null | undefined): boolean {
  if (!src) return false;
  return !src.startsWith("http");
}

// Constrói URL completa do Cloudinary a partir de um public_id
// Pode ser usada em Server Components (sem CldImage)
export function cloudinaryUrl(
  publicId: string | null | undefined,
  transformation = "c_fill,q_auto,f_auto"
): string | null {
  if (!publicId || publicId.startsWith("http")) return publicId ?? null;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/${transformation}/${publicId}`;
}
