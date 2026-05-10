# 13 — Wardrobe 配件（對齊版本）

**用途**：取代現有 `public/illustrations/avatar/wardrobe/*.png` 配件
**輸出路徑**：`public/illustrations/avatar/wardrobe/<filename>.png`
**畫布**：800 × 1000 PNG，**透明底**
**對齊基準**：跟 `09-character-base.md` 重生後的 base 共用座標系統

## 對齊系統（所有配件遵守）

| 區域 | Y 範圍 | 用途 |
|---|---|---|
| 頭頂 | 80-180 | 帽子 |
| 兜帽頂部 | 180-220 | （帽子下緣可碰到此線）|
| 眼部 | 230-260 | 眼鏡 |
| 兜帽下緣 / 脖子 | 290-380 | 圍巾 |
| 胸前 / 腹前 | 450-700 | 持物（書、茶、筆）|
| 全畫布右側 | x=550-780 | 書籤垂掛位置 |

**所有配件水平置中於 x=400**（除了書籤）。

**強烈建議**：用 Codex / DALL-E 時把 `_logo-reference.png` 或 `base-sage.png` 一起餵當 reference image，叫它「在這個 silhouette 上」放配件。

---

## 共用 Style Block

每個 prompt 都加這段確保風格一致：

```
soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: sage #6B8064, lavender #9B8FB5, amber #D9B884,
dusty rose #E8C4BD, walnut #3D2F1F for thin outlines,
strictly transparent PNG (alpha) background, 800x1000 canvas,
literary cozy mood,
no harsh ink lines, no neon colors, no character body shown — only the accessory item.
```

---

## 帽子 — 3 張

