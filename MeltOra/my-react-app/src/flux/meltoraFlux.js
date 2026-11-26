import { useReducer, useCallback, useMemo } from "react";
import {
  buildProductWhatsAppMessage,
  getWhatsAppRedirectUrl,
} from "../utils/whatsapp";
import { isAdminPath, readRouteFromUrl, syncUrlWithRoute } from "../utils/qr";

const ADMIN_TOKEN_KEY = "meltora_admin_token";

export const ActionTypes = {
  NAVIGATE: "NAVIGATE",
  SET_EXPLORE_CATEGORY: "SET_EXPLORE_CATEGORY",

  ADMIN_AUTH_CHECKING: "ADMIN_AUTH_CHECKING",
  ADMIN_LOGIN_SUCCESS: "ADMIN_LOGIN_SUCCESS",
  ADMIN_LOGIN_ERROR: "ADMIN_LOGIN_ERROR",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",

  SET_HERO_SLIDE: "SET_HERO_SLIDE",
  NEXT_HERO_SLIDE: "NEXT_HERO_SLIDE",
  PREV_HERO_SLIDE: "PREV_HERO_SLIDE",
  SET_HERO_ANIMATION: "SET_HERO_ANIMATION",
  TOGGLE_HERO_AUTOPLAY: "TOGGLE_HERO_AUTOPLAY",
  UPDATE_HERO_SLIDE: "UPDATE_HERO_SLIDE",

  OPEN_DRAWER: "OPEN_DRAWER",
  OPEN_ORDER_SHEET: "OPEN_ORDER_SHEET",
  CLOSE_ALL_OVERLAYS: "CLOSE_ALL_OVERLAYS",

  OPEN_ORDERS_MODAL: "OPEN_ORDERS_MODAL",
  CLOSE_ORDERS_MODAL: "CLOSE_ORDERS_MODAL",
  ORDERS_LOADED: "ORDERS_LOADED",
  ORDER_DELETED: "ORDER_DELETED",
  ORDERS_CLEARED: "ORDERS_CLEARED",

  OPEN_CUSTOMIZER: "OPEN_CUSTOMIZER",
  CLOSE_CUSTOMIZER: "CLOSE_CUSTOMIZER",
  SET_CUSTOMIZER_TAB: "SET_CUSTOMIZER_TAB",

  HOME_DATA_LOADING: "HOME_DATA_LOADING",
  HOME_DATA_SUCCESS: "HOME_DATA_SUCCESS",
  HOME_DATA_ERROR: "HOME_DATA_ERROR",

  PRODUCT_ADDED: "PRODUCT_ADDED",
  PRODUCT_DELETED: "PRODUCT_DELETED",
  SETTINGS_UPDATED: "SETTINGS_UPDATED",

  ORDER_SUBMITTING: "ORDER_SUBMITTING",
  ORDER_CREATED: "ORDER_CREATED",
  SHOW_TOAST: "SHOW_TOAST",
  HIDE_TOAST: "HIDE_TOAST",
};

export const defaultHeroSlides = [
  {
    id: 0,
    theme: "chocolate",
    brand: "Meltora",
    titleWhite: "Richness",
    titleGold: "in Every Bite",
    line1: "Artisanal Crafted Chocolates",
    line2: "Indulgent & Velvety Smooth",
    customImageUrl: "",
  },
  {
    id: 1,
    theme: "ghee",
    brand: "Meltora",
    titleWhite: "Purity",
    titleGold: "in Every Drop",
    line1: "Traditional Bilona Desi Ghee",
    line2: "Pure Aroma & Golden Nutrition",
    customImageUrl: "",
  },
  {
    id: 2,
    theme: "combo",
    brand: "Meltora",
    titleWhite: "Scan &",
    titleGold: "Explore Brand",
    line1: "Chocolates & Pure Desi Ghee",
    line2: "Direct WhatsApp Chat & Call",
    customImageUrl: "",
  },
];

