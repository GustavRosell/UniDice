# 🎲 Dice Roller Web App

A modern, responsive dice roller web app built with Next.js, React, and Tailwind CSS. Features PWA support for installation on mobile devices and desktop.

## ✨ Features

### Core Features
- ✅ **Standard Dice**: Roll d4, d6, d8, d10, d12, d20
- ✅ **Custom Dice**: Create dice with custom values (colors, directions, etc.)
- ✅ **Delete Custom Dice**: Remove unwanted custom dice
- ✅ **Roll History**: Track and view your recent rolls with timestamps
- ✅ **Responsive Design**: Works perfectly on mobile and desktop
- ✅ **PWA Support**: Installable on iOS/Android devices
- ✅ **Local Storage**: Persists your custom dice and roll history

### Game Templates
- ✅ **Meyer**: Traditional Danish dice game (2-4 players)
- ✅ **Yahtzee**: Classic scoring dice game (1-10 players)
- ✅ **Color Game**: Simple color-based dice game (2-6 players)
- ✅ **Extensible**: Easy to add more games in the future

### Stretch Goals (Coming Soon)
- 🔄 **Custom Game Templates**: Create your own game templates
- 🔄 **Multiplayer Support**: Real-time multiplayer games
- 🔄 **Advanced Statistics**: Detailed roll analytics
- 🔄 **Dice Animations**: Smooth rolling animations
- 🔄 **Sound Effects**: Audio feedback for rolls

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: next-pwa
- **Deployment**: Ready for Vercel/Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dice-roller-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen" or "Install App"
4. The app will now appear on your home screen

### On Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Click "Install" to add to your desktop

## 🎮 How to Use

### Rolling Dice
1. **Standard Dice**: Tap any standard die (D4, D6, D8, etc.) to roll
2. **Quick Roll**: Use the quick roll buttons for common dice (D6, D20, D100)
3. **Custom Dice**: Create and roll your own custom dice

### Creating Custom Dice
1. Go to the "Custom" tab
2. Tap the "+" button
3. Enter a name for your dice
4. Choose a color
5. Add sides with custom values (e.g., "Red", "Blue", "Green")
6. Tap "Create Dice"

### Playing Games
1. Go to the "Games" tab
2. Choose a game template
3. Tap "Start Game"
4. Follow the game rules displayed

### Viewing History
1. Go to the "History" tab
2. View your recent rolls with timestamps
3. See statistics about your rolling activity
4. Clear history if needed

## 🎨 Customization

### Adding New Game Templates
Edit `src/components/GameTemplates.tsx` and add new templates to the `defaultGameTemplates` array:

```typescript
{
  id: 'your-game',
  name: 'Your Game Name',
  description: 'Game description',
  dice: [/* dice array */],
  rules: 'Game rules here',
  minPlayers: 2,
  maxPlayers: 4,
}
```

### Styling
The app uses Tailwind CSS. Modify `src/app/globals.css` or component classes to customize the appearance.

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify

### Other Platforms
The app is compatible with any static hosting service that supports Next.js.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- PWA support with [next-pwa](https://github.com/shadowwalker/next-pwa)

---

**Enjoy rolling! 🎲** 