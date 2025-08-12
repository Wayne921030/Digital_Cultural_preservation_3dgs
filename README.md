# Digital Cultural Preservation - 3D Gaussian Splats Viewer

![Digital Cultural Preservation 3DGS Interface](./docs/demo.jpeg)
A modern web application for interactive viewing of 3D Gaussian Splatting models in digital cultural preservation projects. This platform enables users to explore high-quality 3D reconstructions of cultural heritage sites and artifacts with device-optimized performance.

🌐 **Live Website**: https://cultural-preservation-3d.com/

## 🎯 Overview

This application serves as a digital preservation platform that allows users to interactively explore 3D reconstructions of cultural heritage sites. The system automatically optimizes the viewing experience based on the user's device capabilities.

## 🚀 Features

- **🏛️ Cultural Site Exploration**: Interactive 3D viewing of heritage sites and artifacts
- **📱 Universal Accessibility**: Optimized for all devices from smartphones to high-end workstations
- **🎨 High-Fidelity Rendering**: Preserve visual quality of cultural artifacts
- **🔄 Interactive Preservation**: Real-time interaction with 3D cultural reconstructions
- **🎯 Device-Optimized Performance**: Smart resolution selection based on device capabilities
- **⚡ Fast Loading**: Optimized for large 3D cultural heritage models
- **🌐 Cloud-Based Delivery**: CDN-powered model distribution for global access

## 🛠️ Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   git checkout main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Serve production build on port 3000

## 🎮 User Scenario

### Step 1: Device Selection

Choose your device type for optimal cultural heritage viewing:

- **📱 Smartphone**: Low resolution, battery optimized for mobile exploration
- **💻 Laptop (Weak GPU)**: Medium resolution for integrated graphics
- **🖥️ Laptop (Strong GPU)**: High resolution for dedicated graphics
- **🚀 Desktop (Strong GPU)**: Ultra high resolution for maximum detail preservation

### Step 2: Cultural Site Selection

Browse available cultural heritage sites and artifacts:

- **Preview Images**: Visual previews of cultural sites
- **File Information**: Model size and format details
- **Quality Options**: Automatic resolution selection based on device
- **Cultural Context**: Information about each heritage site

### Step 3: Interactive Exploration

Explore 3D cultural reconstructions:

- **Mouse Navigation**: Click and drag to rotate, scroll to zoom, right-click to pan
- **Camera Controls**: Reset camera position and auto-rotation
- **Quality Settings**: Adjust alpha threshold and antialiasing for optimal viewing
- **Scene Management**: Switch between different cultural sites

## 🔧 Configuration

### Model Delivery

Models are served from a CDN optimized for cultural preservation:

- **Model Discovery**: `GET /models/models.json` - Available cultural sites
- **Model Download**: `GET /models/{filename}` - Cultural heritage models
- **CDN Location**: `https://<ACCOUNT_ID>.cloudfront.net`

### Adding New Scenes to S3

To add new cultural heritage scenes to the platform:

1. **Upload Model Files to S3**

   - Upload your 3D model files to the S3 bucket
   - Use descriptive filenames: `SceneName_resolution.format`
   - Example: `Example_Scene_1_low.splat`, `Example_Scene_1_medium.ply`

2. **Update models.json Structure**
   The `models.json` file must follow this structure:

<details>
<summary><strong>📋 Click to view models.json structure</strong></summary>

```json
{
  "total_count": 2,
  "scenes": [
    {
      "scene_name": "Example_Scene_1",
      "file_types": [
        {
          "type": ".splat",
          "resolutions": [
            {
              "resolution": "low",
              "filename": "Example_Scene_1_low.splat",
              "size": 16805728,
              "size_mb": 16.03
            },
            {
              "resolution": "medium",
              "filename": "Example_Scene_1_medium.splat",
              "size": 33611456,
              "size_mb": 32.06
            },
            {
              "resolution": "high",
              "filename": "Example_Scene_1_high.splat",
              "size": 67222912,
              "size_mb": 64.11
            },
            {
              "resolution": "full",
              "filename": "Example_Scene_1_full.splat",
              "size": 134445824,
              "size_mb": 128.22
            }
          ],
          "count": 4
        },
        {
          "type": ".ply",
          "resolutions": [
            {
              "resolution": "low",
              "filename": "Example_Scene_1_low.ply",
              "size": 130245923,
              "size_mb": 124.21
            },
            {
              "resolution": "medium",
              "filename": "Example_Scene_1_medium.ply",
              "size": 260490316,
              "size_mb": 248.42
            },
            {
              "resolution": "high",
              "filename": "Example_Scene_1_high.ply",
              "size": 390734708,
              "size_mb": 372.63
            }
          ],
          "count": 3
        }
      ],
      "count": 7
    },
    {
      "scene_name": "Example_Scene_2",
      "file_types": [
        {
          "type": ".splat",
          "resolutions": [
            {
              "resolution": "low",
              "filename": "Example_Scene_2_low.splat",
              "size": 8402864,
              "size_mb": 8.01
            },
            {
              "resolution": "full",
              "filename": "Example_Scene_2_full.splat",
              "size": 33611456,
              "size_mb": 32.06
            }
          ],
          "count": 2
        }
      ],
      "count": 2
    }
  ],
  "success": true
}
```

**Required Fields:**

- `scene_name`: Unique identifier for the cultural site
- `file_types`: Array of supported formats (`.splat`, `.ply`, etc.)
- `resolutions`: Available quality levels (`low`, `medium`, `high`, `full`)
- `filename`: Exact filename in S3 bucket
- `size`: File size in bytes
- `size_mb`: File size in megabytes
- `count`: Number of files in each category

**Resolution Guidelines:**

- `low`: ~100-200MB, optimized for mobile devices
- `medium`: ~200-400MB, balanced quality and performance
- `high`: ~400-800MB, high quality for strong GPUs
- `full`: ~800MB+, maximum quality for desktop systems

</details>

### Supported Formats

- `.splat` - Gaussian splat format (preferred for cultural artifacts)
- `.ply` - Point cloud files for archaeological sites

## 🔧 Technical Details

### Core Dependencies

- **React 18** - Modern React with hooks for cultural heritage applications
- **Material-UI 7** - Beautiful UI components for cultural site browsing
- **@mkkellogg/gaussian-splats-3d** - High-quality 3D rendering for cultural artifacts
- **Vite** - Fast build tool for cultural heritage web applications

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Acknowledgments

- [@mkkellogg/gaussian-splats-3d](https://github.com/mkkellogg/GaussianSplats3D) - Core 3D rendering for cultural heritage
- [Material-UI](https://mui.com/) - UI components for cultural site browsing
- [Vite](https://vitejs.dev/) - Fast development for cultural heritage applications
- Cultural heritage institutions and preservation organizations worldwide
