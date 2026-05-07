# 10 — Dress-up 配件（Wardrobe）

**用途**：疊在 `09-character-base` 上方的配件
**輸出路徑**：`public/illustrations/avatar/wardrobe/<item>.png`
**尺寸建議**：800 × 1000（與 base 同畫布）、PNG 透明背景
**位置對齊**：每個配件需與 base 角色嚴格對齊，疊上去後位置正確

## 配件清單（建議生）

### 帽子 / 頭飾類（疊在 hood 上半部）
- `hat-beret-sage.png` — 沙鼠尾草綠貝雷帽
- `hat-flower-crown.png` — 小花環
- `hat-wool-amber.png` — 暖駝色針織帽
- `glasses-round.png` — 圓框眼鏡（疊在臉部）

### 持物類（疊在前胸區）
- `book-open-cream.png` — 翻開的奶油色書
- `book-closed-sage.png` — 沙鼠尾草綠合上的書
- `tea-cup.png` — 一杯熱茶
- `pen-quill.png` — 一支羽毛筆

### 圍巾 / 飾品（疊在頸部）
- `scarf-lavender.png` — 薰衣草紫圍巾
- `scarf-stripes.png` — 細條紋圍巾
- `bookmark-tab.png` — 書籤垂吊（從袍子裡露出來）

### 背景配件（疊在角色後方）
- `bg-bookshelf-mini.png` — 一個迷你書櫃靠右後
- `bg-window-moon.png` — 一扇小圓窗、外面月夜
- `bg-window-sun.png` — 一扇小圓窗、外面晴日

## 通用 Prompt 模板

```
A small watercolor accessory PNG with strict transparent background,
designed to be overlaid onto a Folio character portrait of standardized size 800x1000.

Item: <ITEM_DESCRIPTION>
Position on canvas: <POSITION> (e.g., "upper third, centered horizontally" for hat;
"middle third, centered" for held book; "neck area, centered" for scarf)

Style: soft watercolor illustration, hand-painted texture,
warm parchment color palette (sage #6B8064, lavender #9B8FB5, amber #D9B884,
dusty rose #E8C4BD, walnut #3D2F1F for thin outlines),
gentle bleeding edges, no harsh ink lines, no neon colors,
single item only on the canvas, the rest is fully transparent (PNG alpha),
literary cozy mood, no other elements, no character body shown — only the accessory.
```

## 範例填寫（直接複製給 Codex）

### `hat-beret-sage.png`

```
A small watercolor accessory PNG with strict transparent background,
designed to be overlaid onto a Folio character portrait of standardized size 800x1000.

Item: a soft sage green (#6B8064) classic French beret, slightly slouched to one side,
with a small dark stem on top, hand-painted watercolor texture.
Position on canvas: upper third of frame, centered horizontally,
sized to match an adult round-headed character with a hood beneath.

Style: soft watercolor illustration, hand-painted texture,
warm parchment color palette (sage #6B8064 main, walnut #3D2F1F for thin outlines and stem),
gentle bleeding edges, no harsh ink lines, no neon colors,
single beret only on the canvas, the rest is fully transparent (PNG alpha),
literary cozy mood, no other elements, no character body shown — only the beret.
```

### `book-open-cream.png`

```
A small watercolor accessory PNG with strict transparent background,
designed to be overlaid onto a Folio character portrait of standardized size 800x1000.

Item: an open book held in front of the chest, viewed from the reader's side
so we see the spread pages clearly, cream paper with very faint hand-drawn line texture suggesting words,
warm leather-look cover edges in walnut brown, slight curl at page corners.
Position on canvas: middle horizontal band, centered horizontally,
sized to look like a paperback being held by an adult round-headed hooded character.

Style: soft watercolor illustration, hand-painted texture,
warm parchment color palette (cream #FAF3E7 pages, walnut #3D2F1F covers and outlines),
gentle bleeding edges, no harsh ink lines, no neon colors,
single book only on the canvas, the rest is fully transparent (PNG alpha),
literary cozy mood, no character shown — only the book.
```

## Avoid（所有配件通用）

- 飽和、亮、新（要舊書頁的褪色感）
- 卡通厚邊
- 配件太大太搶戲（重點是讓角色換裝有趣，不是配件本身）

## 對齊配件到 base 的座標系統

所有配件必須在 800×1000 透明畫布上、和 base 的座標系統對齊：
- 帽類：橫向中心在 400px、最低緣在 280px（剛好坐在兜帽頂上）
- 眼鏡：橫向中心 400、垂直中心 265（蓋住眼睛位置）
- 圍巾：橫向中心 400、頂緣在 320px（脖子下方）
- 持物（書、茶、筆）：橫向中心 400、垂直中心 550（雙手前方）
- 書籤：垂直 400-700px 範圍、靠左或靠右側緣（袍子裡露出來）
- 背景：可填滿畫布，但避免遮擋 270-880px 中央 200px 寬的人物區

**建議：生 wardrobe 時把 base 圖一起餵 Codex 當參考，要它「在這個 silhouette 上」放配件。**

## 實作建議

UI 結構：

```html
<div class="avatar-stack" style="position:relative; width:800px; height:1000px">
  <img src=".../bg-window-moon.png" />     <!-- z-0 -->
  <img src=".../base-sage.png" />          <!-- z-1 -->
  <img src=".../scarf-lavender.png" />     <!-- z-2 -->
  <img src=".../book-open-cream.png" />    <!-- z-3 -->
  <img src=".../hat-beret-sage.png" />     <!-- z-4 -->
  <img src=".../glasses-round.png" />      <!-- z-5 -->
</div>
```

每張都絕對定位疊在 800×1000 畫布裡。**所以所有配件都要用同一張 800×1000 畫布生**，配件本身只占畫布內它應該在的位置。

## 給用戶的決策提示

第一次生 wardrobe 時建議只先生 **1 帽子 + 1 書 + 1 圍巾** 共 3 張試水溫，確認位置對齊和風格一致後，再批量生剩下的。