const defaultChocolates = [
  {
    id: "cadbury",
    category: "chocolate",
    line1: "Cadbury",
    line2: "Dairy Milk",
    full_name: "Cadbury Dairy Milk",
    fullName: "Cadbury Dairy Milk",
    price: 80,
    weight: "150g Pack",
    description: "Smooth & creamy milk chocolate crafted for everyday celebrations and gifting.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "amul-choco",
    category: "chocolate",
    line1: "Amul",
    line2: "Dark Chocolate",
    full_name: "Amul Dark Chocolate",
    fullName: "Amul Dark Chocolate",
    price: 110,
    weight: "150g Bar",
    description: "Rich 55% dark cocoa bar made from finest roasted cocoa beans with velvety finish.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "nestle",
    category: "chocolate",
    line1: "Nestlé",
    line2: "Classic",
    full_name: "Nestlé Classic",
    fullName: "Nestlé Classic",
    price: 50,
    weight: "120g Bar",
    description: "Classic melt-in-mouth milk chocolate bar loved across generations.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "hersheys",
    category: "chocolate",
    line1: "Hershey's",
    line2: "Milk Chocolate",
    full_name: "Hershey's Milk Chocolate",
    fullName: "Hershey's Milk Chocolate",
    price: 120,
    weight: "100g Bar",
    description: "Signature creamy milk chocolate with rich caramelized cocoa notes.",
    image_url: "",
    imageUrl: "",
  },
];

const defaultGhees = [
  {
    id: "meltora-ghee",
    category: "ghee",
    line1: "Meltora",
    line2: "Desi Ghee",
    full_name: "Meltora Desi Ghee",
    fullName: "Meltora Desi Ghee",
    price: 650,
    weight: "500ml Glass Jar",
    description: "100% pure traditional Bilona cow desi ghee with rich golden aroma & granular texture.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "patanjali-ghee",
    category: "ghee",
    line1: "Patanjali",
    line2: "Desi Ghee",
    full_name: "Patanjali Desi Ghee",
    fullName: "Patanjali Desi Ghee",
    price: 610,
    weight: "500ml Jar",
    description: "Pure cow desi ghee prepared for daily nutrition, cooking, and festive sweets.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "amul-ghee",
    category: "ghee",
    line1: "Amul",
    line2: "Pure Ghee",
    full_name: "Amul Pure Ghee",
    fullName: "Amul Pure Ghee",
    price: 620,
    weight: "500ml Tin",
    description: "Trusted pure dairy ghee rich in natural aroma and golden richness.",
    image_url: "",
    imageUrl: "",
  },
  {
    id: "gowardhan-ghee",
    category: "ghee",
    line1: "Gowardhan",
    line2: "Desi Ghee",
    full_name: "Gowardhan Desi Ghee",
    fullName: "Gowardhan Desi Ghee",
    price: 640,
    weight: "500ml Jar",
    description: "Traditional cow milk ghee crafted for authentic home-style taste.",
    image_url: "",
    imageUrl: "",
  },
];

function getStoredToken() {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) || "" : "";
  } catch {
    return "";
  }
}

