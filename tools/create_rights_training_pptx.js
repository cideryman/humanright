const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const ASSET_DIR = path.join(ROOT, "assets", "cards");
const OUT_DIR = path.join(ROOT, "output");
const PREVIEW_DIR = path.join(OUT_DIR, "rights_training_preview");
const PPTX_PATH = path.join(OUT_DIR, "성인_발달장애인_인권교육_예습복습_진행자료.pptx");
const MONTAGE_PATH = path.join(OUT_DIR, "성인_발달장애인_인권교육_예습복습_진행자료_preview_montage.png");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(PREVIEW_DIR, { recursive: true });

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex";
pptx.subject = "성인 발달장애인 인권교육 예습·복습 진행자료";
pptx.title = "나의 인권 이해하기";
pptx.company = "주간보호 이용자 인권교육";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "RIGHTS_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "RIGHTS_WIDE";

const C = {
  ink: "17211F",
  muted: "52615E",
  paper: "FFFDF7",
  line: "D6DDD8",
  choice: "0F766E",
  choiceSoft: "DFF5EF",
  safe: "16833A",
  safeSoft: "E4F7DD",
  danger: "C43828",
  dangerSoft: "FFE4DF",
  help: "285EA8",
  helpSoft: "E4EDFF",
  respect: "8A5A16",
  respectSoft: "F6EAD7",
  white: "FFFFFF",
};

const slidesForPreview = [];

function img(name) {
  return path.join(ASSET_DIR, `${name}.jpg`);
}

function existsImage(name) {
  return fs.existsSync(img(name));
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function addBackground(slide) {
  slide.background = { color: C.paper };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.paper },
    line: { color: C.paper, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 3.6,
    h: 7.5,
    fill: { color: C.choiceSoft, transparency: 24 },
    line: { color: C.choiceSoft, transparency: 100 },
  });
}

function addFooter(slide, label) {
  slide.addText(label, {
    x: 0.58,
    y: 7.08,
    w: 8.8,
    h: 0.22,
    fontFace: "Malgun Gothic",
    fontSize: 8,
    bold: true,
    color: C.muted,
    margin: 0,
    breakLine: false,
  });
}

function addHeader(slide, keyword, section = "") {
  slide.addText(section || "주간보호 이용자 인권교육", {
    x: 0.58,
    y: 0.35,
    w: 5.4,
    h: 0.25,
    fontFace: "Malgun Gothic",
    fontSize: 10,
    bold: true,
    color: C.muted,
    margin: 0,
    breakLine: false,
  });
  if (keyword) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.45,
      y: 0.28,
      w: 2.3,
      h: 0.58,
      rectRadius: 0.08,
      fill: { color: C.white, transparency: 6 },
      line: { color: C.line, width: 1.2 },
    });
    slide.addText("오늘의 말", {
      x: 10.68,
      y: 0.4,
      w: 0.9,
      h: 0.16,
      fontFace: "Malgun Gothic",
      fontSize: 7.5,
      bold: true,
      color: C.muted,
      margin: 0,
      breakLine: false,
    });
    slide.addText(keyword, {
      x: 11.45,
      y: 0.35,
      w: 1.05,
      h: 0.28,
      fontFace: "Malgun Gothic",
      fontSize: 15,
      bold: true,
      color: C.ink,
      align: "right",
      margin: 0,
      breakLine: false,
    });
  }
}

function addTitle(slide, title, subtitle, keyword, section) {
  addHeader(slide, keyword, section);
  slide.addText(title, {
    x: 0.58,
    y: 0.92,
    w: 8.9,
    h: 0.72,
    fontFace: "Malgun Gothic",
    fontSize: 29,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
    breakLine: false,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.62,
      y: 1.66,
      w: 8.3,
      h: 0.42,
      fontFace: "Malgun Gothic",
      fontSize: 15,
      bold: true,
      color: C.muted,
      margin: 0,
      fit: "shrink",
    });
  }
}

function addChip(slide, text, x, y, color = C.choice, soft = C.choiceSoft, w = 1.55) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.48,
    rectRadius: 0.08,
    fill: { color: soft },
    line: { color, width: 1.5 },
  });
  slide.addText(text, {
    x: x + 0.08,
    y: y + 0.12,
    w: w - 0.16,
    h: 0.18,
    fontFace: "Malgun Gothic",
    fontSize: 11,
    bold: true,
    color,
    align: "center",
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
}

function addButton(slide, text, x, y, w, h, opts = {}) {
  const color = opts.color || C.choice;
  const fill = opts.fill || C.choiceSoft;
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color, width: 2 },
  });
  slide.addText(text, {
    x: x + 0.1,
    y: y + h / 2 - 0.12,
    w: w - 0.2,
    h: 0.24,
    fontFace: "Malgun Gothic",
    fontSize: opts.fontSize || 14,
    bold: true,
    color,
    align: "center",
    valign: "mid",
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
}

function addImageCard(slide, key, title, x, y, w, h, opts = {}) {
  const border = opts.border || C.line;
  const fill = opts.fill || C.white;
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: border, width: 1.6 },
  });
  if (existsImage(key)) {
    const imageW = Math.min(w - 0.28, opts.imageW || w - 0.45);
    const imageH = Math.min(h - 0.72, opts.imageH || h - 0.84);
    const ix = x + (w - imageW) / 2;
    const iy = y + 0.16;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: ix,
      y: iy,
      w: imageW,
      h: imageH,
      rectRadius: 0.04,
      fill: { color: C.white },
      line: { color: C.ink, width: 1.2 },
    });
    slide.addImage({
      path: img(key),
      x: ix + 0.03,
      y: iy + 0.03,
      w: imageW - 0.06,
      h: imageH - 0.06,
      sizing: { type: "contain", x: ix + 0.03, y: iy + 0.03, w: imageW - 0.06, h: imageH - 0.06 },
    });
  }
  slide.addText(title, {
    x: x + 0.12,
    y: y + h - 0.45,
    w: w - 0.24,
    h: 0.26,
    fontFace: "Malgun Gothic",
    fontSize: opts.fontSize || 16,
    bold: true,
    color: opts.textColor || C.ink,
    align: "center",
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
}

function addStatement(slide, text, x, y, w, h, color = C.ink, size = 24) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: "Malgun Gothic",
    fontSize: size,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
}

function addBulletList(slide, items, x, y, w, h, opts = {}) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({ text: `${idx + 1}. ${item}`, options: { breakLine: idx < items.length - 1 } });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: "Malgun Gothic",
    fontSize: opts.fontSize || 15,
    bold: true,
    color: opts.color || C.ink,
    margin: 0.05,
    fit: "shrink",
    breakLine: true,
  });
}

