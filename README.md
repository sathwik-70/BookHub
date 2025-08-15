# BookHub 📚✨

![BookHub Cover Image](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/book-open.svg) <!-- *Replace with actual screenshot link when deployed* -->

**A Universal Catalog of Human Knowledge.**

BookHub is a beautifully curated, open-source gateway to the sum of human achievement. Built with a modern React stack, it seamlessly aggregates open-source books, deep space imagery, scholarly research papers, and curated historical art collections into a single, highly polished, frictionless interface.

---

## 🌟 Core Features

- **The Universal Catalog**: A unified search engine that simultaneously queries multiple public APIs (NASA, Open Library, arXiv, Art Institute of Chicago).
- **Categorized Discovery**: Browse artifacts through distinct, specialized sectors (Books, Articles, Space, Art, Audiobooks, Periodicals, Manuscripts) with custom iconography.
- **Premium Glassmorphism Aesthetic**: A breathtaking "slate-50" light theme featuring high-fidelity frosted glass panels, subtle animated keyframes, and crisp typography.
- **My Archives (Favorites)**: Star any artifact to save it. All favorites are persistently saved to your local browser storage instantly. no backend required.
- **Learning Analytics Dashboard**: Gain visual insights into your curated collection with a fully responsive Recharts pie chart, total metrics, and a recent discovery feed.
- **Data Sovereignty**: Total control over your archives with one-click JSON Export and Import capabilities, allowing you to sync collections across devices effortlessly.
- **Frictionless Sharing**: Instantly share any artifact via the "Share Link" button, backed by native Toast notifications for seamless user feedback.
- **Infinite Scroll**: Buttery-smooth lazy loading as you approach the bottom of the grid, eliminating the need for hard pagination clicks.

## 🛠️ Tech Stack & Architecture

BookHub is designed with modern web development standards and production-grade UI/UX practices:

*   **Frontend Framework**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/) (Single Page Application architecture)
*   **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Language**: TypeScript for rigorous static typing and component prop safety.

## 📡 API Integrations

BookHub leverages the following open-source APIs to stream its content:

1.  **[Open Library API](https://openlibrary.org/developers/api)**: Powers the Books and Manuscripts categories (enforcing `has_fulltext` for readable digital books).
2.  **[NASA Image and Video Library](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)**: Powers the Space category with deep space photography from the Hubble and James Webb telescopes.
3.  **[arXiv API](https://arxiv.org/help/api)**: Powers the Articles category, bringing pre-print scholarly papers in physics, mathematics, and computer science.
4.  **[Art Institute of Chicago API](https://api.artic.edu/docs/)**: Powers the Art category, specifically filtered for classical prints and historical lithographs.
5.  **[Internet Archive Search API](https://archive.org/help/aboutsearch.htm)**: Drives the Audiobooks and Periodicals categories, including an embedded playlist player for active audio streaming within the app.

---

## 🚀 Getting Started

To run BookHub locally, follow these simple steps:

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/BookHub.git
    cd BookHub/bookhub
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **View the application**:
    Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
This will compile TypeScript, bundle the Vite application into the `dist/` folder, and generate a `404.html` fallback for static hosting providers.

## 📂 Project Structure

```text
bookhub/
├── public/                 # Static assets (Vite SVG, PWA manifests if applicable)
├── src/
│   ├── api.ts              # Core API fetching logic and data normalization (The Engine)
│   ├── App.tsx             # Root Layout (Sticky Header, Routing Outlet, Main Logo)
│   ├── Dashboard.tsx       # Analytics, Recharts logic, and JSON Export/Import
│   ├── LibraryBrowser.tsx  # Hero Search, Category Tabs, Infinite Scroll Grid
│   ├── AssetCard.tsx       # Hover-animated grid items
│   ├── AssetModal.tsx      # Detailed glass overlay with streaming iframes
│   ├── SkeletonCard.tsx    # Staggered loading placeholders
│   ├── Toast.tsx           # Global Notification Event System
│   ├── index.css           # Tailwind directives and custom glassmorphism utilities classes
│   └── main.tsx            # React DOM rendering and Router wrapping
├── tailwind.config.js      # Custom theme colors (hub.bg, hub.primary) and keyframes
├── validate.js             # Utility script for structural validation
└── vite.config.ts          # Vite bundling and asset serving configuration
```

## 🤝 Contributing & Open Source

BookHub is open source and strictly ad-free. It exists to celebrate and organize humanity's shared knowledge. We welcome pull requests!

If you'd like to add a new API source (e.g., the Metropolitan Museum of Art, Google Books, or Wikipedia), simply jump into `src/api.ts` and define a new fetching function mapping to the universal `AssetItem` interface.

## 📝 License

This project is open-source. Please see the [LICENSE](LICENSE) file for details.

*Powered by Open APIs. Designed for the curious.*