function setStoredToken(token) {
  try {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

const initialRoute = readRouteFromUrl();
const initialIsAdmin = isAdminPath();
const initialToken = initialIsAdmin ? getStoredToken() : "";

export const initialStoreState = {
  isAdmin: initialIsAdmin,
  adminToken: initialToken,
  adminAuthenticated: false,
  adminAuthChecking: Boolean(initialIsAdmin && initialToken),
  adminLoginError: "",
  adminUsername: "",

  backendConnected: false,
  isLoading: false,
  backendError: "",

  currentPage: initialRoute.page,
  selectedProductId: initialRoute.productId,
  scannedProductId: initialRoute.scanId,
  exploreCategory: initialRoute.category || "all",

  chocolateWhatsappNumber: "919876543210",
  gheeWhatsappNumber: "919876543211",
  whatsappRoutingMode: "category",
  whatsappGroupLink: "https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE",
  callNumber: "+919876543210",
  callDisplay: "+91 98765 43210",

  activeSlide: 0,
  heroAnimation: "slide",
  isHeroAutoPlay: true,
  heroAutoPlaySpeed: 4500,
  heroSlides: defaultHeroSlides,

  isDrawerOpen: false,
  isOrderSheetOpen: false,
  isOrdersModalOpen: false,
  isCustomizerOpen: false,
  customizerTab: "addProduct",
  customizerDefaultCategory: "chocolate",

  selectedProduct: null,
  selectedPrice: null,
  selectedCategory: "chocolate",

  isSubmittingOrder: false,
  lastCreatedOrder: null,
  toastMessage: "",
  savedOrders: [],

  chocolates: defaultChocolates,
  ghees: defaultGhees,
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function isLocalDevHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

async function apiFetch(path, options = {}, token = "") {
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const finalOptions = { ...options, headers };
  const resolvedPath =
    !path.startsWith("http") && API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const canFallbackLocal = !path.startsWith("http") && !API_BASE_URL && isLocalDevHost();

  try {
    const res = await fetch(resolvedPath, finalOptions);
    if (res.ok || res.status === 401 || !canFallbackLocal) return res;
    const directRes = await fetch(`http://127.0.0.1:5000${path}`, finalOptions);
    if (directRes.ok || directRes.status === 401) return directRes;
    return res;
  } catch (err) {
    if (canFallbackLocal) {
      return await fetch(`http://127.0.0.1:5000${path}`, finalOptions);
    }
    throw err;
  }
}

function meltoraReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADMIN_AUTH_CHECKING:
      return { ...state, adminAuthChecking: action.payload, adminLoginError: "" };

    case ActionTypes.ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        adminToken: action.payload.token,
        adminUsername: action.payload.username || "biman",
        adminAuthenticated: true,
        adminAuthChecking: false,
        adminLoginError: "",
      };

    case ActionTypes.ADMIN_LOGIN_ERROR:
      return {
        ...state,
        adminAuthChecking: false,
        adminLoginError: action.payload || "Invalid User ID or Password.",
      };

    case ActionTypes.ADMIN_LOGOUT:
      return {
        ...state,
        adminToken: "",
        adminUsername: "",
        adminAuthenticated: false,
        adminAuthChecking: false,
        isDrawerOpen: false,
        isOrdersModalOpen: false,
        isCustomizerOpen: false,
      };

    case ActionTypes.NAVIGATE: {
      const {
        page,
        productId = null,
        scanId = null,
        category = state.exploreCategory,
      } = action.payload;
      return {
        ...state,
        currentPage: page,
        selectedProductId: productId,
        scannedProductId: scanId,
        exploreCategory: category || "all",
        isDrawerOpen: false,
        isOrderSheetOpen: false,
      };
    }

    case ActionTypes.SET_EXPLORE_CATEGORY:
      return { ...state, exploreCategory: action.payload };

    case ActionTypes.HOME_DATA_LOADING:
      return { ...state, isLoading: true, backendError: "" };

    case ActionTypes.HOME_DATA_SUCCESS: {
      const payload = action.payload || {};
      const cfg = payload.config || {};
      const newSlides = payload.heroSlides?.length ? payload.heroSlides : state.heroSlides;
      return {
        ...state,
        isLoading: false,
        backendConnected: true,
        backendError: "",
        chocolates: payload.chocolates?.length ? payload.chocolates : state.chocolates,
        ghees: payload.ghees?.length ? payload.ghees : state.ghees,
        heroSlides: newSlides,
        heroAnimation: payload.heroAnimation || state.heroAnimation,
        chocolateWhatsappNumber: cfg.chocolateWhatsappNumber || state.chocolateWhatsappNumber,
        gheeWhatsappNumber: cfg.gheeWhatsappNumber || state.gheeWhatsappNumber,
        whatsappRoutingMode: cfg.whatsappRoutingMode || state.whatsappRoutingMode,
        whatsappGroupLink: cfg.whatsappGroupLink || state.whatsappGroupLink,
        callNumber: cfg.callNumber || state.callNumber,
        callDisplay: cfg.callDisplay || state.callDisplay,
      };
    }

    case ActionTypes.HOME_DATA_ERROR:
      return {
        ...state,
        isLoading: false,
        backendConnected: false,
        backendError: action.payload,
      };

    case ActionTypes.SET_HERO_SLIDE:
      return { ...state, activeSlide: action.payload };

    case ActionTypes.NEXT_HERO_SLIDE:
      return { ...state, activeSlide: (state.activeSlide + 1) % state.heroSlides.length };

    case ActionTypes.PREV_HERO_SLIDE:
      return {
        ...state,
        activeSlide: (state.activeSlide - 1 + state.heroSlides.length) % state.heroSlides.length,
      };

    case ActionTypes.SET_HERO_ANIMATION:
      return { ...state, heroAnimation: action.payload };

    case ActionTypes.TOGGLE_HERO_AUTOPLAY:
      return { ...state, isHeroAutoPlay: !state.isHeroAutoPlay };

    case ActionTypes.UPDATE_HERO_SLIDE: {
      const { index, updatedFields } = action.payload;
      return {
        ...state,
        heroSlides: state.heroSlides.map((slide, i) =>
          i === index ? { ...slide, ...updatedFields } : slide
        ),
      };
    }

    case ActionTypes.OPEN_DRAWER:
      return { ...state, isDrawerOpen: true, isOrderSheetOpen: false, isOrdersModalOpen: false, isCustomizerOpen: false };

    case ActionTypes.OPEN_ORDER_SHEET:
      return {
        ...state,
        isDrawerOpen: false,
        isOrderSheetOpen: true,
        isOrdersModalOpen: false,
        isCustomizerOpen: false,
        selectedProduct: action.payload?.name || (typeof action.payload === "string" ? action.payload : null),
        selectedPrice: action.payload?.price || null,
        selectedCategory: action.payload?.category || "chocolate",
        lastCreatedOrder: null,
      };

    case ActionTypes.OPEN_ORDERS_MODAL:
      if (!state.isAdmin || !state.adminAuthenticated) return state;
      return { ...state, isOrdersModalOpen: true, isDrawerOpen: false, isOrderSheetOpen: false, isCustomizerOpen: false };

    case ActionTypes.CLOSE_ORDERS_MODAL:
      return { ...state, isOrdersModalOpen: false };

    case ActionTypes.OPEN_CUSTOMIZER:
      if (!state.isAdmin || !state.adminAuthenticated) return state;
      return {
        ...state,
        isCustomizerOpen: true,
        isDrawerOpen: false,
        isOrderSheetOpen: false,
        isOrdersModalOpen: false,
        customizerTab: action.payload?.tab || "addProduct",
        customizerDefaultCategory: action.payload?.defaultCategory || "chocolate",
      };

    case ActionTypes.CLOSE_CUSTOMIZER:
      return { ...state, isCustomizerOpen: false };

    case ActionTypes.SET_CUSTOMIZER_TAB:
      return { ...state, customizerTab: action.payload };

    case ActionTypes.ORDERS_LOADED:
      return { ...state, savedOrders: action.payload || [] };

    case ActionTypes.ORDER_DELETED:
      return {
        ...state,
        savedOrders: state.savedOrders.filter((ord) => ord.id !== action.payload),
      };

    case ActionTypes.ORDERS_CLEARED:
      return { ...state, savedOrders: [] };

    case ActionTypes.PRODUCT_ADDED: {
      const p = action.payload;
      if (p.category === "ghee") {
        return { ...state, ghees: [...state.ghees, p] };
      }
      return { ...state, chocolates: [...state.chocolates, p] };
    }

    case ActionTypes.PRODUCT_DELETED: {
      const { id, category } = action.payload;
      if (category === "ghee") {
        return { ...state, ghees: state.ghees.filter((p) => p.id !== id) };
      }
      return { ...state, chocolates: state.chocolates.filter((p) => p.id !== id) };
    }

    case ActionTypes.SETTINGS_UPDATED:
      return { ...state, ...action.payload };

    case ActionTypes.CLOSE_ALL_OVERLAYS:
      return { ...state, isDrawerOpen: false, isOrderSheetOpen: false, isOrdersModalOpen: false, isCustomizerOpen: false };

    case ActionTypes.ORDER_SUBMITTING:
      return { ...state, isSubmittingOrder: true };

    case ActionTypes.ORDER_CREATED:
      return {
        ...state,
        isSubmittingOrder: false,
        lastCreatedOrder: action.payload,
      };

    case ActionTypes.SHOW_TOAST:
      return { ...state, toastMessage: action.payload };

    case ActionTypes.HIDE_TOAST:
      return { ...state, toastMessage: "" };

    default:
      return state;
  }
}

