# How to Run and Edit Your Daughter's Art Website

## 🚀 Running the Website

The development server should already be running! Here's what you need to know:

### To Start the Server (if it's not running):
```bash
npm run dev
```

### To Access the Website:
Open your web browser and go to:
**http://localhost:8080**

The page will automatically refresh when you make changes to the code!

---

## ✏️ How to Edit Content

### 1. **Edit Artwork Information**
   - **File:** `src/data/artworks.ts`
   - This file contains all the artwork listings, prices, descriptions, and images
   - You can:
     - Change artwork titles, prices, descriptions
     - Update image URLs (or use local images)
     - Add or remove artworks
     - Change availability status

### 2. **Edit Homepage Content**
   - **File:** `src/components/pages/HomePage.tsx`
   - This is the main landing page
   - You can edit:
     - Hero section text (lines 21-27)
     - About section text (lines 89-101)
     - Testimonials (lines 182-194)
     - Button text and links

### 3. **Edit About Page**
   - **File:** `src/components/pages/AboutPage.tsx`
   - Update the artist bio, story, and information

### 4. **Edit Gallery Page**
   - **File:** `src/components/pages/GalleryPage.tsx`
   - Customize how artworks are displayed

### 5. **Edit Shop Page**
   - **File:** `src/components/pages/ShopPage.tsx`
   - Modify the shop layout and product display

### 6. **Edit Commission Page**
   - **File:** `src/components/pages/CommissionPage.tsx`
   - Update commission tiers and pricing
   - Also check `src/data/artworks.ts` for `commissionTiers` (lines 161-207)

### 7. **Edit Navigation & Footer**
   - **Navigation:** `src/components/Navigation.tsx`
   - **Footer:** `src/components/Footer.tsx`

### 8. **Change Colors & Styling**
   - The site uses Tailwind CSS
   - Main colors used:
     - Gold: `#D4AF37`
     - Purple: `#9B86BD`
     - Dark: `#2C2C2C`
     - Light: `#FAF9F6`
   - You can find and replace these color codes throughout the component files

---

## 📁 Key Files Structure

```
src/
├── data/
│   └── artworks.ts          ← All artwork data, prices, commission tiers
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx     ← Main homepage
│   │   ├── AboutPage.tsx    ← About page
│   │   ├── GalleryPage.tsx  ← Gallery page
│   │   ├── ShopPage.tsx     ← Shop page
│   │   └── CommissionPage.tsx ← Commission page
│   ├── Navigation.tsx       ← Top navigation menu
│   └── Footer.tsx           ← Footer
└── App.tsx                  ← Main app file
```

---

## 🖼️ Adding Images

### Option 1: Use Online Images
- Replace the image URLs in `artworks.ts` with your image URLs
- Images should be hosted online (like on Cloudinary, Imgur, or your own server)

### Option 2: Use Local Images
1. Put images in the `public/` folder
2. Reference them as `/your-image-name.png` in the code
3. Example: If you put `artwork1.jpg` in `public/`, use `/artwork1.jpg` as the image path

---

## 🎨 Quick Editing Tips

1. **Save your changes** - The browser will automatically refresh
2. **Check the browser console** - Press F12 to see any errors
3. **Test on mobile** - Use browser dev tools (F12) to test mobile view
4. **Preview before launching** - Use `npm run build` then `npm run preview` to see production version

---

## 🛠️ Useful Commands

- `npm run dev` - Start development server (auto-refresh on changes)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check for code errors

---

## 📝 Common Edits

### Change Hero Image:
Edit `heroImage` in `src/data/artworks.ts` (line 148)

### Change Artist Bio:
Edit the About section in `src/components/pages/HomePage.tsx` (lines 89-101)

### Update Prices:
Edit the `price` field for each artwork in `src/data/artworks.ts`

### Change Contact Info:
Edit `src/components/Footer.tsx` and `src/components/Navigation.tsx`

---

## 🚨 Important Notes

- Always save files after editing
- The dev server must be running to see changes
- If something breaks, check the browser console (F12) for errors
- Make sure image URLs are valid and accessible

---

## 🎯 Next Steps

1. ✅ Server is running - check http://localhost:8080
2. Edit content in the files listed above
3. Test all pages and links
4. When ready, run `npm run build` to create production files
5. Deploy to your hosting service (Vercel, Netlify, etc.)

Happy editing! 🎨

