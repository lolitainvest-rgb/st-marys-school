const fs = require('fs');
const path = require('path');

function createProspectusPdf() {
  const dir = path.join(__dirname, '..', 'public', 'docs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  function escapePdf(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  let stream = 'BT\n/F1 16 Tf\n50 780 Td\n(ST MARY\'S CATHOLIC PRIMARY SCHOOL) Tj\n';
  stream += '0 -22 Td\n/F1 12 Tf\n(OFFICIAL SCHOOL PROSPECTUS - 2026) Tj\n';
  stream += '0 -18 Td\n/F2 11 Tf\n(Motto: Forever Onward) Tj\n';
  stream += '0 -20 Td\n/F1 10 Tf\n(-------------------------------------------------------------------------------------------------) Tj\n';

  const textBody = [
    ['1.0 OUR SCHOOL & INTRODUCTION', true],
    ['St Mary\'s is a Catholic English Medium Primary School established in 1996 by Mrs Louise Mmusi.', false],
    ['The rationale behind establishing the school was to offer parents affordable quality primary education', false],
    ['in a conducive and safe environment. The school embraces Catholic and general Christian values and ethos.', false],
    ['In January 2026, the school directors converted the school into a Catholic School in collaboration with', false],
    ['the Catholic Diocese of Francistown to instil high morals and Christian character.', false],
    ['', false],
    ['2.0 MOTTO: Forever Onward', true],
    ['The motto of the school is "Forever Onward". The school remains resolute in ensuring continuous improvement', false],
    ['in curriculum delivery, academic performance, and co-curricular development.', false],
    ['', false],
    ['3.0 OUR MISSION', true],
    ['St Mary\'s Catholic Primary School strives to deliver quality and affordable primary school education', false],
    ['in a safe and conducive environment for the academic, physical, moral, spiritual and emotional', false],
    ['development of our children.', false],
    ['', false],
    ['4.0 OUR VISION', true],
    ['To Provide Affordable, Quality and Nurturing Education centred on Christ\'s Teachings.', false],
    ['', false],
    ['5.0 CORE VALUES & BOTHO', true],
    ['Botho is our foundational principle of African humane character and mutual respect:', false],
    ['  i)   Love and Compassion             vi)   Justice and Honesty', false],
    ['  ii)  Faith and Hope                  vii)  Resilience', false],
    ['  iii) Respect and Personal Dignity    viii) Diligence', false],
    ['  iv)  Responsibility                  ix)   Love for learning', false],
    ['  v)   Kindness                        x)    Creativity', false],
    ['', false],
    ['6.0 ADMISSIONS & CONTACT', true],
    ['Plot 1040 Lenganeng, Tlokweng, Botswana | Tel: +267 392 8788 / +267 75 979 591', false],
    ['Email: admin@stmarysschool.co.bw | Website: https://stmarysschool.co.bw', false]
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

  const obj1 = '1 0 obj\n<< /Title (St Mary\'s Catholic Primary School Prospectus) /Author (St Mary\'s Primary School) /Subject (Official Prospectus 2026) >>\nendobj\n';
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

  const targetPath = path.join(dir, 'st-marys-prospectus-2026.pdf');
  fs.writeFileSync(targetPath, pdf);
  console.log('Prospectus created at', targetPath, 'Size:', fs.statSync(targetPath).size, 'bytes');
}

createProspectusPdf();
