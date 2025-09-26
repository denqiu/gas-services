import { google } from 'googleapis';
import fs from 'fs';

async function exportDoc(docId) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const drive = google.drive({ version: 'v3', auth });

  // Export Google Doc as Markdown (Docs exports to plain text, HTML, etc. You might need pandoc or another lib to refine to Markdown)
  const res = await drive.files.export(
    { fileId: docId, mimeType: 'text/plain' }, // or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    { responseType: 'stream' }
  );

  const dest = fs.createWriteStream('doc.md');
  await new Promise((resolve, reject) => {
    res.data.pipe(dest);
    res.data.on('end', resolve);
    res.data.on('error', reject);
  });

  console.log('Document exported as Markdown-ish text.');
}

async function listRevisions(docId) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.revisions.list({ fileId: docId });
  console.log('Revisions:', res.data.revisions);
}

const docId = 'YOUR_DOC_ID_HERE';
exportDoc(docId).then(() => listRevisions(docId));