### 1️⃣ `hat-beret-sage.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a soft sage green (#6B8064) classic French beret, slightly slouched to one side,
with a tiny dark stem on top.
Position on canvas: horizontally centered at x=400 (canvas width 800),
the beret occupies y=80 to y=200 (sits on top of the character's hood, lowest brim
slightly overlapping with hood top at y=200).
Beret width about 280-320px (so it visually rests on a hood opening of ~200px wide).
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: sage #6B8064 main color, walnut #3D2F1F for the stem and thin outlines,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single beret only, no character body, no other elements.
```

### 2️⃣ `hat-flower-crown.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a delicate floral crown — 5-7 small hand-painted flowers (mix of dusty rose, lavender,
soft amber, with tiny sage leaves between) arranged in a thin curved garland.
Position on canvas: horizontally centered at x=400, the crown spans y=120 to y=210
(rests just above and around the character's hood opening like a halo of flowers).
Crown width about 280-320px to match a hood ~200px wide.
The crown itself has a curved arc shape, thicker in the middle, tapering at sides.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: dusty rose #E8C4BD, lavender #9B8FB5, soft amber #D9B884,
sage #6B8064 for leaves, walnut #3D2F1F for thin flower-center accents,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single floral crown only, no character body, no other elements.
```

### 3️⃣ `hat-wool-amber.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a soft cozy hand-knitted wool beanie/winter hat in warm amber (#D9B884),
with a small folded brim at the bottom and a tiny pom-pom or tassel on top.
Texture suggests gentle knit lines.
Position on canvas: horizontally centered at x=400, the hat occupies y=70 to y=210
(sits on top of the character's hood, the folded brim at y=180-210 overlaps slightly
with hood top, the rounded crown extends up to y=70).
Hat width about 250-300px.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: amber #D9B884 main, slightly darker amber for shadow folds,
walnut #3D2F1F for tiny pom-pom outline,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single wool hat only, no character body, no other elements.
```

---

## 眼鏡 — 1 張

### 4️⃣ `glasses-round.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a delicate pair of round vintage reading glasses with thin walnut-brown frames.
Position on canvas: horizontally centered at x=400, glasses span y=225 to y=270
(directly over the character's eye line at y=245).
Each lens is a small round circle about 60-70px diameter, two lenses connected by
a small bridge across the nose. Total glasses width about 180px.
Lenses are nearly transparent (just a faint amber tint suggesting glass).
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: walnut brown #3D2F1F for thin frames and bridge,
optional very faint amber #D9B884 wash inside lenses suggesting glass,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single pair of round glasses only, no character body, no other elements.
```

---

## 圍巾 — 2 張

### 5️⃣ `scarf-lavender.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a soft hand-knitted lavender (#9B8FB5) winter scarf, wrapped once around a neck,
with two short ends hanging slightly to the front.
Position on canvas: horizontally centered at x=400, scarf occupies y=300 to y=470
(wraps just below the character's hood opening at y=290 and drapes down to mid-chest).
Scarf width about 320-380px to wrap around the character's neck/upper body.
Texture suggests gentle wool knit.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: lavender #9B8FB5 main, slightly darker lavender for fold shadows,
walnut #3D2F1F for very thin knit-line accents,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single scarf only, no character body, no other elements.
```

### 6️⃣ `scarf-stripes.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a long thin hand-knitted scarf in cream and sage horizontal stripes
(thin alternating stripes ~10px each, cream #FAF3E7 and sage #6B8064),
wrapped once around a neck with two longer ends hanging in front.
Position on canvas: horizontally centered at x=400, scarf occupies y=300 to y=520
(wraps below the hood opening and drapes longer than the lavender scarf).
Scarf width about 280-340px around the neck, ends taper.
Texture suggests gentle wool knit with visible thin stripes.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: cream #FAF3E7 and sage #6B8064 alternating stripes,
walnut #3D2F1F for very thin tassel-end accents,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single striped scarf only, no character body, no other elements.
```

---

## 持物（書 / 茶 / 筆）— 4 張

### 7️⃣ `book-open-cream.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: an open paperback book viewed from the reader's perspective, showing both spread pages.
Cream-colored pages (#FAF3E7) with very faint hand-drawn horizontal lines suggesting text.
Warm walnut leather-look cover edges visible at the outer sides.
Slight curl at the bottom corners of pages.
Position on canvas: horizontally centered at x=400, book spans y=480 to y=720
(held in front of the character's chest/lap area where hands would be).
Book total width about 360-420px when opened (so 180-210px per page side).
The book is held flat horizontally, not tilted up.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: cream #FAF3E7 pages, walnut #3D2F1F covers and spine,
faint amber #D9B884 page-edge highlight,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single open book only, no character body, no hands shown, no text on pages.
```

### 8️⃣ `book-closed-sage.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a closed hardcover book held vertically in front of the chest, sage green (#6B8064)
fabric cover with a thin walnut spine line and very faint embossed pattern.
A tiny visible bookmark ribbon (amber) peeks from the top of the closed pages.
Position on canvas: horizontally centered at x=400, book spans y=470 to y=720
(held in front of the character's chest area).
Book width about 200-240px (a single closed paperback width), height about 250px.
The book is held upright/vertical, slight 3/4 angle.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: sage #6B8064 cover, walnut #3D2F1F spine and outline,
amber #D9B884 for tiny bookmark ribbon,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single closed book only, no character body, no hands shown.
```

### 9️⃣ `tea-cup.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a small ceramic teacup on a matching saucer, viewed from a slight 3/4 angle.
The cup is cream-colored (#FAF3E7) with a thin sage rim, holding warm amber tea inside.
Soft wisps of steam rise from the cup (3-4 thin curving lines).
A small handle on the right side of the cup.
Position on canvas: horizontally centered at x=400, cup + saucer + steam span y=450 to y=720
(held at chest level by the character).
Cup+saucer width about 220-260px.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: cream #FAF3E7 cup, sage #6B8064 thin rim,
amber #D9B884 tea liquid, walnut #3D2F1F for thin outlines,
very pale grey-cream for steam wisps,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single teacup with saucer only, no character body, no hands shown.
```

### 🔟 `pen-quill.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: an elegant feather quill pen, slightly tilted to the right.
The feather is soft sage green (#6B8064) with delicate barb details,
the quill's nib is walnut brown.
Position on canvas: horizontally centered at x=400, quill spans y=420 to y=720
(held at chest level, pointing diagonally upward to upper right).
Quill total length about 320-380px, slightly diagonal.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: sage #6B8064 feather body, slightly darker sage for shadow,
walnut #3D2F1F for nib and central spine of feather,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single feather quill only, no character body, no hands shown, no ink bottle.
```

---

## 書籤 — 1 張

### 1️⃣1️⃣ `bookmark-tab.png`

```
A small watercolor accessory PNG with strict transparent background, 800x1000 canvas.
Item: a thin fabric bookmark ribbon hanging vertically, like a tab tucked
into a robe or book and dangling out.
Color: rich amber (#D9B884) with a small walnut tassel at the bottom end.
Position on canvas: NOT centered — placed on the RIGHT side of canvas,
horizontally at x=580 to x=620 (about 200px right of center).
Vertically: spans y=400 to y=700 (peeks out from middle of robe area).
Width about 40-60px (thin ribbon), with a slight tassel widening at bottom (~80px).
The ribbon should look like it's tucked into something at the top, with a soft
torn / cut edge at y=400, and a clear tasseled end at y=700.
The rest of the canvas is fully transparent.

soft watercolor illustration, hand-painted texture, gentle bleeding edges,
muted parchment palette: amber #D9B884 ribbon, walnut #3D2F1F tassel,
strictly transparent PNG (alpha) background,
literary cozy mood, no harsh ink lines, no neon colors,
single bookmark ribbon only, no character body, no book.
```

---

## 生完之後

11 張都丟到 `public/illustrations/avatar/wardrobe/` 覆蓋舊檔案。然後告訴我，我把 wardrobe 的 4 個 tabs（帽子 / 持物 / 圍巾 / 配件）從編輯器解凍、重新顯示出來。

## 建議生圖順序

第一輪先生 **2 張試水溫**：
1. `hat-beret-sage.png` — 看帽子 alignment
2. `book-open-cream.png` — 看持物 alignment

兩張都對齊正確再批量生剩下的 9 張。如果第一輪位置不對，告訴我，我把對齊系統的 y 座標再調整。