export function useMeltoraFlux() {
  const [state, dispatch] = useReducer(meltoraReducer, initialStoreState);

  const triggerToast = useCallback((msg) => {
    dispatch({ type: ActionTypes.SHOW_TOAST, payload: msg });
    setTimeout(() => {
      dispatch({ type: ActionTypes.HIDE_TOAST });
    }, 3200);
  }, []);

  const logoutAdmin = useCallback(() => {
    setStoredToken("");
    dispatch({ type: ActionTypes.ADMIN_LOGOUT });
  }, []);

  const verifyAdminSession = useCallback(async () => {
    if (!state.isAdmin) return;
    const token = getStoredToken();
    if (!token) {
      dispatch({ type: ActionTypes.ADMIN_AUTH_CHECKING, payload: false });
      return;
    }

    dispatch({ type: ActionTypes.ADMIN_AUTH_CHECKING, payload: true });
    try {
      const res = await apiFetch("/api/admin/verify", { method: "GET" }, token);
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          dispatch({
            type: ActionTypes.ADMIN_LOGIN_SUCCESS,
            payload: { token, username: data.username },
          });
          return;
        }
      }
    } catch {
      // ignore and clear invalid session
    }
    setStoredToken("");
    dispatch({ type: ActionTypes.ADMIN_LOGOUT });
  }, [state.isAdmin]);

  const loginAdmin = useCallback(
    async ({ username, password }) => {
      dispatch({ type: ActionTypes.ADMIN_AUTH_CHECKING, payload: true });
      try {
        const res = await apiFetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.token) {
          setStoredToken(data.token);
          dispatch({
            type: ActionTypes.ADMIN_LOGIN_SUCCESS,
            payload: { token: data.token, username: data.username },
          });
          triggerToast("🔓 Welcome to MeltOra - Admin!");
          return true;
        }
        dispatch({
          type: ActionTypes.ADMIN_LOGIN_ERROR,
          payload: data.error || "Invalid User ID or Password.",
        });
        return false;
      } catch {
        dispatch({
          type: ActionTypes.ADMIN_LOGIN_ERROR,
          payload: "Backend server unreachable. Start Flask on port 5000.",
        });
        return false;
      }
    },
    [triggerToast]
  );

  const navigateTo = useCallback(
    (page, options = {}) => {
      const next = {
        page,
        productId: options.productId || null,
        scanId: options.scanId || null,
        category: options.category || "all",
      };
      dispatch({ type: ActionTypes.NAVIGATE, payload: next });
      syncUrlWithRoute({ ...next, isAdmin: state.isAdmin });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [state.isAdmin]
  );

  const openProductDetail = useCallback(
    (productOrId, { fromScan = false } = {}) => {
      const pid = typeof productOrId === "string" ? productOrId : productOrId?.id;
      if (!pid) return;
      navigateTo("product", {
        productId: pid,
        scanId: fromScan ? pid : null,
      });
    },
    [navigateTo]
  );

  const setExploreCategory = useCallback((category) => {
    dispatch({ type: ActionTypes.SET_EXPLORE_CATEGORY, payload: category });
  }, []);

  const loadHomeData = useCallback(async () => {
    dispatch({ type: ActionTypes.HOME_DATA_LOADING });
    try {
      const res = await apiFetch("/api/home-data");
      if (!res.ok) throw new Error("Status: " + res.status);
      const data = await res.json();
      dispatch({ type: ActionTypes.HOME_DATA_SUCCESS, payload: data });
    } catch {
      dispatch({
        type: ActionTypes.HOME_DATA_ERROR,
        payload: "Flask backend disconnected. Start 'python app.py' in backend/.",
      });
    }
  }, []);

  const loadSavedOrders = useCallback(async () => {
    try {
      const res = await apiFetch("/api/orders", {}, state.adminToken);
      if (res.status === 401) {
        logoutAdmin();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        dispatch({ type: ActionTypes.ORDERS_LOADED, payload: data.orders || [] });
      }
    } catch (err) {
      console.warn("Failed to load orders from backend", err);
    }
  }, [state.adminToken, logoutAdmin]);

  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        const res = await apiFetch(`/api/orders/${orderId}`, { method: "DELETE" }, state.adminToken);
        if (res.status === 401) {
          logoutAdmin();
          return;
        }
        const data = await res.json();
        if (data.success) {
          dispatch({ type: ActionTypes.ORDER_DELETED, payload: orderId });
          triggerToast("🗑️ Order deleted.");
        }
      } catch {
        triggerToast("⚠️ Could not delete order.");
      }
    },
    [state.adminToken, logoutAdmin, triggerToast]
  );

  const clearAllOrders = useCallback(async () => {
    try {
      const res = await apiFetch("/api/orders", { method: "DELETE" }, state.adminToken);
      if (res.status === 401) {
        logoutAdmin();
        return;
      }
      const data = await res.json();
      if (data.success) {
        dispatch({ type: ActionTypes.ORDERS_CLEARED });
        triggerToast("🗑️ All saved orders cleared.");
      }
    } catch {
      triggerToast("⚠️ Could not clear orders.");
    }
  }, [state.adminToken, logoutAdmin, triggerToast]);

  const selectHeroSlide = useCallback((index) => {
    dispatch({ type: ActionTypes.SET_HERO_SLIDE, payload: index });
  }, []);

  const nextHeroSlide = useCallback(() => {
    dispatch({ type: ActionTypes.NEXT_HERO_SLIDE });
  }, []);

  const prevHeroSlide = useCallback(() => {
    dispatch({ type: ActionTypes.PREV_HERO_SLIDE });
  }, []);

  const setHeroAnimation = useCallback(
    async (animType) => {
      dispatch({ type: ActionTypes.SET_HERO_ANIMATION, payload: animType });
      try {
        const res = await apiFetch(
          "/api/hero-slides",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animation: animType }),
          },
          state.adminToken
        );
        if (res.status === 401) logoutAdmin();
      } catch (e) {
        console.warn("Failed to persist animation preference", e);
      }
    },
    [state.adminToken, logoutAdmin]
  );

  const toggleHeroAutoPlay = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_HERO_AUTOPLAY });
  }, []);

  const updateHeroSlide = useCallback(
    async (index, updatedFields) => {
      dispatch({
        type: ActionTypes.UPDATE_HERO_SLIDE,
        payload: { index, updatedFields },
      });
      const updatedSlides = state.heroSlides.map((s, i) =>
        i === index ? { ...s, ...updatedFields } : s
      );
      try {
        const res = await apiFetch(
          "/api/hero-slides",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slides: updatedSlides }),
          },
          state.adminToken
        );
        if (res.status === 401) {
          logoutAdmin();
          return;
        }
        triggerToast("✅ Hero banner updated & saved!");
      } catch (e) {
        console.warn("Failed to persist hero slides", e);
      }
    },
    [state.heroSlides, state.adminToken, logoutAdmin, triggerToast]
  );

  const openDrawer = useCallback(() => dispatch({ type: ActionTypes.OPEN_DRAWER }), []);
  const openOrderSheet = useCallback(
    (productInfo = null) => dispatch({ type: ActionTypes.OPEN_ORDER_SHEET, payload: productInfo }),
    []
  );
  const openOrdersModal = useCallback(() => {
    dispatch({ type: ActionTypes.OPEN_ORDERS_MODAL });
    loadSavedOrders();
  }, [loadSavedOrders]);
  const closeOrdersModal = useCallback(() => dispatch({ type: ActionTypes.CLOSE_ORDERS_MODAL }), []);

  const openCustomizer = useCallback((tab = "addProduct", defaultCategory = "chocolate") => {
    dispatch({ type: ActionTypes.OPEN_CUSTOMIZER, payload: { tab, defaultCategory } });
  }, []);
  const closeCustomizer = useCallback(() => dispatch({ type: ActionTypes.CLOSE_CUSTOMIZER }), []);
  const setCustomizerTab = useCallback((tab) => dispatch({ type: ActionTypes.SET_CUSTOMIZER_TAB, payload: tab }), []);
  const closeOverlays = useCallback(() => dispatch({ type: ActionTypes.CLOSE_ALL_OVERLAYS }), []);

  const addProduct = useCallback(
    async ({ category, line1, line2, fullName, price, imageUrl, weight, description }) => {
      try {
        const res = await apiFetch(
          "/api/products",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, line1, line2, fullName, price, imageUrl, weight, description }),
          },
          state.adminToken
        );
        if (res.status === 401) {
          logoutAdmin();
          return false;
        }
        const data = await res.json();
        if (data.success && data.product) {
          dispatch({ type: ActionTypes.PRODUCT_ADDED, payload: data.product });
          triggerToast(`✅ Added ${data.product.fullName} to ${category === "ghee" ? "Desi Ghee" : "Chocolates"}!`);
          return true;
        }
        triggerToast("Failed to add product. Please check values.");
        return false;
      } catch {
        triggerToast("⚠️ Backend error. Check if Python server is running.");
        return false;
      }
    },
    [state.adminToken, logoutAdmin, triggerToast]
  );

  const deleteProduct = useCallback(
    async (productId, category) => {
      try {
        const res = await apiFetch(`/api/products/${productId}`, { method: "DELETE" }, state.adminToken);
        if (res.status === 401) {
          logoutAdmin();
          return;
        }
        const data = await res.json();
        if (data.success) {
          dispatch({ type: ActionTypes.PRODUCT_DELETED, payload: { id: productId, category } });
          triggerToast("Product removed successfully.");
        }
      } catch {
        triggerToast("Failed to delete product.");
      }
    },
    [state.adminToken, logoutAdmin, triggerToast]
  );

  const saveStoreSettings = useCallback(
    async (newSettings) => {
      dispatch({ type: ActionTypes.SETTINGS_UPDATED, payload: newSettings });
      try {
        const res = await apiFetch(
          "/api/settings",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSettings),
          },
          state.adminToken
        );
        if (res.status === 401) {
          logoutAdmin();
          return false;
        }
        const data = await res.json();
        if (data.success) {
          triggerToast("✅ WhatsApp & Call settings saved!");
          return true;
        }
      } catch {
        triggerToast("⚠️ Saved locally (backend offline).");
      }
      return false;
    },
    [state.adminToken, logoutAdmin, triggerToast]
  );

  const redirectToWhatsApp = useCallback(
    ({
      product = null,
      category = "chocolate",
      quantity = 1,
      customerName = "",
      forceMode = null,
      fromScan = false,
    } = {}) => {
      const resolvedCategory = product?.category || category || "chocolate";
      const message = product
        ? buildProductWhatsAppMessage({ product, quantity, customerName, fromScan })
        : `Hello MeltOra! I'd like to explore & order your ${
            resolvedCategory === "ghee" ? "Pure Desi Ghee" : "Artisanal Chocolates"
          }.`;

      const url = getWhatsAppRedirectUrl({
        category: resolvedCategory,
        routingMode: state.whatsappRoutingMode,
        chocolateWhatsappNumber: state.chocolateWhatsappNumber,
        gheeWhatsappNumber: state.gheeWhatsappNumber,
        whatsappGroupLink: state.whatsappGroupLink,
        message,
        forceMode,
      });

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(message).catch(() => {});
      }

      window.open(url, "_blank", "noopener,noreferrer");

      const prodName =
        product?.fullName ||
        product?.full_name ||
        `MeltOra ${resolvedCategory === "ghee" ? "Desi Ghee" : "Chocolate"} Inquiry`;

      apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName?.trim() || (fromScan ? "QR Scan Visitor" : "Direct WhatsApp Visitor"),
          productName: prodName,
          category: resolvedCategory,
          quantity,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res?.success) {
            dispatch({ type: ActionTypes.ORDER_CREATED, payload: res });
            triggerToast(`💬 Opening WhatsApp • Ref ${res.orderCode}`);
            if (state.isAdmin && state.adminAuthenticated) loadSavedOrders();
          }
        })
        .catch(() => {
          triggerToast("💬 Redirecting to WhatsApp...");
        });
    },
    [
      state.isAdmin,
      state.adminAuthenticated,
      state.whatsappRoutingMode,
      state.chocolateWhatsappNumber,
      state.gheeWhatsappNumber,
      state.whatsappGroupLink,
      triggerToast,
      loadSavedOrders,
    ]
  );

  const actions = useMemo(
    () => ({
      verifyAdminSession,
      loginAdmin,
      logoutAdmin,
      navigateTo,
      openProductDetail,
      setExploreCategory,
      loadHomeData,
      loadSavedOrders,
      deleteOrder,
      clearAllOrders,
      selectHeroSlide,
      nextHeroSlide,
      prevHeroSlide,
      setHeroAnimation,
      toggleHeroAutoPlay,
      updateHeroSlide,
      openDrawer,
      openOrderSheet,
      openOrdersModal,
      closeOrdersModal,
      openCustomizer,
      closeCustomizer,
      setCustomizerTab,
      closeOverlays,
      addProduct,
      deleteProduct,
      saveStoreSettings,
      redirectToWhatsApp,
    }),
    [
      verifyAdminSession,
      loginAdmin,
      logoutAdmin,
      navigateTo,
      openProductDetail,
      setExploreCategory,
      loadHomeData,
      loadSavedOrders,
      deleteOrder,
      clearAllOrders,
      selectHeroSlide,
      nextHeroSlide,
      prevHeroSlide,
      setHeroAnimation,
      toggleHeroAutoPlay,
      updateHeroSlide,
      openDrawer,
      openOrderSheet,
      openOrdersModal,
      closeOrdersModal,
      openCustomizer,
      closeCustomizer,
      setCustomizerTab,
      closeOverlays,
      addProduct,
      deleteProduct,
      saveStoreSettings,
      redirectToWhatsApp,
    ]
  );

  return { state, actions };
}
