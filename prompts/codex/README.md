# Folio — Codex Image Prompts

這資料夾收錄要丟給 Codex（或 DALL-E / Midjourney / gpt-image-1 / Imagen）的圖像 prompt，每個檔案是一個獨立 asset。

## 用法

1. 打開對應的 `.md` 檔
2. 複製「Prompt」區塊內的英文（image AI 對英文反應較精準）
3. 連同 `_logo-reference.png` 一起餵給 AI（許多模型支援 reference image，沒支援就用文字描述）
4. 生成後存到指定的 `public/illustrations/<filename>.png`
5. 比對 `00-style-guide.md` 的視覺一致性檢查清單

## 風格基準

所有 asset **必須**遵循 `00-style-guide.md` — 這是 Folio 的統一視覺語言。logo (`_logo-reference.png`) 是最終參考。

## 資產清單

| # | Asset | 用途 | 路徑 |
|---|---|---|---|
| 00 | 風格指南 | 共用參考、不直接生圖 | — |
| 01 | Welcome 主視覺 | `/welcome` | `public/illustrations/welcome.png` |
| 02 | Onboarding：以書識人 | `/intro/2` | `public/illustrations/intro-2.png` |
| 03 | Onboarding：共讀夥伴 | `/intro/3` | `public/illustrations/intro-3.png` |
| 04 | Onboarding：個人書房 | `/intro/4` | `public/illustrations/intro-4.png` |
| 05 | Discover 空狀態 | `/discover` | `public/illustrations/empty-discover.png` |
| 06 | 書櫃空狀態 | `/shelf` | `public/illustrations/empty-shelf.png` |
| 07 | 100% 雙方慶祝 | room celebration overlay | `public/illustrations/celebrate.png` |
| 08 | 100% 整理頁裝飾 | `/shelf/[bookId]/compilation` | `public/illustrations/compilation-header.png` |
| 09 | Dress-up 角色基底 | `/me` 個人頁人偶 | `public/illustrations/avatar/base-*.png` |
| 10 | Dress-up 配件 | 同上 | `public/illustrations/avatar/wardrobe/*.png` |

## 一致性檢查清單（生完每張圖都比對）

- [ ] 水彩感、柔邊、無硬筆觸
- [ ] 主色在五色系裡（cream / sage / lavender / walnut / amber-tag）
- [ ] 沒有強烈飽和色或螢光色
- [ ] 人物若出現，是 logo 風格的圓臉兜帽小人（兩點眼、無嘴鼻）
- [ ] 整體溫暖、書卷氣、安靜

## 迭代建議

- 第一輪先生 1 張試水溫、確認風格命中
- 命中後，把那張當 reference 一起餵後續 prompts
- 不命中：把不對的細節加到 prompt 的 "avoid" 區塊（每份 prompt 都有）
