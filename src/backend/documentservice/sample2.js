import { GoogleAuth } from 'google-auth-library';
import { drive_v3, Drive } from '@googleapis/drive';
import { docs_v1, Docs } from '@googleapis/docs';

async function main() {
  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/documents.readonly',
    ],
  });

  const drive = new Drive({ version: 'v3', auth });
  const docs = new Docs({ version: 'v1', auth });

  // Example: get metadata about a file
  const file = await drive.files.get({ fileId: 'YOUR_DOC_ID' });
  console.log('File metadata:', file.data);

  // Example: get document structure
  const doc = await docs.documents.get({ documentId: 'YOUR_DOC_ID' });
  console.log('Document title:', doc.data.title);
}

main().catch(console.error);
