# MoodTracker - Mental Health & Wellness Web Application

A comprehensive React-based web application for tracking daily moods, understanding emotional patterns, and gaining insights into mental well-being.

## 🌟 Features

### Core Functionality
- **Daily Mood Tracking**: Select from 5 mood levels with emoji indicators
- **Journal Notes**: Add personal reflections and thoughts
- **Tag System**: Categorize moods by factors (work, sleep, exercise, etc.)
- **Calendar View**: Visual monthly overview of mood patterns
- **Analytics Dashboard**: Charts and insights showing mood trends
- **Data Export**: Download your data as JSON for backup

### User Experience
- **Dark/Light Mode**: Toggle between themes for comfort
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Local Storage**: All data stays private in your browser
- **Clean UI**: Calming, minimal design with mood-based colors
- **Accessibility**: Built with accessibility best practices

### Privacy & Security
- **100% Local**: No data sent to external servers
- **No Tracking**: No analytics or third-party services
- **Data Control**: Export or delete your data anytime
- **Secure**: Client-side only application

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mood-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation

### Styling & Design
- **Custom Color Palette** - Mood-based color system
- **Typography** - Inter + Playfair Display fonts
- **Animations** - Smooth transitions and micro-interactions
- **Responsive Grid** - Mobile-first design approach

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   └── Sidebar.js      # Navigation sidebar
├── context/            # React Context providers
│   ├── MoodContext.js  # Mood data management
│   └── ThemeContext.js # Theme switching
├── pages/              # Main application pages
│   ├── Dashboard.js    # Overview and quick actions
│   ├── MoodEntry.js    # Add new mood entries
│   ├── Analytics.js    # Charts and insights
│   ├── Calendar.js     # Monthly mood calendar
│   └── Settings.js     # App settings and data management
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and Tailwind
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main UI elements
- **Secondary**: Green tones for positive actions
- **Accent**: Purple tones for highlights
- **Mood Colors**: 
  - Excellent: Green (#10B981)
  - Good: Light Green (#34D399)
  - Okay: Yellow (#FBBF24)
  - Bad: Light Red (#F87171)
  - Terrible: Red (#EF4444)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **UI Elements**: Inter with various weights

## 📊 Data Structure

### Mood Entry
```javascript
{
  id: timestamp,
  date: "YYYY-MM-DD",
  timestamp: "ISO string",
  mood: 1-5,
  note: "string",
  tags: ["array", "of", "strings"]
}
```

### Local Storage
- `moodEntries`: Array of mood entry objects
- `darkMode`: Boolean for theme preference

## 🔧 Customization

### Adding New Mood Tags
Edit `MOOD_TAGS` array in `src/context/MoodContext.js`:
```javascript
export const MOOD_TAGS = [
  'Work', 'Sleep', 'Exercise', 'Food', 'Social', 'Weather',
  'Health', 'Stress', 'Family', 'Hobbies', 'Travel', 'Money',
  'YourNewTag' // Add here
];
```

### Modifying Mood Levels
Update `MOOD_LEVELS` object in `src/context/MoodContext.js`:
```javascript
export const MOOD_LEVELS = {
  5: { label: 'Excellent', emoji: '😄', color: 'mood-excellent' },
  // ... modify as needed
};
```

### Styling Changes
- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Individual component files

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set up continuous deployment from your Git repository

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect React and build
3. Deploy with zero configuration

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/mood-tracker-app",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the comprehensive icon library
- **React Team** for the amazing framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Built with ❤️ for mental health awareness and personal well-being tracking.**