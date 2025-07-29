# 3D Gaussian Splats Viewer

## Features

- 🎨 **Modern React UI**: Beautiful, responsive design with Material-UI components and custom theming
- 📁 **File Upload**: Drag and drop or click to upload your 3D model files
- 🌐 **Remote Loading**: Load models from remote servers via HTTP API
- ⚙️ **Real-time Controls**: Adjust alpha threshold and scale parameters on the fly
- 🎥 **Camera Controls**: Reset camera position and toggle auto-rotation
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🚀 **Fast Loading**: Optimized for smooth performance with large 3D models

## Supported File Formats

- `.ply` - Point cloud files
- `.ksplat` - K-Planes splat format
- `.splat` - Gaussian splat format

## Installation

1. **Clone or download this repository**

   ```bash
   git clone <repository-url>
   cd 3dgs-viwer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (Vite's default port)

## Remote Model Loading

The application can load models from a remote server. To use this feature, create a server that provides these endpoints:

- `GET /api/models` - List available models (returns JSON array)
- `GET /api/download/<filename>` - Download model file (returns binary data)

The server should run on `http://127.0.0.1:8000` or update the `API_BASE_URL` in `src/services/api.js`.

## Usage

### Basic Usage

1. **Upload a 3D Model**: Click the "Choose 3D Model File" button and select your `.ply`, `.ksplat`, or `.splat` file
2. **Adjust Settings**: Use the sliders to modify:
   - **Alpha Removal Threshold**: Controls transparency filtering (0-10)
   - **Scale X/Y/Z**: Adjust model size on each axis (0.1-3.0)
3. **Camera Controls**:
   - **Mouse**: Click and drag to rotate, scroll to zoom, right-click to pan
   - **Reset Camera**: Return to the initial camera position
   - **Auto-Rotate**: Toggle automatic camera rotation around the model

## Development

### Project Structure

```
├── index.html              # Main HTML file
├── src/
│   ├── App.jsx            # Main React application component
│   ├── main.jsx           # React entry point
│   ├── theme.js           # Material-UI theme configuration
│   ├── components/        # React components
│   │   ├── Header.jsx     # Application header
│   │   ├── Controls.jsx   # Control panel component
│   │   ├── Viewer.jsx     # 3D viewer component
│   │   └── InfoPanel.jsx  # Information panel
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── constants/         # Application constants
│   └── assets/            # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Serve production build on port 3000

### Customization

You can easily customize the viewer by modifying:

- **Theme**: Edit the Material-UI theme in `src/theme.js`
- **Components**: Modify React components in `src/components/`
- **Hooks**: Customize state management in `src/hooks/`
- **API Configuration**: Update server endpoints in `src/services/api.js`

## Technical Details

### Dependencies

- **React 18**: Modern React with hooks and functional components
- **Material-UI**: Beautiful UI components and theming system
- **@mkkellogg/gaussian-splats-3d**: Core 3D rendering library
- **Vite**: Fast build tool and development server
- **Emotion**: CSS-in-JS styling solution

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
