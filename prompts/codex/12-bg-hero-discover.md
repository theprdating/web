# 12 — Discover Hero 橫幅背景

**用途**：`/discover` 頁面頂部 hero 區（標題上方），讓首頁有「進入感」
**輸出路徑**：`public/illustrations/decorations/hero-discover.png`
**尺寸**：1200 × 480 PNG（2.5:1 寬橫幅），**透明底或柔淡底色都可**

## 概念

一條溫柔的水彩橫幅，左側到右側漸變色彩、撒落幾片書頁或葉子，視覺上是「打開一張書桌的場景」。底部 30% 要留淡薄到接近透明（讓「探索」標題能疊在上面而不打架）。

## Prompt

```
A wide horizontal watercolor banner illustration, 1200x480 pixels, designed to sit
behind the title of an "Explore" page in a literary book-discovery app.
The composition is panoramic and atmospheric:
left third — soft warm cream wash with two or three small folded paper pages
floating gently like leaves, in pale sage and amber tones;
center third — an almost-empty parchment haze with a few hand-drawn tiny stars
and a subtle horizontal line suggesting a desk or page edge;
right third — soft lavender twilight wash with one delicate crescent moon
and floating page corners.
The bottom 30% of the canvas fades into pale cream/parchment so a title can
be overlaid without competing with the artwork.
The whole image is intentionally low-contrast and ambient.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment color palette (#F8F1E4 base, sage green #6B8064 left,
lavender #9B8FB5 right, amber #D9B884 highlights, walnut #3D2F1F for very fine accents only),
literary cozy mood, panoramic 2.5:1 horizontal composition,
no harsh ink lines, no neon colors, no people, no text in image,
the bottom edge fades to near-cream so text overlay is readable.
```

## Avoid

- 強烈分區（左右轉太硬）
- 滿版深色（要呼吸感）
- 任何文字
- 主角化的人物或物件

## 整合說明

存到 `public/illustrations/decorations/hero-discover.png` 後會自動顯示在 Discover 頁標題上方。如果視覺太強烈，告訴我，我可以調 opacity 或 height。
