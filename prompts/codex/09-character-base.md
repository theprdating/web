# 09 — Dress-up 角色基底

**用途**：`/me` 個人頁的角色人偶（新功能、目前 spec 無、實作待規劃）。從 logo 兩個小人衍生出個人化頭像系統
**輸出路徑**：`public/illustrations/avatar/base-<color>.png`
**尺寸建議**：800 × 1000（直立、留白多）、PNG 透明背景
**生 N 張（每個顏色一張）**

## 概念

一個 logo 風格的兜帽小人，全身正面、雙手垂下或微抬、適合疊加配件。**透明底**讓後續可以疊衣服 / 帽子 / 書本。

每個顏色獨立一張：
- `base-sage.png` — 沙鼠尾草綠 `#6B8064`
- `base-lavender.png` — 薰衣草紫 `#9B8FB5`
- `base-amber.png` — 暖駝 `#D9B884`
- `base-rose.png` — 柔粉 `#E8C4BD`
- `base-fog.png` — 霧藍 `#A6B5C2`
- `base-walnut.png` — 深棕 `#6B5A47`

## Prompt（替換 `<COLOR_NAME>` 與 `<HEX>`）

```
A soft watercolor character portrait, transparent background:
one small round-headed hooded figure standing facing the viewer in a relaxed neutral pose,
arms gently held to the sides, body shape soft and rounded — exactly in the style of the Folio logo:
round head, two tiny dot eyes, no nose, no mouth, no other facial features, no hands shown explicitly,
the entire body is enveloped in a long flowing hooded robe.
Robe color: <COLOR_NAME> (<HEX>), with subtle watercolor variation and soft shadow at the hem.
The character is centered, occupying about 70% of the vertical frame, leaving generous transparent
space above (for hat overlay) and to the sides (for accessory overlay).

soft watercolor illustration, hand-painted texture,
strict transparent background (PNG alpha),
single character only, walnut #3D2F1F for very thin outlines,
literary cozy mood, no shadow on the ground,
no neon colors, no other elements at all (no books, no objects, no scenery),
no text, no decorative borders — pure character cutout for layering.
```

替換清單（請逐張重 run prompt）：

| 檔名 | COLOR_NAME | HEX |
|---|---|---|
| `base-sage.png` | sage green | `#6B8064` |
| `base-lavender.png` | lavender | `#9B8FB5` |
| `base-amber.png` | warm amber | `#D9B884` |
| `base-rose.png` | dusty rose | `#E8C4BD` |
| `base-fog.png` | foggy blue | `#A6B5C2` |
| `base-walnut.png` | walnut brown | `#6B5A47` |

## Avoid

- 任何配件（帽子、書、圍巾都不要 — 那是 wardrobe 那份的事）
- 不透明底（一定要 PNG alpha）
- 角色變大或變小、姿勢不同（六個顏色要嚴格一致 silhouette）
- 笑臉、表情變化

## 對齊參考點（Alignment Anchors）

為了讓 6 個 base 在多層疊加時不漂移、所有 base 必須遵守：
- 角色高度：占畫布高度 70-75%，腳底接近畫布底部 5%（即 950px 線），頭頂接近 220px 線
- 角色橫向：嚴格置中（畫布中心線 400px ± 10px）
- 兜帽形狀：張開橢圓 hood 開口面寬 ≈ 200px、開口下緣在畫布 290px 處
- 兩眼位置：(370, 265) 與 (430, 265) ± 10px

## 實作備註（給未來實作）

UI 上會用 CSS `position: absolute` 或 SVG `<g>` 把 base + wardrobe 疊在同一個容器。所以 base 要嚴格固定位置（角色中心對齊畫布中心）。建議所有 6 張用同一個 prompt 重 run，只改顏色字眼。
