# 00 — 風格指南（Style Guide）

> 此檔不直接生圖，而是所有 prompt 共用的風格基準。每份 prompt 都會引用本檔的 `Universal Style Block`。

## 視覺語言

Folio 的美學是 **「水彩 × 文藝書卷氣 × 雙人共讀」**。logo（見 `_logo-reference.png`）是終極參考。

### 五色色票

| Token | Hex | 用途 |
|---|---|---|
| Parchment 米白 | `#F8F1E4` | 主背景 |
| Cream 奶油 | `#FAF3E7` | 卡片、紙張感 |
| Sage 鼠尾草綠 | `#6B8064` | 主角色 A、CTA |
| Lavender 薰衣草紫 | `#9B8FB5` | 主角色 B、夜空 |
| Walnut 核桃棕 | `#3D2F1F` | 文字、深色描邊 |
| Amber-tag 暖駝 | `#C9B89A` | 邊線、配色 |

副調可加：柔粉 `#E8C4BD`、霧藍 `#A6B5C2`、暖黃光 `#D9B884`（限月、星、燭光）。

### 角色設計（Mascot）

- 圓頭兜帽小人，全身穿斗篷
- 兜帽下露面：**兩個小圓點當眼睛、沒有嘴沒有鼻子**
- 身體輪廓圓潤、無手指無細節
- 主要動作：捧書閱讀、坐姿、側身

## Universal Style Block（每個 prompt 開頭都加）

```
soft watercolor illustration, hand-painted texture, slightly grainy paper background,
warm parchment color palette (#F8F1E4 background, sage green #6B8064 and lavender #9B8FB5 as character tones,
walnut #3D2F1F for fine outlines and text accents, amber #D9B884 for highlights only),
literary cozy mood, mobile-first composition, gentle bleeding edges,
no harsh ink lines, no neon colors, no sharp digital gradients,
characters when present are simple round-headed hooded figures with two tiny dot eyes and no other facial features,
cinematic depth-of-field but flat watercolor execution
```

## 一致性檢查

每張圖回來後，自問：

1. **色票範圍內？** 沒有亂入飽和藍紫粉
2. **人物造型像 logo？** 圓頭兜帽 + 兩點眼，不是普通卡通
3. **筆觸是水彩？** 不是 vector / 不是 cell-shaded
4. **mood 對嗎？** 安靜、溫暖、像舊書頁，不是熱鬧、不是冷淡

任一不對就重生，不要將就。
