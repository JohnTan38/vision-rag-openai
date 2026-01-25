# Vision RAG - Multimodal PDF Analyzer

A modern Next.js application that enables multimodal retrieval-augmented generation (RAG) over PDF documents using OpenAI's GPT-4o vision capabilities. Analyze text, tables, diagrams, and charts with an AI-powered assistant.

![Vision RAG](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-purple?style=for-the-badge&logo=openai)

## ✨ Features

- 🔍 **Multimodal Analysis**: Process text, tables, diagrams, and images from PDFs
- 🎨 **Modern UI**: Beautiful gradient design with blue/purple hues
- 💬 **Interactive Chat**: Natural conversation interface for document queries
- 🔒 **Secure**: API keys stored locally in browser, never sent to servers
- ⚡ **Fast**: Built with Next.js 14 for optimal performance
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **AI Model**: OpenAI GPT-4o (vision-enabled)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vision-rag-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Configuration

1. Click on **Configuration** in the sidebar
2. Enter your OpenAI API key (starts with `sk-...`)
3. Click **Save & Return**

Your API key is stored locally in browser state and is never sent to any server except OpenAI's API.

## 📖 Usage

### Upload a PDF
1. Click or drag a PDF file into the upload area
2. Wait for successful upload confirmation

### Ask Questions
- Use the sample questions for quick insights
- Type custom queries in the chat input
- Ask about specific tables, charts, or sections

### Example Queries
- "What are the key financial metrics in Q3?"
- "Summarize the main findings from the chart on page 5"
- "Extract data from the performance table"
- "What trends are shown in the growth diagram?"

## 🚢 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vision-rag-nextjs)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts**
   - Link to existing project or create new
   - Select default settings
   - Deploy!

### Environment Variables

No server-side environment variables are required. Users enter their OpenAI API keys directly in the application UI for maximum security and flexibility.

## 📁 Project Structure

```
vision-rag-nextjs/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI API endpoint
│   ├── globals.css               # Global styles & animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the gradient colors:
```javascript
backgroundImage: {
  'gradient-blue-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}
```

### API Configuration
Modify `app/api/chat/route.ts` to adjust:
- Model parameters (temperature, max_tokens)
- System prompts
- Response formatting

## 🔧 Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

## 🐛 Troubleshooting

### PDF not uploading
- Ensure file is valid PDF format
- Check file size is under 20MB
- Verify browser console for errors

### API errors
- Verify API key is correct
- Check OpenAI account has credits
- Ensure network connection is stable

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version is 18+

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] Multi-page PDF analysis
- [ ] Document comparison features
- [ ] Export conversation history
- [ ] Support for other document formats (DOCX, PPTX)
- [ ] Advanced filtering and search
- [ ] User authentication and saved conversations

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check OpenAI documentation: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Built with ❤️ using Next.js and OpenAI GPT-4o**
