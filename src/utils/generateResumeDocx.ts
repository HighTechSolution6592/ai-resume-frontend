import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
  // TableCellBorders,
} from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

// Format date strings
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

// Section header paragraph with larger font
const sectionHeader = (text: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: "000000",
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 600, after: 300 },
    thematicBreak: true,
  });

// Aligned position and date line
const createAlignedRow = (left: string, right: string) =>
  new Paragraph({
    children: [
      new TextRun({ text: left, bold: true, color: "000000" }),
      new TextRun({ text: `\t${right}`, color: "000000" }),
    ],
    spacing: { after: 100, line: 300 },
    tabStops: [{ type: "right", position: 9090 }],
  });

// Table helper for skills/certs (2 items per row, no border)
const createTwoColumnBullets = (items: string[]) => {
  const rows: TableRow[] = [];

  for (let i = 0; i < items.length; i += 2) {
    const first = items[i];
    const second = items[i + 1];

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: `• ${first}`, color: "000000" })],
                spacing: { after: 100 },
              }),
            ],
            borders: noBorders,
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          second
            ? new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `• ${second}`, color: "000000" }),
                    ],
                    spacing: { after: 100 },
                  }),
                ],
                borders: noBorders,
                width: { size: 50, type: WidthType.PERCENTAGE },
              })
            : new TableCell({
                children: [],
                borders: noBorders,
                width: { size: 50, type: WidthType.PERCENTAGE },
              }),
        ],
      })
    );
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [4500, 4500],
  });
};

const noBorders: import("docx").ITableCellBorders = {
  top: { style: "none", size: 0, color: "FFFFFF" },
  bottom: { style: "none", size: 0, color: "FFFFFF" },
  left: { style: "none", size: 0, color: "FFFFFF" },
  right: { style: "none", size: 0, color: "FFFFFF" },
};

export const generateResumeDocx = (formData: any) => {
  const name = new Paragraph({
    children: [
      new TextRun({
        text: formData.personalInfo.name?.toUpperCase() || "",
        bold: true,
        size: 42,
        color: "000000",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120, line: 300 },
  });

  const title = new Paragraph({
    text: formData.title,
    alignment: AlignmentType.CENTER,
    spacing: { after: 100, line: 300 },
  });

  const contactLine1 = new Paragraph({
    text: `${formData.personalInfo.phone} • ${formData.personalInfo.location} • ${formData.personalInfo.email}`,
    alignment: AlignmentType.CENTER,
    spacing: { after: 40, line: 300 },
  });

  const contactLine2 =
    (formData.personalInfo.linkedin || formData.personalInfo.website) &&
    new Paragraph({
      text: [formData.personalInfo.linkedin, formData.personalInfo.website]
        .filter(Boolean)
        .join(" • "),
      alignment: AlignmentType.CENTER,
      spacing: { after: 300, line: 300 },
    });

  const summary = [
    sectionHeader("Professional Summary"),
    new Paragraph({
      text: formData.summary || "",
      spacing: { after: 300, line: 300 },
      alignment: AlignmentType.JUSTIFIED,
    }),
  ];

  const experienceSection = [
    sectionHeader("Experience"),
    ...formData.workExperience.map((exp: any) => {
      const start = formatDate(exp.startDate);
      const end = exp.isCurrent ? "Present" : formatDate(exp.endDate);
      return [
        createAlignedRow(exp.position, `${start} - ${end}`),
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.companyName} - ${exp.location}`,
              italics: true,
              color: "000000",
            }),
          ],
          spacing: { after: 80, line: 300 },
        }),
        exp.description
          ? new Paragraph({
              text: exp.description,
              spacing: { after: 300, line: 300 },
            })
          : new Paragraph({ text: "", spacing: { after: 300, line: 300 } }),
      ];
    }).flat(),
  ];

  const educationSection = [
    sectionHeader("Education"),
    ...formData.education.map((edu: any) => {
      const start = formatDate(edu.startDate);
      const end = edu.isCurrent ? "Present" : formatDate(edu.endDate);
      return [
        createAlignedRow(edu.degree, `${start} - ${end}`),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution} - ${edu.location}`,
              italics: true,
              color: "000000",
            }),
          ],
          spacing: { after: 80, line: 300 },
        }),
        edu.gpa
          ? new Paragraph({
              text: `GPA: ${edu.gpa}`,
              spacing: { after: 300, line: 300 },
            })
          : new Paragraph({ text: "", spacing: { after: 300, line: 300 } }),
      ];
    }).flat(),
  ];

  const skillsSection = [
    sectionHeader("Skills"),
    createTwoColumnBullets(formData.skills || []),
  ];

  const certificationSection =
    formData.certifications?.length > 0
      ? [
          sectionHeader("Certifications"),
          createTwoColumnBullets(
            formData.certifications.map((cert: any) => cert.name)
          ),
        ]
      : [];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Georgia",
            size: 28, // 14pt
            color: "000000",
          },
        },
      },
    },
    sections: [
      {
        children: [
          name,
          title,
          contactLine1,
          ...(contactLine2 ? [contactLine2] : []),
          ...summary,
          ...experienceSection,
          ...educationSection,
          ...skillsSection,
          ...certificationSection,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "resume.docx");
  });

  toast.success("Resume downloaded successfully!");
};
