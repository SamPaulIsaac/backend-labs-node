# VS Code Setup & Prerequisites

This document lists all the essential extensions and configuration used in this Node.js backend project.

---

## 🧩 VS Code Plugins Installed

| Plugin                              | Identifier                       | Purpose                               |
| ----------------------------------- | -------------------------------- | ------------------------------------- |
| ESLint                              | `dbaeumer.vscode-eslint`         | Linting JavaScript files using ESLint |
| Prettier - Code formatter           | `esbenp.prettier-vscode`         | Consistent code formatting            |
| Node.js Extension Pack _(Optional)_ | `waderyan.nodejs-extension-pack` | Useful Node.js tooling                |
| REST Client _(Optional)_            | `humao.rest-client`              | Manual API testing with `.http` files |

---

## ⚙️ VS Code Settings Used

These settings are included in `.vscode/settings.json` or global user settings:

```json
{
  "workbench.colorTheme": "Visual Studio Light",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": ["javascript"],
  "javascript.preferences.organizeImports": {
    "autoImportFileExcludePatterns": ["**/node_modules/**"]
  }
}
```

## 💡 Other Setup

- Node.js installed (v14+ recommended)
- Initialized project with npm init -y
- Installed ESLint:

```bash
   npm install eslint --save-dev
   npx eslint --init
```

- Installed Prettier (optional but recommended):

```bash
npm install --save-dev --save-exact prettier
```
