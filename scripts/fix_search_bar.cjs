const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

code = code.replace(
  /<motion\.form[\s\S]*?className="pointer-events-auto sata-search-bar/m,
  '<form\r\n      id="sata-command-search-bar"\r\n      onSubmit={handleExecuteSearch}\r\n      onClick={(e) => {\r\n        const target = e.target as HTMLElement;\r\n        if (target.closest(\'button\')) return;\r\n        searchInputRef.current?.focus();\r\n      }}\r\n      className="pointer-events-auto sata-search-bar'
);

code = code.replace(
  "</motion.form>",
  "</form>"
);

fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', code, 'utf8');
console.log('Fixed renderSearchBar in App.tsx');
