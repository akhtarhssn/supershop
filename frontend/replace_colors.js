const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    content = content.replace(/#635ad9/g, '#6366F1');
    content = content.replace(/#4f46e5/g, '#4F46E5'); // keeping identical but consistent
    content = content.replace(/#f5f3ff/g, '#EEF2FF'); // 100 bg
    content = content.replace(/#f8f8fd/g, '#F9FAFB'); // 50 bg
    content = content.replace(/#f0f0f8/g, '#E5E7EB'); // border
    content = content.replace(/#e8e8f0/g, '#D1D5DB'); // border 2
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    });
}

processDirectory(directoryPath);
console.log('Color replacement complete.');
