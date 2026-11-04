const fs = require('fs');
let content = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf-8');
const oldFunc = `  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };`;
const newFunc = `  const handleFocusSearch = () => {
    if (!isSearchSubmitted) {
      searchInputRef.current?.focus();
    } else {
      const chatInput = document.querySelector('input[placeholder*="Ask about satellite"]') as HTMLInputElement;
      if (chatInput) {
        chatInput.focus();
      } else {
        setIsSearchSubmitted(false);
        setTimeout(() => searchInputRef.current?.focus(), 150);
      }
    }
  };`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', content);
  console.log('handleFocusSearch updated successfully');
} else {
  console.log('Target not found, checking normalized...');
  content = content.replace(/const handleFocusSearch = \(\) => \{\s*searchInputRef\.current\?\.focus\(\);\s*\};/, newFunc);
  fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', content);
  console.log('handleFocusSearch regex updated');
}
