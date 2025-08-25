# JSON Form Schema Generator

A modern, visual tool for creating JSON Schema and UI Schema configurations for forms. Built with React, TypeScript, and Material-UI, this application provides an intuitive interface for building form schemas without writing code.

![JSON Schema Generator](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)
![Material-UI](https://img.shields.io/badge/MUI-7.3+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **Visual Form Builder**: Click-to-add interface for creating form fields
- **Multiple Field Types**: Support for text, number, boolean, select, and textarea fields
- **Real-time Preview**: Live preview of your form as you build it
- **Schema Export**: Generate both JSON Schema and UI Schema
- **Field Validation**: Built-in validation with configurable rules
- **Field Reordering**: Move fields up and down to organize form structure
- **Schema Management**: Copy to clipboard or download as JSON files

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/M3MONs/json-form-schema-generator.git
cd json-form-schema-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1+
- **Language**: TypeScript 5.8+
- **Build Tool**: Vite 7.1+
- **UI Library**: Material-UI (MUI) 7.3+
- **Form Library**: React JSON Schema Form (RJSF) 6.0+
- **Validation**: AJV JSON Schema Validator
- **Styling**: Emotion (CSS-in-JS)

## 🎯 Usage

### Creating a Form

1. **Add Fields**: Click on field type buttons to add fields to your form
2. **Reorder Fields**: Use the up/down arrow buttons to reorder fields
3. **Configure Fields**: Select a field to edit its properties in the right panel
4. **Set Validation**: Configure validation rules, required fields, and constraints
5. **Preview**: View your form in real-time in the center panel
6. **Export**: Copy or download the generated JSON Schema and UI Schema

### Supported Field Types

- **Text**: Single-line text input with placeholder and validation
- **Textarea**: Multi-line text input with configurable rows
- **Number**: Numeric input with min/max validation
- **Boolean**: Checkbox or radio button for true/false values
- **Select**: Dropdown with custom options

### Field Configuration Options

- **Basic Properties**: Name, title, description, placeholder
- **Validation**: Required field, min/max values, custom patterns
- **UI Options**: Widget type, inline display, disabled state
- **Help Text**: Additional guidance for users

## 📊 Schema Output

The application generates two types of schemas:

### JSON Schema
Standard JSON Schema for form validation and structure:
```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email Address",
      "format": "email"
    }
  },
  "required": ["email"]
}
```

### UI Schema
UI-specific configuration for form rendering:
```json
{
  "email": {
    "ui:placeholder": "Enter your email address",
    "ui:help": "We'll never share your email"
  }
}
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React JSON Schema Form](https://rjsf-team.github.io/react-jsonschema-form/) for the form rendering engine
- [Material-UI](https://mui.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the lightning-fast build tool

---

Made by [M3MONs](https://github.com/M3MONs)
