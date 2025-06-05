import { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import { georgiaVfs } from "./georgiaVfs"; // <-- your generated vfs

const georgiaVfs = {
  "Georgia.ttf": "AAEAAAALAIAAAwAwT1MvMg8S...", // real base64 string
  "Georgia-Bold.ttf": "AAEAAAALAIAAAwAwT1MvMg8S...",
  "Georgia-Italic.ttf": "AAEAAAALAIAAAwAwT1MvMg8S...",
  "Georgia-BoldItalic.ttf": "AAEAAAALAIAAAwAwT1MvMg8S..."
};

pdfMake.vfs = { ...pdfFonts.vfs, ...georgiaVfs };
pdfMake.fonts = {
  Georgia: {
    normal: "Georgia.ttf",
    bold: "Georgia-Bold.ttf",
    italics: "Georgia-Italic.ttf",
    bolditalics: "Georgia-BoldItalic.ttf",
  },
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

export const generateResumePdf = (formData: any) => {
  const styles = {
    headerName: {
      fontSize: 21,
      bold: true,
      alignment: "center",
      margin: [0, 0, 0, 10],
      color: "black",
    },
    title: {
      fontSize: 14,
      alignment: "center",
      margin: [0, 0, 0, 10],
      color: "black",
    },
    contact: {
      fontSize: 11,
      alignment: "center",
      margin: [0, 0, 0, 15],
      color: "black",
    },
    sectionTitle: {
      fontSize: 16,
      bold: true,
      margin: [0, 15, 0, 7],
      color: "black",
    },
    normalText: {
      fontSize: 12,
      margin: [0, 0, 0, 8],
      color: "black",
    },
    italicText: {
      fontSize: 12,
      italics: true,
      margin: [0, 0, 0, 4],
      color: "black",
    },
    bullet: {
      fontSize: 12,
      margin: [0, 0, 0, 4],
      color: "black",
    },
    alignedRow: {
      fontSize: 12,
      bold: true,
      color: "black",
      margin: [0, 8, 0, 4],
    },
  };

  const createAlignedRow = (left: string, right: string): Content => {
    return {
      columns: [
        { text: left, style: "alignedRow", width: "*" },
        { text: right, style: "alignedRow", width: "auto", alignment: "right" },
      ],
    };
  };

  const createTwoColumnBullets = (items: string[]): Content => {
    const body: TableCell[][] = [];

    for (let i = 0; i < items.length; i += 2) {
      const row: TableCell[] = [
        { text: `• ${items[i]}`, style: "bullet", border: [false, false, false, false] },
        {
          text: items[i + 1] ? `• ${items[i + 1]}` : "",
          style: "bullet",
          border: [false, false, false, false],
        },
      ];
      body.push(row);
    }

    return {
      table: {
        widths: ["50%", "50%"],
        body,
      },
      layout: "noBorders",
      margin: [0, 0, 0, 10],
    };
  };

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: (formData.personalInfo.name || "").toUpperCase(), style: "headerName" },
      { text: formData.title || "", style: "title" },
      {
        text: `${formData.personalInfo.phone} • ${formData.personalInfo.location} • ${formData.personalInfo.email}`,
        style: "contact",
      },
      formData.personalInfo.linkedin || formData.personalInfo.website
        ? {
            text:
              [formData.personalInfo.linkedin, formData.personalInfo.website]
                .filter(Boolean)
                .join(" • "),
            style: "contact",
          }
        : "",

      { text: "Professional Summary", style: "sectionTitle" },
      { text: formData.summary || "", style: "normalText" },

      { text: "Experience", style: "sectionTitle" },
      ...formData.workExperience.flatMap((exp: any) => {
        const start = formatDate(exp.startDate);
        const end = exp.isCurrent ? "Present" : formatDate(exp.endDate);
        return [
          createAlignedRow(exp.position, `${start} - ${end}`),
          { text: `${exp.companyName} - ${exp.location}`, style: "italicText" },
          exp.description
            ? { text: exp.description, style: "normalText" }
            : { text: "", margin: [0, 0, 0, 10] },
        ];
      }),

      { text: "Education", style: "sectionTitle" },
      ...formData.education.flatMap((edu: any) => {
        const start = formatDate(edu.startDate);
        const end = edu.isCurrent ? "Present" : formatDate(edu.endDate);
        return [
          createAlignedRow(edu.degree, `${start} - ${end}`),
          { text: `${edu.institution} - ${edu.location}`, style: "italicText" },
          edu.gpa
            ? { text: `GPA: ${edu.gpa}`, style: "normalText" }
            : { text: "", margin: [0, 0, 0, 10] },
        ];
      }),

      { text: "Skills", style: "sectionTitle" },
      createTwoColumnBullets(formData.skills || []),

      ...(formData.certifications?.length > 0
        ? [
            { text: "Certifications", style: "sectionTitle" },
            createTwoColumnBullets(
              formData.certifications.map((cert: any) => cert.name)
            ),
          ]
        : []),
    ],
    defaultStyle: {
      font: "Georgia",
    },
    pageMargins: [40, 50, 40, 60],
  };

  pdfMake.createPdf(docDefinition).download("resume.pdf");
};
