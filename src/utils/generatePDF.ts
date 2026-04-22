import { jsPDF } from "jspdf";
import { getAgreementSections, AgreementData } from "./agreementTemplates";

export function generateAgreementPDF(
  data: AgreementData,
  signature: string,
  signatureType: "drawn" | "typed",
  signedAt: number,
  code: string
): string {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = MARGIN + 5;

  const checkPage = (needed = 8) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN + 5;
    }
  };

  const writeLine = (
    text: string,
    opts: {
      size?: number;
      style?: "normal" | "bold" | "italic";
      indent?: number;
      align?: "left" | "center";
      color?: [number, number, number];
      gap?: number;
    } = {}
  ) => {
    const { size = 10, style = "normal", indent = 0, align = "left", color = [40, 40, 40], gap = 1 } = opts;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, CONTENT_W - indent);
    const lineH = size * 0.45;
    for (const line of lines) {
      checkPage(lineH + gap + 1);
      if (align === "center") {
        doc.text(line, PAGE_W / 2, y, { align: "center" });
      } else {
        doc.text(line, MARGIN + indent, y);
      }
      y += lineH + gap;
    }
  };

  const sections = getAgreementSections(data);

  for (const section of sections) {
    if (section.type === "header") {
      y += 4;
      writeLine("N RETROSPEC", { size: 14, style: "bold", align: "center", color: [20, 20, 20] });
      y += 1;
      writeLine(section.title ?? "", { size: 11, style: "bold", align: "center", color: [50, 50, 50] });
      y += 4;
      doc.setDrawColor(180, 180, 180);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 7;
    } else if (section.type === "intro") {
      writeLine(section.body ?? "", { size: 9, style: "italic", color: [90, 90, 90] });
      y += 4;
    } else if (section.type === "section") {
      checkPage(14);
      if (section.title) {
        writeLine(section.title, { size: 10, style: "bold", color: [20, 20, 20], gap: 2 });
      }
      if (section.body) {
        writeLine(section.body, { size: 9, color: [60, 60, 60] });
      }
      if (section.bullets) {
        for (const b of section.bullets) {
          writeLine(`\u2022  ${b}`, { size: 9, color: [60, 60, 60], indent: 4 });
        }
      }
      if (section.note) {
        writeLine(`Note: ${section.note}`, { size: 8, style: "italic", color: [130, 130, 130], indent: 4 });
      }
      y += 3;
    }
  }

  // Signature block
  y += 5;
  checkPage(50);
  doc.setDrawColor(180, 180, 180);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;

  writeLine("SIGNATURE", { size: 10, style: "bold", color: [20, 20, 20], gap: 3 });
  y += 2;

  if (signatureType === "drawn" && signature.startsWith("data:image")) {
    try {
      doc.addImage(signature, "PNG", MARGIN, y, 80, 24);
      y += 28;
    } catch {
      writeLine("[Signature on file — drawn]", { size: 10, color: [60, 60, 60] });
    }
  } else if (signature) {
    doc.setFont("courier", "italic");
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    checkPage(14);
    doc.text(signature, MARGIN, y);
    y += 14;
  }

  y += 3;
  const signedDate = new Date(signedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  writeLine(`Client: ${data.clientName}`, { size: 9, color: [80, 80, 80], gap: 2 });
  writeLine(`Date Signed: ${signedDate}`, { size: 9, color: [80, 80, 80], gap: 2 });
  writeLine(`Agreement Code: ${code}`, { size: 9, color: [80, 80, 80], gap: 2 });

  // Return base64 content only (strip data URI prefix for email attachment)
  return doc.output("datauristring").split(",")[1];
}

export function downloadAgreementPDF(
  data: AgreementData,
  signature: string,
  signatureType: "drawn" | "typed",
  signedAt: number,
  code: string
): string {
  const base64 = generateAgreementPDF(data, signature, signatureType, signedAt, code);

  const blob = new Blob(
    [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
    { type: "application/pdf" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agreement-${code}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);

  return base64;
}
