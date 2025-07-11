const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    
    const svgPath = path.join(__dirname, '../public/icon.svg');
    const publicPath = path.join(__dirname, '../public');
    
    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.error('SVG file not found at:', svgPath);
      return;
    }
    
    // Read SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Generate 192x192 icon
    await sharp(Buffer.from(svgContent))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicPath, 'icon-192x192.png'));
    
    console.log('✓ Generated icon-192x192.png');
    
    // Generate 512x512 icon
    await sharp(Buffer.from(svgContent))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicPath, 'icon-512x512.png'));
    
    console.log('✓ Generated icon-512x512.png');
    
    console.log('All PWA icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 