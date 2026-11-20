const PDFDocument = require('pdfkit');
const {
  Profile, Education, Experience, Organization, Skill, Project, Certificate,
} = require('../models');
const { SKILL_CATEGORIES } = require('../config/constants');
const { period, splitLines } = require('../utils/helpers');

const order = [['sortOrder', 'ASC'], ['id', 'ASC']];

async function loadCv() {
  const profile = (await Profile.findOne()) || (await Profile.create({}));
  const [education, experience, organizations, skills, projects, certificates] = await Promise.all([
    Education.findAll({ order }), Experience.findAll({ order }), Organization.findAll({ order }),
    Skill.findAll({ order }), Project.findAll({ order }), Certificate.findAll({ order }),
  ]);
  const skillGroups = SKILL_CATEGORIES
    .map((category) => ({ category, items: skills.filter((s) => s.category === category).map((s) => s.name) }))
    .filter((g) => g.items.length);
  return { profile, education, experience, organizations, projects, certificates, skillGroups };
}

const contactLine = (p) => [p.location, p.email, p.phone, p.linkedin, p.github].filter(Boolean).join('  |  ');

// Pratinjau CV (HTML, format Harvard)
exports.preview = async (req, res, next) => {
  try {
    const data = await loadCv();
    res.render('cv', { title: `CV — ${data.profile.fullName}`, ...data, contact: contactLine(data.profile), period, splitLines });
  } catch (e) { next(e); }
};

// Unduh CV sebagai PDF (format Harvard, ATS-friendly: teks asli, font standar, satu kolom)
exports.download = async (req, res, next) => {
  try {
    const d = await loadCv();
    const p = d.profile;
    const safeName = (p.fullName || 'CV').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'CV';

    const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 48, left: 54, right: 54 }, info: { Title: `CV - ${p.fullName}`, Author: p.fullName } });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV_${safeName}.pdf"`);
    doc.pipe(res);

    const L = doc.page.margins.left;
    const W = doc.page.width - L - doc.page.margins.right;
    const ensure = (h) => { if (doc.y + h > doc.page.height - doc.page.margins.bottom) doc.addPage(); };

    const heading = (text) => {
      ensure(60);
      doc.moveDown(0.7);
      doc.font('Times-Bold').fontSize(11).fillColor('#000').text(text.toUpperCase(), L, doc.y, { width: W });
      const y = doc.y + 1;
      doc.moveTo(L, y).lineTo(L + W, y).lineWidth(0.7).strokeColor('#000').stroke();
      doc.y = y + 5;
    };

    const row = (left, right, leftFont = 'Times-Bold') => {
      ensure(30);
      const y = doc.y;
      doc.font(leftFont).fontSize(10.5).text(left || '', L, y, { width: W - 110 });
      const afterLeft = doc.y;
      doc.font('Times-Roman').fontSize(10.5).text(right || '', L, y, { width: W, align: 'right' });
      doc.x = L;
      doc.y = Math.max(afterLeft, doc.y);
    };

    const sub = (left, right) => {
      const y = doc.y;
      doc.font('Times-Italic').fontSize(10.5).text(left || '', L, y, { width: W - 110 });
      const afterLeft = doc.y;
      if (right) doc.font('Times-Italic').fontSize(10.5).text(right, L, y, { width: W, align: 'right' });
      doc.x = L;
      doc.y = Math.max(afterLeft, doc.y);
    };

    const bullets = (lines) => {
      lines.forEach((line) => {
        ensure(16);
        doc.font('Times-Roman').fontSize(10.5);
        doc.text('•', L + 8, doc.y, { continued: false, lineBreak: false });
        const y = doc.y;
        doc.text(line, L + 20, y, { width: W - 20, align: 'left' });
        doc.x = L;
      });
    };

    // Header
    doc.font('Times-Bold').fontSize(20).text((p.fullName || '').toUpperCase(), L, doc.y, { width: W, align: 'center' });
    doc.font('Times-Roman').fontSize(10).text(contactLine(p), L, doc.y + 2, { width: W, align: 'center' });

    if (p.summary) {
      heading('Summary');
      doc.font('Times-Roman').fontSize(10.5).text(p.summary, L, doc.y, { width: W, align: 'justify' });
    }

    if (d.education.length) {
      heading('Education');
      d.education.forEach((e) => {
        row(e.institution, period(e.startYear, e.endYear));
        sub(e.program, e.gpa ? `GPA: ${e.gpa}` : '');
        bullets(splitLines(e.achievements));
        doc.moveDown(0.4);
      });
    }

    if (d.experience.length) {
      heading('Experience');
      d.experience.forEach((e) => {
        row(e.company, period(e.startDate, e.endDate));
        sub(e.position);
        bullets([...splitLines(e.description), ...splitLines(e.achievements)]);
        doc.moveDown(0.4);
      });
    }

    if (d.organizations.length) {
      heading('Leadership & Organizations');
      d.organizations.forEach((o) => {
        row(o.name, period(o.startDate, o.endDate));
        sub(o.position);
        bullets([...splitLines(o.description), ...splitLines(o.achievements)]);
        doc.moveDown(0.4);
      });
    }

    if (d.projects.length) {
      heading('Projects');
      d.projects.forEach((pr) => {
        row(pr.title, pr.year ? String(pr.year) : '');
        if (pr.technologies) sub(pr.technologies);
        bullets(splitLines(pr.description));
        doc.moveDown(0.4);
      });
    }

    if (d.certificates.length) {
      heading('Certifications');
      d.certificates.forEach((c) => {
        row(c.title, c.issueDate || '');
        sub(c.issuer);
        doc.moveDown(0.2);
      });
    }

    if (d.skillGroups.length) {
      heading('Skills');
      d.skillGroups.forEach((g) => {
        ensure(16);
        doc.font('Times-Bold').fontSize(10.5).text(`${g.category}: `, L, doc.y, { continued: true, width: W });
        doc.font('Times-Roman').text(g.items.join(', '));
      });
    }

    doc.end();
  } catch (e) { next(e); }
};
