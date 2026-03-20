import puppeteer from "puppeteer";

export const generatePDF = async (resume: any): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Fallback values
    const fullName = resume?.basics?.fullName || "Untitled";
    const email = resume?.basics?.email || "";
    const phone = resume?.basics?.phone || "";
    const location = resume?.basics?.location || "";
    const linkedin = resume?.basics?.linkedin || "";
    const github = resume?.basics?.github || "";
    const primaryColor = resume?.metadata?.theme?.primaryColor || "#000000";

    const getWorkHTML = () => {
      if (!resume?.sections?.work?.length) return "";
      return resume.sections.work
        .map(
          (w: any) => `
        <div class="mb-8">
          <div class="flex justify-between items-baseline mb-2">
            <h4 class="font-black text-xl text-gray-800">${w.position || "Position"}</h4>
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded border border-gray-100">${w.startDate || ""} — ${w.endDate || "Present"}</span>
          </div>
          <p class="font-bold uppercase tracking-widest text-[10px] mb-3" style="color: ${primaryColor}">${w.company || ""}</p>
          ${
            w.highlights?.length
              ? `
            <ul class="space-y-2 mt-2">
              ${w.highlights
                .map(
                  (h: string) => `
                <li class="text-gray-600 text-[11px] font-medium flex items-start leading-relaxed">
                  <span class="mr-2 mt-1.5 min-w-[4px] h-[4px] rounded-full" style="background-color: ${primaryColor}"></span>
                  <span>${h}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `,
        )
        .join("");
    };

    const getSkillsHTML = () => {
      if (!resume?.sections?.skills?.length) return "";
      return resume.sections.skills
        .map(
          (s: any) => `
        <span class="px-2.5 py-1 bg-gray-50 text-gray-800 text-[9px] font-black uppercase tracking-widest rounded border border-gray-100">
          ${s.name}
        </span>
      `,
        )
        .join("");
    };

    const getEducationHTML = () => {
      if (!resume?.sections?.education?.length) return "";
      return resume.sections.education
        .map(
          (e: any) => `
        <div class="mb-6 space-y-1">
           <h4 class="font-black text-sm text-gray-800 uppercase leading-tight">${e.studyType || ""} ${e.area ? "in " + e.area : ""}</h4>
           <p class="text-[9px] font-bold uppercase tracking-widest" style="color: ${primaryColor}">${e.institution || ""}</p>
           <p class="text-[8px] text-gray-400 font-black uppercase tracking-widest">${e.startDate || ""} — ${e.endDate || ""}</p>
        </div>
      `,
        )
        .join("");
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'sans-serif'],
                }
              }
            }
          }
        </script>
        <style>
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; box-sizing: border-box; }
        </style>
      </head>
      <body>
        <div class="page px-[15mm] py-[15mm]">
          <!-- Header -->
          <div class="border-b-[6px] pb-8 mb-12" style="border-color: ${primaryColor}">
            <h1 class="text-5xl font-black uppercase tracking-tighter text-gray-900 mb-6 leading-none">${fullName}</h1>
            <div class="flex flex-wrap gap-x-5 gap-y-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest items-center">
              ${location ? `<span>${location}</span><span>•</span>` : ""}
              <span>${email}</span>
              ${phone ? `<span>•</span><span>${phone}</span>` : ""}
              ${resume?.basics?.website ? `<span>•</span><span>${resume.basics.website}</span>` : ""}
              ${linkedin ? `<span>•</span><span>LI: ${linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>` : ""}
              ${github ? `<span>•</span><span>GH: ${github.replace(/https?:\/\/(www\.)?github\.com\//, "")}</span>` : ""}
            </div>
          </div>
          
          <!-- Summary -->
          ${
            resume?.basics?.summary
              ? `
            <div class="mb-12">
              <p class="text-[12px] leading-relaxed text-gray-600 font-medium">${resume.basics.summary}</p>
            </div>
          `
              : ""
          }

          <div class="grid grid-cols-12 gap-12">
            <!-- Left Column: Experience -->
            <div class="col-span-8">
              ${
                resume?.sections?.work?.length
                  ? `
                <div class="mb-12">
                  <div class="flex items-center gap-3 mb-8">
                    <h3 class="text-[11px] font-black uppercase tracking-[0.4em]" style="color: ${primaryColor}">Experience</h3>
                    <div class="flex-1 h-[1px] bg-gray-100"></div>
                  </div>
                  <div>${getWorkHTML()}</div>
                </div>
              `
                  : ""
              }
            </div>

            <!-- Right Column: Skills & Education -->
            <div class="col-span-4 space-y-12">
              ${
                resume?.sections?.skills?.length
                  ? `
                <div>
                  <div class="flex items-center gap-3 mb-8">
                    <h3 class="text-[11px] font-black uppercase tracking-[0.3em]" style="color: ${primaryColor}">Skills</h3>
                    <div class="flex-1 h-[1px] bg-gray-100"></div>
                  </div>
                  <div class="flex flex-wrap gap-2 text-gray-800">
                    ${getSkillsHTML()}
                  </div>
                </div>
              `
                  : ""
              }

              ${
                resume?.sections?.education?.length
                  ? `
                <div>
                  <div class="flex items-center gap-3 mb-8">
                    <h3 class="text-[11px] font-black uppercase tracking-[0.3em]" style="color: ${primaryColor}">Education</h3>
                    <div class="flex-1 h-[1px] bg-gray-100"></div>
                  </div>
                  <div class="space-y-4">
                    ${getEducationHTML()}
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Increased timeout for Tailwind CDN to compile the classes
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Give an extra 500ms guaranteed for the font to load and tailwind scripts
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