function addProcessRow(slide, items, x, y, w, h) {
  const gap = 0.18;
  const cardW = (w - gap * (items.length - 1)) / items.length;
  items.forEach((item, idx) => {
    const cx = x + idx * (cardW + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: cx,
      y,
      w: cardW,
      h,
      rectRadius: 0.06,
      fill: { color: item.fill || C.white },
      line: { color: item.color || C.line, width: 1.5 },
    });
    slide.addText(item.time || "", {
      x: cx + 0.16,
      y: y + 0.16,
      w: cardW - 0.32,
      h: 0.2,
      fontFace: "Malgun Gothic",
      fontSize: 9,
      bold: true,
      color: item.color || C.muted,
      margin: 0,
      breakLine: false,
    });
    slide.addText(item.title, {
      x: cx + 0.16,
      y: y + 0.45,
      w: cardW - 0.32,
      h: 0.38,
      fontFace: "Malgun Gothic",
      fontSize: 14,
      bold: true,
      color: C.ink,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(item.detail, {
      x: cx + 0.16,
      y: y + 0.95,
      w: cardW - 0.32,
      h: h - 1.08,
      fontFace: "Malgun Gothic",
      fontSize: 10.5,
      bold: true,
      color: C.muted,
      margin: 0,
      fit: "shrink",
    });
  });
}

function addSupportTable(slide, rows, x, y, w, h) {
  const rowH = h / rows.length;
  rows.forEach((row, idx) => {
    const top = y + idx * rowH;
    const fill = idx % 2 === 0 ? C.white : "F7FBF8";
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: top,
      w,
      h: rowH - 0.06,
      rectRadius: 0.04,
      fill: { color: fill },
      line: { color: C.line, width: 1 },
    });
    addChip(slide, row.label, x + 0.14, top + 0.13, row.color, row.soft, 1.35);
    slide.addText(row.action, {
      x: x + 1.72,
      y: top + 0.13,
      w: 4.25,
      h: rowH - 0.3,
      fontFace: "Malgun Gothic",
      fontSize: 12,
      bold: true,
      color: C.ink,
      margin: 0,
      fit: "shrink",
    });
    slide.addText(row.check, {
      x: x + 6.1,
      y: top + 0.13,
      w: w - 6.25,
      h: rowH - 0.3,
      fontFace: "Malgun Gothic",
      fontSize: 12,
      bold: true,
      color: C.muted,
      margin: 0,
      fit: "shrink",
    });
  });
}

function createSlide(title, subtitle, keyword, section, preview = {}) {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTitle(slide, title, subtitle, keyword, section);
  addFooter(slide, "성인 발달장애인 인권교육 예습·복습 진행자료");
  slidesForPreview.push({ title, subtitle, keyword, section, ...preview });
  return slide;
}

