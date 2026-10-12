const fs = require('fs');
const path = require('path');

function createTerm1CalendarPdf() {
  const dir = path.join(__dirname, '..', 'public', 'docs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function escapePdf(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\)');
  }

  let stream = 'BT\n/F1 16 Tf\n50 780 Td\n(ST MARY\'S CATHOLIC PRIMARY SCHOOL) Tj\n';
  stream += '0 -22 Td\n/F1 12 Tf\n(OFFICIAL TERM 1 CALENDAR - 2026 ACADEMIC YEAR) Tj\n';
  stream += '0 -18 Td\n/F2 10 Tf\n(Motto: Forever Onward | Catholic English Medium Primary Education) Tj\n';
  stream += '0 -20 Td\n/F1 10 Tf\n(-------------------------------------------------------------------------------------------------) Tj\n';

  const textBody = [
    ['TERM 1 IMPORTANT DATES & HIGHLIGHTS', true],
    ['05 Jan 2026: Administration Office Re-opens (7:30 AM)', false],
    ['13 Jan 2026: Term 1 Official Opening for All Students', false],
    ['24 Jan 2026: Annual Parents & Teachers Meet & Greet', false],
    ['12 Feb 2026: Inter-House Athletics & Sports Day', false],
    ['26 Feb 2026 - 02 Mar 2026: Mid-Term Break', false],
    ['03 Apr 2026: Good Friday (Public Holiday)', false],
    ['06 Apr 2026: Easter Monday (Public Holiday)', false],
    ['10 Apr 2026: Official End of Term 1 & Report Distribution', false],
    ['', false],
    ['OPERATING HOURS', true],
    ['Monday - Thursday: 7:30 AM - 3:30 PM | Friday: 7:30 AM - 12:30 PM', false],
    ['Plot 1040 Lenganeng, Tlokweng, Botswana | Tel: +267 392 8788', false]
  ];

  for (const [line, isHeader] of textBody) {
    if (line === '') {
      stream += '0 -10 Td\n';
    } else if (isHeader) {
      stream += `0 -18 Td\n/F1 11 Tf\n(${escapePdf(line)}) Tj\n`;
    } else {
      stream += `0 -14 Td\n/F2 10 Tf\n(${escapePdf(line)}) Tj\n`;
    }
  }
  stream += '\nET';

  const streamBytes = Buffer.from(stream, 'utf-8');

  const obj1 = '1 0 obj\n<< /Title (St Mary\'s Term 1 Calendar 2026) /Author (St Mary\'s School) /Subject (Term 1 Calendar) >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj6 = '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj7 = `7 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj\n`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  const allObjs = [obj1, obj2, obj3, obj4, obj5, obj6, obj7];
  for (let i = 0; i < allObjs.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += allObjs[i];
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf-8');
  pdf += 'xref\n';
  pdf += `0 ${allObjs.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const off of offsets) {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + (allObjs.length + 1) + ' /Root 2 0 R /Info 1 0 R >>\n';
  pdf += 'startxref\n' + xrefStart + '\n%%EOF\n';

  const targetPath = path.join(dir, 'st-marys-term1-calendar-2026.pdf');
  fs.writeFileSync(targetPath, pdf);
  console.log('Term 1 Calendar PDF created at', targetPath, 'Size:', fs.statSync(targetPath).size, 'bytes');
}

createTerm1CalendarPdf();
