# Majestic Art - Art Gallery & E-Commerce Website

A modern, elegant art gallery and e-commerce website built with React, TypeScript, and Vite. This platform showcases artwork, handles online sales through Stripe, manages commissions, and includes membership features.

## 🎨 Features

- **Art Gallery**: Beautiful showcase of artwork with filtering and search
- **Online Shop**: Secure checkout with Stripe payment integration
- **Commission Services**: Custom artwork commission system with tiered pricing
- **Membership Program**: Subscription-based membership features
- **Newsletter**: Email newsletter signup and management
- **Admin Panel**: Content management and order fulfillment
- **Responsive Design**: Mobile-friendly interface with dark/light theme support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend services)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/armymp33/MajesticArt.git
cd MajesticArt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase and Stripe keys (see setup guides below)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:8080`

## 📚 Setup Guides

This project includes comprehensive setup guides:

- **[SUPABASE_SETUP_STEPS.md](./SUPABASE_SETUP_STEPS.md)** - Database and backend setup
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Payment processing setup
- **[QUICK_STRIPE_SETUP.md](./QUICK_STRIPE_SETUP.md)** - Quick Stripe configuration
- **[MEMBERSHIP_SETUP.md](./MEMBERSHIP_SETUP.md)** - Membership feature setup
- **[SETUP_EMAIL_NOTIFICATIONS.md](./SETUP_EMAIL_NOTIFICATIONS.md)** - Email notification setup
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Admin panel configuration
- **[EDITING_GUIDE.md](./EDITING_GUIDE.md)** - Content editing guide

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── pages/       # Page components
│   └── ui/          # Reusable UI components
├── contexts/        # React contexts (Cart, App, Admin)
├── data/            # Static data (artworks, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utilities (Supabase, Stripe)
├── pages/           # Route pages
└── services/        # API services
```

## 🎨 Customization

See [EDITING_GUIDE.md](./EDITING_GUIDE.md) for detailed instructions on:
- Editing artwork information
- Updating page content
- Changing colors and styling
- Adding images

## 🔒 Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**⚠️ Never commit `.env` files to version control!**

## 🤝 Contributing

This is a collaborative project. When making changes:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## 📝 License

Private project - All rights reserved

## 👨‍💻 Development

Built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Stripe
- React Router

---

For detailed editing instructions, see [EDITING_GUIDE.md](./EDITING_GUIDE.md)
