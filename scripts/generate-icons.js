// 生成 PWA 图标的简单脚本
// 需要先安装: npm install -D sharp

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 简单的 SVG 图标
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1dbac9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0ea5b3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#grad)"/>
  <path d="M256 120 C200 120, 150 150, 150 220 L150 350 C150 400, 200 450, 256 450 C312 450, 362 400, 362 350 L362 220 C362 150, 312 120, 256 120 Z" fill="white" opacity="0.9"/>
  <path d="M256 120 L256 200 M200 180 L200 200 M312 180 L312 200" stroke="white" stroke-width="20" stroke-linecap="round"/>
  <circle cx="256" cy="280" r="40" fill="white" opacity="0.7"/>
</svg>`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 保存 SVG
fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
console.log('✅ 已创建 icon.svg');

// 提示使用在线工具或 ImageMagick 转换
console.log('\n📝 下一步：');
console.log('1. 使用在线工具转换 SVG 为 PNG:');
console.log('   https://convertio.co/svg-png/');
console.log('   https://cloudconvert.com/svg-to-png');
console.log('2. 生成以下尺寸的 PNG 图标：');
console.log('   - icon-192.png (192x192)');
console.log('   - icon-512.png (512x512)');
console.log('3. 将图标文件放到 public/ 目录');
