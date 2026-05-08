# 11 — 背景角落裝飾（對角兩張）

**用途**：固定在視窗右上角和左下角的水彩裝飾，讓背景不再單調
**輸出路徑**：
- `public/illustrations/decorations/corner-tr.png` (top-right)
- `public/illustrations/decorations/corner-bl.png` (bottom-left)

**尺寸**：500 × 500 PNG，**透明底**
**位置**：兩張對角排列、不對稱、視覺平衡

## 概念

兩張水彩小裝飾從畫面對角探入。**右上**：一束從右上角垂下的書頁與葉子，像書架上漏出來。**左下**：從左下角浮起的小水彩煙、紙片或星塵，呼應 Folio logo 上的飄逸感。

兩張都要：
- 主要視覺集中在自己那一角
- 朝畫面**中心**生長 / 飄散
- 邊緣柔和淡出
- 不超過畫布 50% 範圍（其餘是透明）
- 整體色調**極淡**，不能搶內容

## Prompt — corner-tr.png（右上角）

```
A small watercolor decorative element with a strict transparent background,
designed to live in the top-right corner of a mobile app viewport, drifting toward the lower-left.
Subject: a delicate cluster of 3-5 hand-painted sage green and amber-brown autumn leaves
on a thin curving branch, with one or two small loose book pages or paper scraps
gently fluttering downward from the branch, like they're falling out of an unseen bookshelf above.
The branch enters from the very top-right corner.
The composition occupies only the upper-right 45% of the canvas; the lower-left 55% is fully transparent.
The element should feel like a quiet ambient detail, not a focal point.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: sage green #6B8064, dusty amber #C9B89A, warm walnut #6B5A47,
faint accents of lavender #9B8FB5,
all colors are heavily DESATURATED and LOW contrast — this must read as ambient background, not foreground,
no harsh ink lines, no neon, no people, no text,
strictly transparent PNG (alpha) background, 500x500 canvas.
```

## Prompt — corner-bl.png（左下角）

```
A small watercolor decorative element with a strict transparent background,
designed to live in the bottom-left corner of a mobile app viewport, drifting toward the upper-right.
Subject: a soft watercolor swirl of rising mist or steam, with 4-6 tiny hand-painted stars,
loose paper page-corners, and a single delicate pressed leaf or sprig of greenery,
all gently floating upward and outward from the bottom-left corner,
like a quiet exhalation rising from the bottom of the page.
The composition occupies only the lower-left 45% of the canvas; the upper-right 55% is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: lavender #9B8FB5, sage green #6B8064, soft amber #D9B884,
warm walnut #6B5A47 for the sprig outline,
all colors heavily DESATURATED and LOW contrast — this must read as ambient background, not foreground,
no harsh ink lines, no neon, no people, no text,
strictly transparent PNG (alpha) background, 500x500 canvas.
```

## Avoid（兩張都通用）

- 滿版圖（要留 55% 透明）
- 飽和顏色（會搶到內容）
- 硬筆描邊
- 主角化的物件（不要明顯人物或大物件）
- 對稱裝飾（要自然不規則）

## 後續

兩張存到 `public/illustrations/decorations/` 後**自動顯示**（已有對應的 React component 接好）。如果生出來太搶眼，告訴我，我把 CSS 上的 opacity 從 0.6 再降下來。
