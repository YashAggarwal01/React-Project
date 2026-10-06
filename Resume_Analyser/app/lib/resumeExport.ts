// Libraries are imported dynamically so they only load in the browser (app uses SSR)

const fileName = (resume: TailoredResume, ext: string) =>
  `${(resume.name || "Tailored").trim().replace(/\s+/g, "_")}_Resume.${ext}`;

const triggerDownload = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export async function downloadTailoredPdf(resume: TailoredResume) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const write = (
    text: string,
    { size = 10, bold = false, indent = 0, gap = 4 } = {}
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, pageWidth - indent);
    for (const line of lines) {
      if (y + size > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y);
      y += size * 1.3;
    }
    y += gap;
  };

  const heading = (title: string) => {
    y += 6;
    write(title.toUpperCase(), { size: 12, bold: true, gap: 0 });
    doc.setLineWidth(0.5);
    doc.line(margin, y - 8, margin + pageWidth, y - 8);
    y += 4;
  };

  write(resume.name, { size: 20, bold: true, gap: 0 });
  if (resume.contact?.length) write(resume.contact.join("  |  "), { size: 9 });

  if (resume.summary) {
    heading("Summary");
    write(resume.summary);
  }

  if (resume.skills?.length) {
    heading("Skills");
    write(resume.skills.join(", "));
  }

  if (resume.experience?.length) {
    heading("Experience");
    resume.experience.forEach((exp) => {
      write(`${exp.role} - ${exp.company}`, { size: 11, bold: true, gap: 0 });
      if (exp.duration) write(exp.duration, { size: 9, gap: 2 });
      exp.bullets?.forEach((b) => write(`•  ${b}`, { indent: 10, gap: 1 }));
      y += 4;
    });
  }

  if (resume.projects?.length) {
    heading("Projects");
    resume.projects.forEach((project) => {
      write(project.name, { size: 11, bold: true, gap: 0 });
      project.bullets?.forEach((b) => write(`•  ${b}`, { indent: 10, gap: 1 }));
      y += 4;
    });
  }

  if (resume.education?.length) {
    heading("Education");
    resume.education.forEach((edu) => {
      write(`${edu.degree} - ${edu.institution}`, { size: 11, bold: true, gap: 0 });
      if (edu.duration) write(edu.duration, { size: 9 });
    });
  }

  doc.save(fileName(resume, "pdf"));
}

export async function downloadTailoredDocx(resume: TailoredResume) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import(
    "docx"
  );

  const heading = (title: string) =>
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: { bottom: { style: "single", size: 6, color: "999999", space: 1 } },
    });

  const bullet = (text: string) =>
    new Paragraph({ text, bullet: { level: 0 } });

  const titleLine = (title: string, sub?: string) =>
    new Paragraph({
      spacing: { before: 120 },
      children: [
        new TextRun({ text: title, bold: true }),
        ...(sub ? [new TextRun({ text: `\t${sub}`, italics: true })] : []),
      ],
    });

  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: resume.name, bold: true })],
    }),
  ];
  if (resume.contact?.length)
    children.push(new Paragraph({ text: resume.contact.join("  |  ") }));

  if (resume.summary) {
    children.push(heading("Summary"), new Paragraph({ text: resume.summary }));
  }

  if (resume.skills?.length) {
    children.push(heading("Skills"), new Paragraph({ text: resume.skills.join(", ") }));
  }

  if (resume.experience?.length) {
    children.push(heading("Experience"));
    resume.experience.forEach((exp) => {
      children.push(titleLine(`${exp.role} - ${exp.company}`, exp.duration));
      exp.bullets?.forEach((b) => children.push(bullet(b)));
    });
  }

  if (resume.projects?.length) {
    children.push(heading("Projects"));
    resume.projects.forEach((project) => {
      children.push(titleLine(project.name));
      project.bullets?.forEach((b) => children.push(bullet(b)));
    });
  }

  if (resume.education?.length) {
    children.push(heading("Education"));
    resume.education.forEach((edu) =>
      children.push(titleLine(`${edu.degree} - ${edu.institution}`, edu.duration))
    );
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, fileName(resume, "docx"));
}