function createCover() {
  const slide = pptx.addSlide();
  addBackground(slide);
  slide.addText("성인 발달장애인 인권교육", {
    x: 0.72,
    y: 0.72,
    w: 5.2,
    h: 0.28,
    fontFace: "Malgun Gothic",
    fontSize: 13,
    bold: true,
    color: C.choice,
    margin: 0,
    breakLine: false,
  });
  slide.addText("나의 인권\n이해하기", {
    x: 0.72,
    y: 1.35,
    w: 5.3,
    h: 1.85,
    fontFace: "Malgun Gothic",
    fontSize: 44,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addText("예습·복습 진행자료\n주간보호 이용자 인권교육 담당자 진행용", {
    x: 0.76,
    y: 3.55,
    w: 5.6,
    h: 0.78,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.muted,
    margin: 0,
    fit: "shrink",
  });
  addButton(slide, "선택", 0.78, 5.2, 1.25, 0.58, { color: C.choice, fill: C.choiceSoft });
  addButton(slide, "존중", 2.18, 5.2, 1.25, 0.58, { color: C.respect, fill: C.respectSoft });
  addButton(slide, "안전", 3.58, 5.2, 1.25, 0.58, { color: C.safe, fill: C.safeSoft });
  addButton(slide, "도움", 4.98, 5.2, 1.25, 0.58, { color: C.help, fill: C.helpSoft });
  addImageCard(slide, "choiceMeal", "내가 골라요", 7.0, 0.78, 2.65, 2.55, { border: C.choice, fill: C.choiceSoft });
  addImageCard(slide, "safe", "안전", 9.85, 1.15, 2.4, 2.3, { border: C.safe, fill: C.safeSoft });
  addImageCard(slide, "help", "도움", 7.35, 3.7, 2.4, 2.3, { border: C.help, fill: C.helpSoft });
  addImageCard(slide, "respect", "존중", 10.0, 4.0, 2.25, 2.15, { border: C.respect, fill: C.respectSoft });
  addFooter(slide, "강사 본교육 2026.05.20 전후 예습·복습용");
  slidesForPreview.push({
    title: "나의 인권 이해하기",
    subtitle: "예습·복습 진행자료",
    keyword: "선택",
    kind: "cover",
    images: ["choiceMeal", "safe", "help", "respect"],
  });
}

function createSection(number, title, keyword, imageKey, phrases) {
  const slide = pptx.addSlide();
  addBackground(slide);
  slide.addText(`${number}회기`, {
    x: 0.7,
    y: 0.72,
    w: 1.3,
    h: 0.34,
    fontFace: "Malgun Gothic",
    fontSize: 16,
    bold: true,
    color: C.choice,
    margin: 0,
    breakLine: false,
  });
  slide.addText(title, {
    x: 0.7,
    y: 1.28,
    w: 6.2,
    h: 0.95,
    fontFace: "Malgun Gothic",
    fontSize: 36,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  addButton(slide, keyword, 0.74, 2.48, 1.75, 0.62, {
    color: keyword === "도움" ? C.help : keyword === "존중" ? C.respect : C.choice,
    fill: keyword === "도움" ? C.helpSoft : keyword === "존중" ? C.respectSoft : C.choiceSoft,
    fontSize: 16,
  });
  slide.addText(phrases.join("\n"), {
    x: 0.75,
    y: 3.45,
    w: 5.7,
    h: 1.48,
    fontFace: "Malgun Gothic",
    fontSize: 20,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  addImageCard(slide, imageKey, keyword, 7.45, 1.1, 3.9, 3.72, {
    border: keyword === "존중" ? C.respect : keyword === "도움" ? C.help : C.choice,
    fill: keyword === "존중" ? C.respectSoft : keyword === "도움" ? C.helpSoft : C.choiceSoft,
    fontSize: 22,
  });
  addFooter(slide, "한 번에 한 가지 단어만 크게 보여 주세요.");
  slidesForPreview.push({
    title: `${number}회기. ${title}`,
    subtitle: phrases.join(" / "),
    keyword,
    images: [imageKey],
    kind: "section",
  });
}

function slidePrinciples() {
  const slide = createSlide(
    "자료의 방향",
    "짧은 문장, 반복 단어, 카드 선택, 역할극 중심으로 진행합니다.",
    "참여",
    "진행 원칙",
    { images: ["choiceMeal", "help", "respect"] },
  );
  addStatement(slide, "정답보다\n표현을 먼저 봅니다", 0.72, 2.45, 3.7, 1.05, C.choice, 28);
  addBulletList(
    slide,
    [
      "말, 손짓, 표정, 카드 선택, 고개 끄덕임을 모두 인정",
      "위험 사례는 자세히 묘사하지 않고 안전한 대처 문장으로 마무리",
      "10~15분마다 보기, 고르기, 붙이기, 말하기 활동을 바꾸기",
    ],
    0.78,
    4.0,
    5.2,
    1.55,
    { fontSize: 14 },
  );
  addImageCard(slide, "choiceMeal", "고르기", 6.72, 2.25, 1.8, 2.0, { border: C.choice, fill: C.choiceSoft, fontSize: 13 });
  addImageCard(slide, "help", "도움 요청", 8.7, 2.25, 1.8, 2.0, { border: C.help, fill: C.helpSoft, fontSize: 13 });
  addImageCard(slide, "respect", "존중", 10.68, 2.25, 1.8, 2.0, { border: C.respect, fill: C.respectSoft, fontSize: 13 });
  addButton(slide, "선택", 6.9, 5.05, 1.12, 0.52);
  addButton(slide, "존중", 8.55, 5.05, 1.12, 0.52, { color: C.respect, fill: C.respectSoft });
  addButton(slide, "안전", 10.2, 5.05, 1.12, 0.52, { color: C.safe, fill: C.safeSoft });
  addButton(slide, "도움", 11.85, 5.05, 1.12, 0.52, { color: C.help, fill: C.helpSoft });
}

function slideMap() {
  const slide = createSlide("전체 흐름", "본교육 전 예습 2회기, 본교육 후 복습 1회기", "흐름", "운영 계획", {
    images: ["food", "safe", "shield"],
  });
  addProcessRow(
    slide,
    [
      { time: "1회기", title: "인권과 선택", detail: "나는 소중해요\n내가 고를 수 있어요", color: C.choice, fill: C.choiceSoft },
      { time: "2회기", title: "존중과 안전", detail: "내 몸과 마음\n안전·위험 구분", color: C.safe, fill: C.safeSoft },
      { time: "본교육", title: "강사 본교육", detail: "2026.05.20\n핵심 내용 경험", color: C.respect, fill: C.respectSoft },
      { time: "3회기", title: "표현과 실천", detail: "싫어요·안 돼요\n도와주세요", color: C.help, fill: C.helpSoft },
    ],
    0.75,
    2.32,
    11.8,
    2.5,
  );
  addStatement(slide, "반복 문장", 0.82, 5.55, 1.5, 0.3, C.muted, 16);
  addButton(slide, "내가 골라도 돼요", 2.25, 5.38, 2.2, 0.6);
  addButton(slide, "위험하면 알려요", 4.75, 5.38, 2.2, 0.6, { color: C.safe, fill: C.safeSoft });
  addButton(slide, "도와주세요", 7.25, 5.38, 1.95, 0.6, { color: C.help, fill: C.helpSoft });
  addButton(slide, "나도 너도 존중", 9.5, 5.38, 2.2, 0.6, { color: C.respect, fill: C.respectSoft });
}

function slideSession1Words() {
  const slide = createSlide("오늘의 말", "나 / 소중해요 / 선택 / 좋아요 / 싫어요", "선택", "1회기", {
    images: ["food", "clothes", "seat", "activity"],
  });
  addStatement(slide, "나는\n소중해요", 0.78, 2.35, 3.2, 1.15, C.ink, 34);
  addButton(slide, "내가 골라요", 0.82, 4.0, 2.05, 0.62, { fontSize: 17 });
  addButton(slide, "싫어요", 3.12, 4.0, 1.45, 0.62, { color: C.danger, fill: C.dangerSoft, fontSize: 17 });
  addImageCard(slide, "food", "음식", 6.25, 2.05, 1.62, 1.75);
  addImageCard(slide, "clothes", "옷", 8.05, 2.05, 1.62, 1.75);
  addImageCard(slide, "seat", "자리", 9.85, 2.05, 1.62, 1.75);
  addImageCard(slide, "activity", "활동", 7.15, 4.25, 1.62, 1.75);
  addImageCard(slide, "completeCheck", "표현했어요", 9.0, 4.25, 1.62, 1.75, { border: C.safe, fill: C.safeSoft });
}

function slideSession1Flow() {
  const slide = createSlide("1회기 진행 흐름", "45~50분 권장", "선택", "1회기", { images: ["choiceMeal"] });
  addProcessRow(
    slide,
    [
      { time: "5분", title: "인사와 오늘 단어", detail: "오늘은 나와 선택을 배워요", color: C.choice, fill: C.choiceSoft },
      { time: "10분", title: "나는 소중해요", detail: "이름 부르기\n좋은 점 카드 고르기", color: C.respect, fill: C.respectSoft },
      { time: "15분", title: "선택 카드", detail: "음식·옷·활동·자리 중 선택", color: C.choice, fill: C.white },
      { time: "10분", title: "선택 이유", detail: "좋아요 / 편해요 / 하고 싶어요", color: C.help, fill: C.helpSoft },
      { time: "10분", title: "마무리", detail: "내가 골라도 돼요", color: C.safe, fill: C.safeSoft },
    ],
    0.72,
    2.28,
    11.9,
    2.78,
  );
  slide.addText("확인 포인트: 스스로 고르는지, 말·표정·카드 선택으로 표현하는지 봅니다.", {
    x: 0.82,
    y: 5.78,
    w: 10.7,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function slideChoiceActivity() {
  const slide = createSlide("선택 카드 활동", "음식, 옷, 자리, 활동 중 하나를 고릅니다.", "선택", "1회기", {
    images: ["bibimbap", "jeans", "sofa", "drawing"],
  });
  addImageCard(slide, "bibimbap", "음식", 0.78, 2.35, 2.1, 2.15, { border: C.choice, fill: C.choiceSoft });
  addImageCard(slide, "jeans", "옷", 3.08, 2.35, 2.1, 2.15, { border: C.choice, fill: C.white });
  addImageCard(slide, "sofa", "자리", 5.38, 2.35, 2.1, 2.15, { border: C.choice, fill: C.white });
  addImageCard(slide, "drawing", "활동", 7.68, 2.35, 2.1, 2.15, { border: C.choice, fill: C.white });
  addButton(slide, "내가 골랐어요", 10.2, 2.5, 1.95, 0.68, { fontSize: 16 });
  addButton(slide, "표현했어요", 10.2, 3.45, 1.95, 0.68, { color: C.help, fill: C.helpSoft, fontSize: 16 });
  slide.addText("진행자 멘트\n“오늘은 맞히는 시간이 아니에요.\n내가 고르는 시간이에요.”", {
    x: 0.86,
    y: 5.33,
    w: 10.6,
    h: 0.9,
    fontFace: "Malgun Gothic",
    fontSize: 19,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function slideSession1Support() {
  const slide = createSlide("이용자별 지원 포인트", "반응 방식이 달라도 모두 의사표현으로 인정합니다.", "선택", "1회기", {
    images: ["completeCheck"],
  });
  addSupportTable(
    slide,
    [
      { label: "언어 소통", action: "선택 이유를 질문하고 일상 사례로 연결", check: "스스로 말함", color: C.choice, soft: C.choiceSoft },
      { label: "시각 자료", action: "그림 카드 2개 중 고르게 하고 핵심 단어 반복", check: "손가락·시선 선택", color: C.help, soft: C.helpSoft },
      { label: "감각·보조", action: "큰 카드, 영상 단서, 옆자리 지원 활용", check: "카드 잡기·끄덕임", color: C.respect, soft: C.respectSoft },
    ],
    0.78,
    2.35,
    11.6,
    3.2,
  );
  addButton(slide, "말", 1.0, 6.0, 0.9, 0.46);
  addButton(slide, "손짓", 2.08, 6.0, 1.0, 0.46);
  addButton(slide, "표정", 3.28, 6.0, 1.0, 0.46);
  addButton(slide, "카드 선택", 4.48, 6.0, 1.35, 0.46);
  addButton(slide, "고개 끄덕임", 6.04, 6.0, 1.55, 0.46);
}

function slideSession2Words() {
  const slide = createSlide("오늘의 말", "존중 / 내 몸 / 안전 / 위험 / 도움", "안전", "2회기", {
    images: ["safe", "danger", "help"],
  });
  addStatement(slide, "내 몸은\n소중해요", 0.78, 2.35, 3.1, 1.18, C.ink, 33);
  addButton(slide, "나도 소중해요", 0.82, 4.05, 2.08, 0.58, { color: C.respect, fill: C.respectSoft });
  addButton(slide, "다른 사람도 소중해요", 3.12, 4.05, 2.62, 0.58, { color: C.respect, fill: C.respectSoft });
  addImageCard(slide, "safe", "안전", 6.3, 2.25, 2.0, 2.05, { border: C.safe, fill: C.safeSoft });
  addImageCard(slide, "danger", "위험", 8.55, 2.25, 2.0, 2.05, { border: C.danger, fill: C.dangerSoft });
  addImageCard(slide, "help", "도움", 10.8, 2.25, 2.0, 2.05, { border: C.help, fill: C.helpSoft });
  slide.addText("위험하거나 불편하면 혼자 참지 않습니다.", {
    x: 6.35,
    y: 5.15,
    w: 5.2,
    h: 0.35,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function slideSession2Flow() {
  const slide = createSlide("2회기 진행 흐름", "존중과 안전을 카드로 구분합니다.", "안전", "2회기", {
    images: ["friendTeasing", "lostStreet"],
  });
  addProcessRow(
    slide,
    [
      { time: "5분", title: "선택 복습", detail: "선택 카드를 보고 하나 고르기", color: C.choice, fill: C.choiceSoft },
      { time: "10분", title: "존중 알기", detail: "내 물건·몸·마음은 허락이 필요", color: C.respect, fill: C.respectSoft },
      { time: "15분", title: "안전·위험 분류", detail: "상황 카드를 빨강·초록에 놓기", color: C.safe, fill: C.safeSoft },
      { time: "10분", title: "도움 요청", detail: "도와주세요 말하기·카드 들기", color: C.help, fill: C.helpSoft },
      { time: "10분", title: "마무리", detail: "내 몸은 소중해요", color: C.safe, fill: C.white },
    ],
    0.72,
    2.28,
    11.9,
    2.78,
  );
  slide.addText("확인 포인트: 위험 신호 구분, 도움 요청 행동 가능 여부", {
    x: 0.82,
    y: 5.78,
    w: 10.7,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
}

function slideSafeDanger() {
  const slide = createSlide("안전·위험 분류", "상황 카드를 보고 초록 또는 빨강으로 나눕니다.", "안전", "2회기", {
    images: ["ansAskPermission", "ansUseNoAsk", "lostStreet", "strangerCaution"],
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.78,
    y: 2.25,
    w: 5.5,
    h: 3.35,
    rectRadius: 0.08,
    fill: { color: C.safeSoft },
    line: { color: C.safe, width: 2 },
  });
  slide.addText("초록 바구니\n안전한 선택", {
    x: 1.05,
    y: 2.55,
    w: 1.65,
    h: 0.78,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.safe,
    margin: 0,
    fit: "shrink",
  });
  addImageCard(slide, "ansAskPermission", "먼저 물어봐요", 3.0, 2.55, 1.4, 1.45, { border: C.safe, fill: C.white, fontSize: 10 });
  addImageCard(slide, "ansTellTeacher", "선생님께 말해요", 4.6, 3.7, 1.4, 1.45, { border: C.safe, fill: C.white, fontSize: 10 });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.75,
    y: 2.25,
    w: 5.5,
    h: 3.35,
    rectRadius: 0.08,
    fill: { color: C.dangerSoft },
    line: { color: C.danger, width: 2 },
  });
  slide.addText("빨강 바구니\n위험한 선택", {
    x: 7.02,
    y: 2.55,
    w: 1.65,
    h: 0.78,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.danger,
    margin: 0,
    fit: "shrink",
  });
  addImageCard(slide, "ansUseNoAsk", "묻지 않고 쓴다", 8.95, 2.55, 1.4, 1.45, { border: C.danger, fill: C.white, fontSize: 10 });
  addImageCard(slide, "ansFollowStranger", "따라가요", 10.55, 3.7, 1.4, 1.45, { border: C.danger, fill: C.white, fontSize: 10 });
}

function slideHelpPractice() {
  const slide = createSlide("도움 요청 연습", "말하기, 카드 들기, 선생님 찾기를 모두 연습합니다.", "도움", "2회기", {
    images: ["lostStreet", "help"],
  });
  addImageCard(slide, "lostStreet", "길을 잃었어요", 0.85, 2.15, 3.1, 2.95, { border: C.help, fill: C.helpSoft, fontSize: 17 });
  addStatement(slide, "도와주세요", 4.45, 2.3, 3.2, 0.72, C.help, 34);
  addButton(slide, "도움 카드 들기", 4.5, 3.35, 2.25, 0.65, { color: C.help, fill: C.helpSoft, fontSize: 16 });
  addButton(slide, "선생님 찾기", 4.5, 4.25, 2.25, 0.65, { color: C.help, fill: C.white, fontSize: 16 });
  addImageCard(slide, "help", "도움 벨", 8.25, 2.38, 2.55, 2.45, { border: C.help, fill: C.helpSoft, fontSize: 18 });
  slide.addText("핵심: 요청 행동이 나오면 즉시 칭찬하고 안전한 사람에게 연결합니다.", {
    x: 0.88,
    y: 5.85,
    w: 10.8,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 16,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function slideSession2Support() {
  const slide = createSlide("이용자별 지원 포인트", "안전·위험은 색, 그림, 행동으로 확인합니다.", "안전", "2회기", {
    images: ["safe", "danger"],
  });
  addSupportTable(
    slide,
    [
      { label: "언어 소통", action: "왜 안전한지, 왜 위험한지 한 가지 말하기", check: "상황 판단", color: C.choice, soft: C.choiceSoft },
      { label: "시각 자료", action: "안전/위험 색 카드와 그림 카드로 분류", check: "색 또는 그림 선택", color: C.safe, soft: C.safeSoft },
      { label: "감각·보조", action: "도움 카드 들기, 선생님 손짓하기, 짧은 영상 단서", check: "비언어 요청", color: C.help, soft: C.helpSoft },
    ],
    0.78,
    2.35,
    11.6,
    3.2,
  );
  addButton(slide, "내 몸은 소중해요", 1.0, 6.0, 2.2, 0.46, { color: C.respect, fill: C.respectSoft });
  addButton(slide, "위험하면 도움을 요청해요", 3.55, 6.0, 3.05, 0.46, { color: C.help, fill: C.helpSoft });
}

function slideSession3Words() {
  const slide = createSlide("오늘의 말", "권리 / 싫어요 / 안 돼요 / 도와주세요 / 책임", "도움", "3회기", {
    images: ["shield", "bodyTouch", "personalItem"],
  });
  addStatement(slide, "연습할 말은\n세 가지입니다", 0.78, 2.3, 4.2, 1.15, C.ink, 33);
  addButton(slide, "싫어요", 0.85, 4.15, 1.55, 0.62, { color: C.danger, fill: C.dangerSoft, fontSize: 17 });
  addButton(slide, "안 돼요", 2.68, 4.15, 1.55, 0.62, { color: C.danger, fill: C.dangerSoft, fontSize: 17 });
  addButton(slide, "도와주세요", 4.5, 4.15, 1.85, 0.62, { color: C.help, fill: C.helpSoft, fontSize: 17 });
  addImageCard(slide, "personalItem", "내 물건", 7.0, 2.05, 1.8, 1.9, { border: C.choice, fill: C.white });
  addImageCard(slide, "bodyTouch", "내 몸", 9.0, 2.05, 1.8, 1.9, { border: C.danger, fill: C.dangerSoft });
  addImageCard(slide, "photoTaking", "내 사진", 11.0, 2.05, 1.8, 1.9, { border: C.help, fill: C.helpSoft });
}

function slideSession3Flow() {
  const slide = createSlide("3회기 진행 흐름", "본교육 내용을 쉬운 말과 역할극으로 다시 확인합니다.", "권리", "3회기", {
    images: ["shield"],
  });
  addProcessRow(
    slide,
    [
      { time: "5분", title: "본교육 떠올리기", detail: "선택·안전·도움 카드 고르기", color: C.choice, fill: C.choiceSoft },
      { time: "10분", title: "OX 복습", detail: "맞으면 O, 아니면 X 카드 들기", color: C.safe, fill: C.safeSoft },
      { time: "15분", title: "나의 권리 카드", detail: "싫은 것·도움받고 싶은 것 표시", color: C.respect, fill: C.respectSoft },
      { time: "15분", title: "역할극", detail: "싫어요·안 돼요·도와주세요", color: C.help, fill: C.helpSoft },
      { time: "5분", title: "마무리 약속", detail: "나도 존중, 다른 사람도 존중", color: C.respect, fill: C.white },
    ],
    0.72,
    2.28,
    11.9,
    2.78,
  );
  slide.addText("확인 포인트: 거부·요청 표현이 나오는지, 다른 사람의 거부도 존중하는지 봅니다.", {
    x: 0.82,
    y: 5.78,
    w: 11.2,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 16,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
}

function slideOxReview() {
  const slide = createSlide("OX 복습", "쉬운 상황을 듣고 O 또는 X 카드를 듭니다.", "권리", "3회기", {
    images: ["completeCheck"],
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 1.1,
    y: 2.15,
    w: 2.2,
    h: 2.2,
    fill: { color: C.safeSoft },
    line: { color: C.safe, width: 2 },
  });
  slide.addText("O", {
    x: 1.1,
    y: 2.45,
    w: 2.2,
    h: 1.2,
    fontFace: "Malgun Gothic",
    fontSize: 58,
    bold: true,
    color: C.safe,
    align: "center",
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.0,
    y: 2.15,
    w: 2.2,
    h: 2.2,
    fill: { color: C.dangerSoft },
    line: { color: C.danger, width: 2 },
  });
  slide.addText("X", {
    x: 4.0,
    y: 2.45,
    w: 2.2,
    h: 1.2,
    fontFace: "Malgun Gothic",
    fontSize: 58,
    bold: true,
    color: C.danger,
    align: "center",
    margin: 0,
  });
  addBulletList(
    slide,
    [
      "친구 물건을 쓰고 싶으면 먼저 물어봐요.",
      "싫어도 혼자 참아야 해요.",
      "위험하면 도와주세요라고 알려요.",
      "친구가 싫다고 하면 멈춰요.",
    ],
    7.1,
    2.15,
    4.7,
    2.4,
    { fontSize: 16 },
  );
  slide.addText("오답이 나와도 괜찮아요. 바로 좋은 행동 문장으로 다시 연습합니다.", {
    x: 1.0,
    y: 5.55,
    w: 10.8,
    h: 0.45,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
}

function slideRightsCard() {
  const slide = createSlide("나의 권리 카드", "내가 싫은 것, 도움받고 싶은 것을 고릅니다.", "권리", "3회기", {
    images: ["completeCheck"],
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.95,
    y: 2.1,
    w: 5.1,
    h: 3.3,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.choice, width: 2 },
  });
  slide.addText("내가 싫은 것", {
    x: 1.25,
    y: 2.45,
    w: 2.2,
    h: 0.3,
    fontFace: "Malgun Gothic",
    fontSize: 18,
    bold: true,
    color: C.danger,
    margin: 0,
  });
  addButton(slide, "싫어요", 1.3, 3.1, 1.45, 0.56, { color: C.danger, fill: C.dangerSoft });
  addButton(slide, "하지 마세요", 3.05, 3.1, 1.8, 0.56, { color: C.danger, fill: C.white });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.55,
    y: 2.1,
    w: 5.1,
    h: 3.3,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.help, width: 2 },
  });
  slide.addText("도움받고 싶은 것", {
    x: 6.85,
    y: 2.45,
    w: 2.9,
    h: 0.3,
    fontFace: "Malgun Gothic",
    fontSize: 18,
    bold: true,
    color: C.help,
    margin: 0,
  });
  addButton(slide, "도와주세요", 6.9, 3.1, 1.8, 0.56, { color: C.help, fill: C.helpSoft });
  addButton(slide, "선생님께 말할래요", 8.95, 3.1, 2.25, 0.56, { color: C.help, fill: C.white, fontSize: 13 });
  slide.addText("그림, 단어, 스티커, 손짓으로 표시해도 됩니다.", {
    x: 1.05,
    y: 5.95,
    w: 10.1,
    h: 0.35,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
}

function slideRolePlay() {
  const slide = createSlide("역할극 연습", "상황을 보고 필요한 말을 고릅니다.", "도움", "3회기", {
    images: ["personalItem", "bodyTouch", "lostStreet", "ansStop"],
  });
  addImageCard(slide, "personalItem", "내 물건", 0.78, 2.15, 1.75, 1.92, { border: C.choice, fill: C.white, fontSize: 13 });
  addImageCard(slide, "bodyTouch", "내 몸", 2.72, 2.15, 1.75, 1.92, { border: C.danger, fill: C.dangerSoft, fontSize: 13 });
  addImageCard(slide, "lostStreet", "길을 잃었어요", 4.66, 2.15, 1.75, 1.92, { border: C.help, fill: C.helpSoft, fontSize: 12 });
  addImageCard(slide, "ansStop", "친구가 싫대요", 6.6, 2.15, 1.75, 1.92, { border: C.respect, fill: C.respectSoft, fontSize: 12 });
  addButton(slide, "안 돼요", 9.0, 2.25, 1.35, 0.58, { color: C.danger, fill: C.dangerSoft });
  addButton(slide, "싫어요", 10.55, 2.25, 1.35, 0.58, { color: C.danger, fill: C.white });
  addButton(slide, "도와주세요", 9.0, 3.12, 1.6, 0.58, { color: C.help, fill: C.helpSoft });
  addButton(slide, "멈출게요", 10.85, 3.12, 1.6, 0.58, { color: C.respect, fill: C.respectSoft });
  slide.addText("보조자의 지원: 문장을 따라 하거나, 카드만 들어도 즉시 칭찬합니다.", {
    x: 0.9,
    y: 5.45,
    w: 10.8,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
}

function slideResponsibility() {
  const slide = createSlide("권리와 책임", "내 권리를 지키는 것처럼 다른 사람의 권리도 지킵니다.", "존중", "3회기", {
    images: ["respect"],
  });
  addStatement(slide, "나도 존중\n다른 사람도 존중", 0.82, 2.25, 4.6, 1.3, C.ink, 32);
  addButton(slide, "내가 싫으면 말해요", 0.9, 4.1, 2.4, 0.58, { color: C.danger, fill: C.dangerSoft });
  addButton(slide, "친구가 싫다면 멈춰요", 3.65, 4.1, 2.55, 0.58, { color: C.respect, fill: C.respectSoft });
  addImageCard(slide, "respect", "함께 지켜요", 7.2, 2.15, 3.1, 2.95, { border: C.respect, fill: C.respectSoft, fontSize: 18 });
  addButton(slide, "마무리 약속", 7.5, 5.55, 2.5, 0.62, { color: C.choice, fill: C.choiceSoft, fontSize: 16 });
}

function slideCoreCards() {
  const slide = createSlide("인쇄용 카드 1", "핵심 단어", "카드", "부록", { images: ["choiceMeal", "respect", "safe", "help"] });
  const cards = [
    ["나", "나는 소중해요", C.choice, C.choiceSoft],
    ["선택", "내가 골라요", C.choice, C.choiceSoft],
    ["존중", "나도 너도 소중해요", C.respect, C.respectSoft],
    ["안전", "다치지 않아요", C.safe, C.safeSoft],
    ["위험", "멈춰요", C.danger, C.dangerSoft],
    ["도움", "도와주세요", C.help, C.helpSoft],
    ["거부", "싫어요", C.danger, C.white],
    ["책임", "다른 사람도 지켜요", C.respect, C.white],
  ];
  cards.forEach((card, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.72 + col * 3.05;
    const y = 2.15 + row * 1.65;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.65,
      h: 1.28,
      rectRadius: 0.06,
      fill: { color: card[3] },
      line: { color: card[2], width: 2 },
    });
    slide.addText(card[0], {
      x: x + 0.16,
      y: y + 0.18,
      w: 2.3,
      h: 0.32,
      fontFace: "Malgun Gothic",
      fontSize: 19,
      bold: true,
      color: card[2],
      margin: 0,
      align: "center",
      breakLine: false,
    });
    slide.addText(card[1], {
      x: x + 0.18,
      y: y + 0.66,
      w: 2.3,
      h: 0.28,
      fontFace: "Malgun Gothic",
      fontSize: 12.5,
      bold: true,
      color: C.ink,
      margin: 0,
      align: "center",
      fit: "shrink",
    });
  });
}

function slideSituationCards() {
  const slide = createSlide("인쇄용 카드 2", "상황 카드", "카드", "부록", {
    images: ["food", "clothes", "seat", "activity", "ansAskPermission", "help"],
  });
  const cards = [
    ["food", "음식", "내가 먹을 것을 골라요"],
    ["clothes", "옷", "내가 입을 것을 골라요"],
    ["seat", "자리", "앉을 자리를 골라요"],
    ["activity", "활동", "하고 싶은 활동을 골라요"],
    ["ansAskPermission", "허락", "먼저 물어봐요"],
    ["help", "도움", "도와주세요"],
  ];
  cards.forEach((card, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    addImageCard(slide, card[0], `${card[1]}\n${card[2]}`, 0.82 + col * 3.95, 2.02 + row * 2.25, 3.35, 1.9, {
      border: i >= 4 ? C.help : C.choice,
      fill: i >= 4 ? C.helpSoft : C.white,
      fontSize: 12,
    });
  });
}

function slideCopingCards() {
  const slide = createSlide("인쇄용 카드 3", "대처 문장", "도움", "부록", {
    images: ["ansNoPhoto", "ansAskHelp", "ansDontFollow"],
  });
  const phrases = [
    ["싫어요", "그만해 주세요", C.danger, C.dangerSoft],
    ["안 돼요", "하지 마세요", C.danger, C.white],
    ["도움", "선생님, 도와주세요", C.help, C.helpSoft],
    ["말하기", "불편해요", C.help, C.white],
    ["전화", "112 / 119", C.safe, C.safeSoft],
    ["피하기", "안전한 곳으로 가요", C.safe, C.white],
  ];
  phrases.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.85 + col * 3.9;
    const y = 2.1 + row * 1.8;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.25,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: item[3] },
      line: { color: item[2], width: 2 },
    });
    slide.addText(item[0], {
      x: x + 0.18,
      y: y + 0.2,
      w: 2.9,
      h: 0.28,
      fontFace: "Malgun Gothic",
      fontSize: 17,
      bold: true,
      color: item[2],
      align: "center",
      margin: 0,
    });
    slide.addText(item[1], {
      x: x + 0.18,
      y: y + 0.68,
      w: 2.9,
      h: 0.3,
      fontFace: "Malgun Gothic",
      fontSize: 14,
      bold: true,
      color: C.ink,
      align: "center",
      margin: 0,
      fit: "shrink",
    });
  });
}

function slideWorksheets() {
  const slide = createSlide("참여자용 쉬운 활동지", "빈칸은 말, 그림, 스티커로 채울 수 있습니다.", "활동지", "부록", {
    images: ["completeCheck"],
  });
  const sheets = [
    ["활동지 1", "오늘 내가 고른 것\n음식 / 옷 / 활동 / 자리"],
    ["활동지 2", "내 몸과 마음의 신호\n좋아요 / 싫어요 / 불편해요"],
    ["활동지 3", "도움 요청 연습\n선생님 / 가족 / 112 / 119"],
    ["활동지 4", "나의 권리 카드\n선택 / 안전 / 존중 / 도움"],
  ];
  sheets.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.9 + col * 5.85;
    const y = 2.0 + row * 2.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.25,
      h: 1.55,
      rectRadius: 0.06,
      fill: { color: C.white },
      line: { color: C.line, width: 1.4 },
    });
    slide.addText(item[0], {
      x: x + 0.22,
      y: y + 0.18,
      w: 1.2,
      h: 0.24,
      fontFace: "Malgun Gothic",
      fontSize: 13,
      bold: true,
      color: C.choice,
      margin: 0,
    });
    slide.addText(item[1], {
      x: x + 0.22,
      y: y + 0.58,
      w: 4.65,
      h: 0.58,
      fontFace: "Malgun Gothic",
      fontSize: 15,
      bold: true,
      color: C.ink,
      margin: 0,
      fit: "shrink",
    });
  });
}

function slideRoleplayAppendix() {
  const slide = createSlide("역할극 상황 예시", "상황을 짧게 보여주고 필요한 말을 연습합니다.", "연습", "부록", {
    images: ["personalItem", "bodyTouch", "lostStreet", "ansStop"],
  });
  const rows = [
    ["personalItem", "누군가 내 물건을 말없이 가져가려고 해요.", "안 돼요. 먼저 물어봐 주세요."],
    ["bodyTouch", "내 몸을 만지려고 해서 불편해요.", "싫어요. 하지 마세요."],
    ["lostStreet", "길을 잃거나 무서운 일이 생겼어요.", "도와주세요. 선생님을 불러 주세요."],
    ["ansStop", "친구가 싫다고 말했어요.", "알겠어. 멈출게."],
  ];
  rows.forEach((row, i) => {
    const y = 1.95 + i * 1.15;
    addButton(slide, `상황 ${i + 1}`, 0.86, y + 0.16, 0.92, 0.42, {
      color: i === 3 ? C.respect : i === 2 ? C.help : C.danger,
      fill: i === 3 ? C.respectSoft : i === 2 ? C.helpSoft : C.dangerSoft,
      fontSize: 10,
    });
    slide.addText(row[1], {
      x: 1.95,
      y: y + 0.1,
      w: 4.55,
      h: 0.35,
      fontFace: "Malgun Gothic",
      fontSize: 13.5,
      bold: true,
      color: C.ink,
      margin: 0,
      fit: "shrink",
    });
    addButton(slide, row[2], 6.95, y + 0.05, 4.4, 0.58, {
      color: i === 3 ? C.respect : i === 2 ? C.help : C.danger,
      fill: i === 3 ? C.respectSoft : i === 2 ? C.helpSoft : C.dangerSoft,
      fontSize: 12,
    });
  });
}

function slideClosing() {
  const slide = createSlide("마무리 문장", "수업 끝에서 함께 말하거나 카드를 짚습니다.", "존중", "마무리", {
    images: ["completeCheck", "respect"],
  });
  addStatement(slide, "나도 존중,\n다른 사람도 존중", 0.82, 2.15, 5.2, 1.25, C.ink, 34);
  addButton(slide, "싫어요", 0.95, 4.15, 1.35, 0.56, { color: C.danger, fill: C.dangerSoft });
  addButton(slide, "안 돼요", 2.58, 4.15, 1.35, 0.56, { color: C.danger, fill: C.white });
  addButton(slide, "도와주세요", 4.2, 4.15, 1.8, 0.56, { color: C.help, fill: C.helpSoft });
  addImageCard(slide, "completeCheck", "참 잘했어요", 7.2, 2.0, 2.3, 2.25, { border: C.safe, fill: C.safeSoft });
  addImageCard(slide, "respect", "함께 지켜요", 9.9, 2.0, 2.3, 2.25, { border: C.respect, fill: C.respectSoft });
  slide.addText("진행자는 참여 방식보다 표현이 나온 순간을 크게 강화합니다.", {
    x: 0.9,
    y: 5.78,
    w: 10.8,
    h: 0.42,
    fontFace: "Malgun Gothic",
    fontSize: 17,
    bold: true,
    color: C.ink,
    margin: 0,
  });
}

async function imageDataUri(key) {
  if (!existsImage(key)) return "";
  const data = await fs.promises.readFile(img(key));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

function svgText(text, x, y, size, color = `#${C.ink}`, weight = 800, maxChars = 28) {
  const lines = String(text).split("\n").flatMap((line) => {
    if (line.length <= maxChars) return [line];
    const chunks = [];
    let current = "";
    for (const word of line.split(" ")) {
      if ((current + word).length > maxChars) {
        chunks.push(current.trim());
        current = word;
      } else {
        current += ` ${word}`;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  });
  return lines
    .map((line, i) => `<text x="${x}" y="${y + i * size * 1.25}" font-family="Malgun Gothic, Arial" font-size="${size}" font-weight="${weight}" fill="${color}">${xmlEscape(line)}</text>`)
    .join("");
}

async function renderPreview(spec, index) {
  const imgs = await Promise.all((spec.images || []).slice(0, 4).map(imageDataUri));
  const chips = ["선택", "존중", "안전", "도움"];
  const svg = `
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#${C.paper}"/>
      <rect width="340" height="720" fill="#${C.choiceSoft}" opacity="0.55"/>
      ${svgText(spec.section || "주간보호 이용자 인권교육", 56, 54, 22, `#${C.muted}`)}
      <rect x="1000" y="38" width="205" height="58" rx="10" fill="#fff" stroke="#${C.line}" stroke-width="3"/>
      ${svgText("오늘의 말", 1020, 64, 16, `#${C.muted}`)}
      ${svgText(spec.keyword || "", 1110, 69, 26, `#${C.ink}`)}
      ${svgText(spec.title, 56, 150, spec.kind === "cover" ? 58 : 44, `#${C.ink}`, 900, 16)}
      ${spec.subtitle ? svgText(spec.subtitle, 60, spec.kind === "cover" ? 335 : 215, spec.kind === "cover" ? 29 : 25, `#${C.muted}`, 800, 24) : ""}
      ${chips
        .map((chip, i) => `<rect x="${62 + i * 118}" y="540" width="96" height="48" rx="8" fill="#${i === 1 ? C.respectSoft : i === 2 ? C.safeSoft : i === 3 ? C.helpSoft : C.choiceSoft}" stroke="#${i === 1 ? C.respect : i === 2 ? C.safe : i === 3 ? C.help : C.choice}" stroke-width="3"/><text x="${110 + i * 118}" y="571" text-anchor="middle" font-family="Malgun Gothic, Arial" font-size="21" font-weight="900" fill="#${i === 1 ? C.respect : i === 2 ? C.safe : i === 3 ? C.help : C.choice}">${chip}</text>`)
        .join("")}
      ${imgs
        .map((src, i) => {
          if (!src) return "";
          const x = 650 + (i % 2) * 230;
          const y = 170 + Math.floor(i / 2) * 220;
          return `<rect x="${x}" y="${y}" width="190" height="170" rx="12" fill="#fff" stroke="#${C.line}" stroke-width="4"/><image href="${src}" x="${x + 18}" y="${y + 15}" width="154" height="120" preserveAspectRatio="xMidYMid meet"/><rect x="${x + 18}" y="${y + 15}" width="154" height="120" rx="8" fill="none" stroke="#${C.ink}" stroke-width="3"/>`;
        })
        .join("")}
      <text x="56" y="686" font-family="Malgun Gothic, Arial" font-size="16" font-weight="800" fill="#${C.muted}">성인 발달장애인 인권교육 예습·복습 진행자료</text>
    </svg>
  `;
  const out = path.join(PREVIEW_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  return out;
}

async function renderMontage(previewPaths) {
  const thumbs = await Promise.all(
    previewPaths.map((file) =>
      sharp(file)
        .resize({ width: 320, height: 180, fit: "cover" })
        .extend({ top: 0, left: 0, right: 0, bottom: 28, background: "#FFFFFF" })
        .png()
        .toBuffer(),
    ),
  );
  const columns = 4;
  const rows = Math.ceil(thumbs.length / columns);
  const composites = thumbs.map((input, i) => ({
    input,
    left: (i % columns) * 330,
    top: Math.floor(i / columns) * 218,
  }));
  await sharp({
    create: {
      width: columns * 330,
      height: rows * 218,
      channels: 4,
      background: "#F7FBF8",
    },
  })
    .composite(composites)
    .png()
    .toFile(MONTAGE_PATH);
}

async function main() {
  createCover();
  slidePrinciples();
  slideMap();

  createSection(1, "예습 1: 인권과 선택", "선택", "choiceMeal", ["나는 소중한 사람입니다.", "소중한 사람은 고를 수 있어요."]);
  slideSession1Words();
  slideSession1Flow();
  slideChoiceActivity();
  slideSession1Support();

  createSection(2, "예습 2: 존중과 안전", "안전", "safe", ["나도 소중하고 다른 사람도 소중해요.", "위험하면 도움을 요청해요."]);
  slideSession2Words();
  slideSession2Flow();
  slideSafeDanger();
  slideHelpPractice();
  slideSession2Support();

  createSection(3, "복습: 표현과 실천", "도움", "shield", ["싫어요. 안 돼요. 도와주세요.", "내 권리와 다른 사람의 권리를 함께 지켜요."]);
  slideSession3Words();
  slideSession3Flow();
  slideOxReview();
  slideRightsCard();
  slideRolePlay();
  slideResponsibility();

  slideCoreCards();
  slideSituationCards();
  slideCopingCards();
  slideWorksheets();
  slideRoleplayAppendix();
  slideClosing();

  await pptx.writeFile({ fileName: PPTX_PATH });
  const previewPaths = [];
  for (let i = 0; i < slidesForPreview.length; i += 1) {
    previewPaths.push(await renderPreview(slidesForPreview[i], i));
  }
  await renderMontage(previewPaths);
  console.log(JSON.stringify({ pptx: PPTX_PATH, previewDir: PREVIEW_DIR, montage: MONTAGE_PATH, slides: slidesForPreview.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
