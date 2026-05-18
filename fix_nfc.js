const fs = require('fs');

const path = 'd:/Workspace/Open_CV_Skill/frontend/src/App.tsx';
const content = fs.readFileSync(path, 'utf8');

// Chuẩn hóa toàn bộ nội dung file về NFC (gộp ký tự và dấu)
const normalizedContent = content.normalize('NFC');

if (content !== normalizedContent) {
    fs.writeFileSync(path, normalizedContent, 'utf8');
    console.log('Successfully normalized App.tsx to NFC.');
} else {
    console.log('App.tsx is already in NFC format.');
}
