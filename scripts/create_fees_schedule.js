const fs = require('fs');
const path = require('path');

function createFeesSchedulePdf() {
  const dir = path.join(__dirname, '..', 'public', 'docs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function escapePdf(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  let stream = 'BT\n/F1 16 Tf\n50 780 Td\n(ST MARY\'S CATHOLIC PRIMARY SCHOOL) Tj\n';
  stream += '0 -22 Td\n/F1 12 Tf\n(OFFICIAL SCHOOL FEES SCHEDULE - 2026 ACADEMIC YEAR) Tj\n';
  stream += '0 -18 Td\n/F2 10 Tf\n(Motto: Forever Onward | Plot 1040 Lenganeng, Tlokweng, Botswana) Tj\n';
  stream += '0 -20 Td\n/F1 10 Tf\n(-------------------------------------------------------------------------------------------------) Tj\n';

  const textBody = [
    ['1.0 ADMISSION & REGISTRATION CHARGES', true],
    ['Registration Fee (New Students - Non Refundable): P 500.00 (One-time)', false],
    ['Assessment & Application Processing: Included in Registration', false],
    ['', false],
    ['2.0 TUITION FEES (PER TERM - 3 TERMS PER YEAR)', true],
    ['Standard 1 - Standard 7: P 3,500.00 per Term (P 10,500.00 per Annum)', false],
    ['Pre-School (Reception & Pre-Primary): P 2,800.00 per Term (P 8,400.00 per Annum)', false],
    ['', false],
    ['3.0 PAYMENT SCHEDULE & DUE DATES', true],
    ['Term 1 Tuition: Due upon registration or before 13th January 2026', false],
    ['Term 2 Tuition: Due on or before 12th May 2026', false],
    ['Term 3 Tuition: Due on or before 8th September 2026', false],
    ['Flexible monthly installment arrangements are available on consultation with the Bursar.', false],
    ['', false],
    ['4.0 BANKING DETAILS FOR DIRECT TRANSFERS', true],
    ['Bank Name: First National Bank Botswana (FNBB)', false],
    ['Account Name: St Mary\'s Catholic Primary School', false],
    ['Branch: Riverwalk / Gaborone | Branch Code: 282267', false],
    ['Reference: [Student Full Name & Class]', false],
    ['Please submit proof of payment to: admin@stmarysschool.co.bw or WhatsApp +267 75 979 591.', false],
    ['', false],
    ['5.0 BURSAR\'S OFFICE CONTACT', true],
    ['Office Hours: Mon - Thu 7:30 AM - 3:30 PM | Fri 7:30 AM - 12:30 PM', false],
    ['Telephone: +267 392 8788 | Email: bursar@stmarysschool.co.bw', false]
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

  const obj1 = '1 0 obj\n<< /Title (St Mary\'s Catholic Primary School Fees Schedule 2026) /Author (St Mary\'s Bursar Office) /Subject (Official Fees Schedule) >>\nendobj\n';
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

  const targetPath = path.join(dir, 'st-marys-fees-schedule-2026.pdf');
  fs.writeFileSync(targetPath, pdf);
  console.log('Fees Schedule PDF created at', targetPath, 'Size:', fs.statSync(targetPath).size, 'bytes');
}

createFeesSchedulePdf();
