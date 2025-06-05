import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const createParagraphsFromText = (text: string): Paragraph[] => {
  return text.split("\n\n").map((block) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: block.replace(/\n/g, " "),
          font: "Georgia",
          size: 28, // 14pt
          color: "000000",
        }),
      ],
      spacing: {
        after: 240, // spacing between paragraphs
      },
      alignment: AlignmentType.JUSTIFIED,
    });
  });
};

export const generateCoverLetterDocx = async (content: string) => {
  const paragraphs = createParagraphsFromText(content);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Cover_Letter.docx");
  toast.success("Cover letter download successfully!");
};
