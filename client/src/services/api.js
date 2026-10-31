import axios from 'axios';
import { initialPlaces, initialReviews, initialUsers } from './demoData';

const isGitHubPages =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || !window.location.port);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || (isGitHubPages ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Request interceptor: automatically append token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessable_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for Mock Fallback in Static GitHub Pages Environment
const getMockPlaces = () => {
  const custom = JSON.parse(localStorage.getItem('accessable_custom_places') || '[]');
  return [...custom, ...initialPlaces];
};

const getMockFavorites = () => {
  return JSON.parse(localStorage.getItem('accessable_user_favorites') || '[]');
};

const getMockReviews = () => {
  const custom = JSON.parse(localStorage.getItem('accessable_custom_reviews') || '[]');
  return [...custom, ...initialReviews];
};

// Response interceptor: if remote server fails or in GitHub Pages, seamlessly fallback to local state
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If running on GitHub Pages or server offline, mock the response so the demo works 100%
    const config = error.config;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    console.warn(`[AccessAble Demo Adapter] Remote call ${method.toUpperCase()} ${url} fell back to offline demo storage.`);

    // 1. Auth: Login
    if (url.includes('/auth/login') && method === 'post') {
      const { email } = JSON.parse(config.data || '{}');
      const foundUser =
        initialUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) ||
        initialUsers[1];

      return {
        data: {
          success: true,
          token: 'demo_jwt_token_' + foundUser._id,
          user: foundUser,
        },
      };
    }

    // 2. Auth: Register
    if (url.includes('/auth/register') && method === 'post') {
      const data = JSON.parse(config.data || '{}');
      const newUser = {
        _id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'user',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        bio: data.bio || '',
        accessibilityNeeds: data.accessibilityNeeds || [],
        createdAt: new Date().toISOString(),
      };
      return {
        data: {
          success: true,
          token: 'demo_jwt_token_' + newUser._id,
          user: newUser,
        },
      };
    }

    // 3. Auth: Current User /auth/me
    if (url.includes('/auth/me') && method === 'get') {
      const storedUser = JSON.parse(localStorage.getItem('accessable_current_user') || 'null');
      const currentUser = storedUser || initialUsers[0];
      return {
        data: {
          success: true,
          user: currentUser,
        },
      };
    }

    // 4. Auth: Profile Update
    if (url.includes('/auth/profile') && method === 'put') {
      const updates = JSON.parse(config.data || '{}');
      const storedUser = JSON.parse(localStorage.getItem('accessable_current_user') || 'null') || initialUsers[0];
      const updatedUser = { ...storedUser, ...updates };
      localStorage.setItem('accessable_current_user', JSON.stringify(updatedUser));
      return {
        data: {
          success: true,
          message: 'Profile updated successfully!',
          user: updatedUser,
        },
      };
    }

    // 5. Places: Single Place /places/:id
    if (url.match(/\/places\/[a-zA-Z0-9_-]+$/) && method === 'get') {
      const placeId = url.split('/').pop();
      const allPlaces = getMockPlaces();
      const place = allPlaces.find((p) => p._id === placeId) || allPlaces[0];
      const allReviews = getMockReviews();
      const placeReviews = allReviews.filter((r) => r.place?._id === place._id || r.place === place._id);
      return {
        data: {
          success: true,
          place,
          reviews: placeReviews,
        },
      };
    }

    // 6. Places: Search, filter, list /places
    if (url.startsWith('/places') && method === 'get' && !url.includes('/user/my-places')) {
      const urlObj = new URL(url, 'http://localhost');
      const search = urlObj.searchParams.get('search')?.toLowerCase();
      const category = urlObj.searchParams.get('category');
      const featuresStr = urlObj.searchParams.get('features');
      const features = featuresStr ? featuresStr.split(',').map((f) => f.trim()) : [];
      const minRating = Number(urlObj.searchParams.get('minRating')) || 0;

      let list = getMockPlaces().filter((p) => p.status === 'approved' || !p.status);

      if (search) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.address.toLowerCase().includes(search) ||
            p.city.toLowerCase().includes(search)
        );
      }

      if (category && category !== 'All') {
        list = list.filter((p) => p.category === category);
      }

      if (features.length > 0) {
        list = list.filter((p) =>
          features.every((f) => p.accessibilityFeatures?.includes(f))
        );
      }

      if (minRating > 0) {
        list = list.filter((p) => (p.averageRating || 0) >= minRating);
      }

      return {
        data: {
          success: true,
          count: list.length,
          total: list.length,
          totalPages: 1,
          currentPage: 1,
          places: list,
        },
      };
    }

    // 7. Places: Suggest/Create Place /places
    if (url === '/places' && method === 'post') {
      const newPlaceData = JSON.parse(config.data || '{}');
      const newPlace = {
        _id: 'custom_' + Date.now(),
        ...newPlaceData,
        averageRating: 5.0,
        reviewCount: 0,
        status: 'approved', // Auto approved for demo
        createdAt: new Date().toISOString(),
      };
      const customPlaces = JSON.parse(localStorage.getItem('accessable_custom_places') || '[]');
      customPlaces.unshift(newPlace);
      localStorage.setItem('accessable_custom_places', JSON.stringify(customPlaces));
      return {
        data: {
          success: true,
          message: 'Place submitted and published successfully!',
          place: newPlace,
        },
      };
    }

    // 8. Places: User My Places
    if (url.includes('/places/user/my-places')) {
      const customPlaces = JSON.parse(localStorage.getItem('accessable_custom_places') || '[]');
      return {
        data: {
          success: true,
          places: customPlaces,
        },
      };
    }

    // 9. Favorites: Check
    if (url.includes('/favorites/check/')) {
      const placeId = url.split('/').pop();
      const favs = getMockFavorites();
      const isFav = favs.some((f) => f.place?._id === placeId || f.place === placeId);
      return {
        data: {
          success: true,
          isFavorite: isFav,
        },
      };
    }

    // 10. Favorites: Get all
    if (url === '/favorites' && method === 'get') {
      const favs = getMockFavorites();
      return {
        data: {
          success: true,
          favorites: favs,
        },
      };
    }

    // 11. Favorites: Add
    if (url.includes('/favorites/') && method === 'post') {
      const placeId = url.split('/').pop();
      const allPlaces = getMockPlaces();
      const place = allPlaces.find((p) => p._id === placeId) || allPlaces[0];
      const favs = getMockFavorites();
      if (!favs.some((f) => f.place?._id === placeId)) {
        favs.push({ _id: 'fav_' + Date.now(), place });
        localStorage.setItem('accessable_user_favorites', JSON.stringify(favs));
      }
      return {
        data: {
          success: true,
          message: 'Place saved to favorites!',
        },
      };
    }

    // 12. Favorites: Remove
    if (url.includes('/favorites/') && method === 'delete') {
      const placeId = url.split('/').pop();
      let favs = getMockFavorites();
      favs = favs.filter((f) => f.place?._id !== placeId && f.place !== placeId);
      localStorage.setItem('accessable_user_favorites', JSON.stringify(favs));
      return {
        data: {
          success: true,
          message: 'Removed from favorites.',
        },
      };
    }

    // 13. Reviews: Post Review
    if (url.match(/\/reviews\/[a-zA-Z0-9_-]+$/) && method === 'post') {
      const placeId = url.split('/').pop();
      const revData = JSON.parse(config.data || '{}');
      const newRev = {
        _id: 'rev_' + Date.now(),
        place: placeId,
        user: initialUsers[0],
        rating: revData.rating,
        comment: revData.comment,
        accessibilityHighlights: revData.accessibilityHighlights || [],
        experienceDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString(),
      };
      const customReviews = JSON.parse(localStorage.getItem('accessable_custom_reviews') || '[]');
      customReviews.unshift(newRev);
      localStorage.setItem('accessable_custom_reviews', JSON.stringify(customReviews));
      return {
        data: {
          success: true,
          message: 'Review posted successfully!',
          review: newRev,
        },
      };
    }

    // 14. Reviews: User Reviews
    if (url.includes('/reviews/user/my-reviews')) {
      const customReviews = JSON.parse(localStorage.getItem('accessable_custom_reviews') || '[]');
      return {
        data: {
          success: true,
          reviews: customReviews,
        },
      };
    }

    // 15. Admin: Stats
    if (url.includes('/admin/stats')) {
      const allPlaces = getMockPlaces();
      return {
        data: {
          success: true,
          stats: {
            totalPlaces: allPlaces.length,
            pendingPlaces: 1,
            totalUsers: 3,
            totalReviews: 8,
            totalReports: 0,
          },
        },
      };
    }

    // 16. Admin: Pending places
    if (url.includes('/admin/places/pending')) {
      const allPlaces = getMockPlaces();
      const pending = allPlaces.filter((p) => p.status === 'pending');
      return {
        data: {
          success: true,
          places: pending.length > 0 ? pending : [allPlaces[allPlaces.length - 1]],
        },
      };
    }

    // 17. Admin: Users
    if (url.includes('/admin/users')) {
      return {
        data: {
          success: true,
          users: initialUsers,
        },
      };
    }

    // Default error passthrough if unhandled
    return Promise.reject(error);
  }
);

export default api;
