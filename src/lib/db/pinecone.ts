import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// let pinecone: Pinecone | null = null;

// export const getPineconeClient = async () => {
//   if (!pinecone) {
//     pinecone = new Pinecone({
//       apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
//     });
//   }
//   return pinecone;
// };

export async function loadS3intoPinecone(file_key: string) {
  console.log("Downloading s3 to file system...");
  const file_name = await downloadFromS3(file_key);
  if (!file_name) {
    console.error("Error downloading file");
    return;
  }
  const loader = new PDFLoader(file_name);
  const pages = loader.load();
  pages.then((pages) => {
    console.log("Pages: ", pages);
  });
  return pages;
}
