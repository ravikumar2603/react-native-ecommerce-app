import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
  StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';

// ─── Cart Context ───────────────────────────────────────────────
const CartContext = React.createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.some(i => i.id === action.payload.id);
      if (exists) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = React.useReducer(cartReducer, { items: [] });
  const toggleItem = (product) => dispatch({ type: 'TOGGLE', payload: product });
  const isInCart = (id) => state.items.some(i => i.id === id);
  const totalItems = () => state.items.length;
  const cartTotal = () => state.items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <CartContext.Provider value={{ items: state.items, toggleItem, isInCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}
function useCart() { return React.useContext(CartContext); }

// ─── Product Data ───────────────────────────────────────────────
const categories = [
  'Electronics', 'Clothing', 'Home & Kitchen',
  'Books', 'Sports', 'Beauty', 'Toys', 'Grocery', 'Automotive',
];

const products = [
  { id: 1,  name: 'Wireless Headphones',  price: 49.99, category: 'Electronics',  emoji: '🎧', rating: 4.5 },
  { id: 2,  name: 'Smart Watch',           price: 199.99, category: 'Electronics',  emoji: '⌚', rating: 4.7 },
  { id: 3,  name: 'Bluetooth Speaker',     price: 79.99, category: 'Electronics',  emoji: '🔊', rating: 4.3 },
  { id: 4,  name: 'Laptop Stand',          price: 34.99, category: 'Electronics',  emoji: '💻', rating: 4.6 },
  { id: 5,  name: 'USB-C Hub',             price: 45.99, category: 'Electronics',  emoji: '🔌', rating: 4.4 },
  { id: 6,  name: 'Cotton T-Shirt',        price: 19.99, category: 'Clothing',     emoji: '👕', rating: 4.2 },
  { id: 7,  name: 'Denim Jeans',           price: 59.99, category: 'Clothing',     emoji: '👖', rating: 4.5 },
  { id: 8,  name: 'Running Shoes',         price: 89.99, category: 'Clothing',     emoji: '👟', rating: 4.8 },
  { id: 9,  name: 'Winter Jacket',         price: 129.99, category: 'Clothing',    emoji: '🧥', rating: 4.6 },
  { id: 10, name: 'Wool Sweater',          price: 49.99, category: 'Clothing',     emoji: '🧶', rating: 4.3 },
  { id: 11, name: 'Coffee Maker',          price: 69.99, category: 'Home & Kitchen', emoji: '☕', rating: 4.7 },
  { id: 12, name: 'Blender',               price: 44.99, category: 'Home & Kitchen', emoji: '🍹', rating: 4.4 },
  { id: 13, name: 'Knife Set',             price: 89.99, category: 'Home & Kitchen', emoji: '🔪', rating: 4.8 },
  { id: 14, name: 'Throw Pillow',          price: 24.99, category: 'Home & Kitchen', emoji: '🛋️', rating: 4.1 },
  { id: 15, name: 'Scented Candle',        price: 14.99, category: 'Home & Kitchen', emoji: '🕯️', rating: 4.5 },
  { id: 16, name: 'JavaScript Guide',      price: 39.99, category: 'Books',        emoji: '📘', rating: 4.9 },
  { id: 17, name: 'Fiction Novel',         price: 14.99, category: 'Books',        emoji: '📖', rating: 4.6 },
  { id: 18, name: 'Cookbook',              price: 29.99, category: 'Books',        emoji: '📚', rating: 4.4 },
  { id: 19, name: 'Science Encyclopedia',  price: 49.99, category: 'Books',        emoji: '🔬', rating: 4.7 },
  { id: 20, name: 'Art History Book',      price: 34.99, category: 'Books',        emoji: '🎨', rating: 4.5 },
  { id: 21, name: 'Yoga Mat',              price: 29.99, category: 'Sports',       emoji: '🧘', rating: 4.6 },
  { id: 22, name: 'Dumbbells Set',         price: 79.99, category: 'Sports',       emoji: '🏋️', rating: 4.8 },
  { id: 23, name: 'Tennis Racket',         price: 64.99, category: 'Sports',       emoji: '🎾', rating: 4.5 },
  { id: 24, name: 'Water Bottle',          price: 19.99, category: 'Sports',       emoji: '🥤', rating: 4.3 },
  { id: 25, name: 'Jump Rope',             price: 12.99, category: 'Sports',       emoji: '⏱️', rating: 4.2 },
  { id: 26, name: 'Moisturizer',           price: 24.99, category: 'Beauty',       emoji: '🧴', rating: 4.4 },
  { id: 27, name: 'Shampoo Set',           price: 32.99, category: 'Beauty',       emoji: '🧴', rating: 4.6 },
  { id: 28, name: 'Lip Balm Pack',         price: 9.99, category: 'Beauty',        emoji: '💄', rating: 4.3 },
  { id: 29, name: 'Face Mask',             price: 14.99, category: 'Beauty',       emoji: '✨', rating: 4.5 },
  { id: 30, name: 'Nail Polish Set',       price: 18.99, category: 'Beauty',       emoji: '💅', rating: 4.2 },
  { id: 31, name: 'Building Blocks',       price: 34.99, category: 'Toys',         emoji: '🧱', rating: 4.7 },
  { id: 32, name: 'Board Game',            price: 29.99, category: 'Toys',         emoji: '🎲', rating: 4.5 },
  { id: 33, name: 'Remote Car',            price: 44.99, category: 'Toys',         emoji: '🚗', rating: 4.6 },
  { id: 34, name: 'Puzzle Set',            price: 19.99, category: 'Toys',         emoji: '🧩', rating: 4.3 },
  { id: 35, name: 'Stuffed Animal',        price: 24.99, category: 'Toys',         emoji: '🧸', rating: 4.8 },
  { id: 36, name: 'Organic Coffee Beans',  price: 16.99, category: 'Grocery',      emoji: '☕', rating: 4.7 },
  { id: 37, name: 'Mixed Nuts',            price: 12.99, category: 'Grocery',      emoji: '🥜', rating: 4.5 },
  { id: 38, name: 'Green Tea',             price: 9.99, category: 'Grocery',       emoji: '🍵', rating: 4.4 },
  { id: 39, name: 'Dark Chocolate',        price: 7.99, category: 'Grocery',       emoji: '🍫', rating: 4.8 },
  { id: 40, name: 'Honey Jar',             price: 11.99, category: 'Grocery',      emoji: '🍯', rating: 4.6 },
  { id: 41, name: 'Car Phone Mount',       price: 19.99, category: 'Automotive',   emoji: '📱', rating: 4.5 },
  { id: 42, name: 'Dash Camera',           price: 59.99, category: 'Automotive',   emoji: '📹', rating: 4.7 },
  { id: 43, name: 'Tire Gauge',            price: 8.99, category: 'Automotive',    emoji: '🔧', rating: 4.3 },
  { id: 44, name: 'Car Vacuum',            price: 34.99, category: 'Automotive',   emoji: '🧹', rating: 4.4 },
  { id: 45, name: 'Seat Cushion',          price: 27.99, category: 'Automotive',   emoji: '💺', rating: 4.2 },
];

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#ffffff',
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
  cartBtn: { position: 'relative', padding: 4 },
  cartIcon: { fontSize: 26 },
  badge: {
    position: 'absolute', top: -4, right: -6, backgroundColor: '#e74c3c',
    borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center',
    alignItems: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  body: { flex: 1, flexDirection: 'row' },
  // Category panel styles
  catScroll: {
    padding: 10, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderColor: '#ddd',
  },
  catScrollWeb: {
    width: 170, flexDirection: 'column', borderRightWidth: 1, borderColor: '#ddd',
  },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc',
    marginRight: 8, marginBottom: 8,
  },
  catBtnActive: { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  catText: { fontSize: 13, color: '#555' },
  catTextActive: { color: '#fff', fontWeight: '600' },
  // Content area
  content: { flex: 1 },
  section: { paddingVertical: 6 },
  sectionTitle: {
    fontSize: 20, fontWeight: '700', color: '#1a1a2e',
    padding: 12, paddingBottom: 4,
  },
  product: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, marginHorizontal: 12, marginVertical: 5,
    borderWidth: 1, borderColor: '#e8e8e8',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  productEmoji: { fontSize: 34, marginRight: 14 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#2c3e50' },
  productRating: { fontSize: 12, color: '#f39c12', marginTop: 2 },
  productPrice: { fontSize: 16, fontWeight: '700', color: '#27ae60', marginTop: 2 },
  toggleBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#4A90D9',
    justifyContent: 'center', alignItems: 'center',
  },
  toggleBtnRemove: { backgroundColor: '#e74c3c' },
  toggleText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  // Cart drawer
  drawer: { flex: 1, backgroundColor: '#f8f9fa' },
  drawerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd',
  },
  drawerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  drawerClose: { fontSize: 22, color: '#666', padding: 8 },
  drawerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  drawerEmptyText: { fontSize: 16, color: '#999' },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee',
  },
  drawerFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd',
  },
  drawerTotalLabel: { fontSize: 16, fontWeight: '600', color: '#555' },
  drawerTotalValue: { fontSize: 20, fontWeight: '700', color: '#27ae60' },
});

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const { items, toggleItem, isInCart, totalItems, cartTotal } = useCart();
  const [activeCat, setActiveCat] = useState(categories[0]);
  const [cartOpen, setCartOpen] = useState(false);

  const WIN = Dimensions.get('window');
  const isWide = WIN.width >= 768;

  // Group products by category
  const grouped = {};
  categories.forEach(c => {
    const list = products.filter(p => p.category === c);
    if (list.length) grouped[c] = list;
  });
  const displayCats = Object.keys(grouped);

  // Scroll refs & offset tracking
  const scrollRef = useRef(null);
  const offsets = useRef({});
  const measuring = useRef(false);

  // Click category → scroll to it
  const selectCategory = useCallback((cat) => {
    setActiveCat(cat);
    const y = offsets.current[cat];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  }, []);

  // Measure all sections after render
  React.useEffect(() => {
    measuring.current = true;
  }, [activeCat]);

  React.useEffect(() => {
    if (!measuring.current) return;
    measuring.current = false;
    displayCats.forEach(cat => {
      const ref = sectionRefs.current[cat];
      if (ref && scrollRef.current) {
        ref.measureLayout(
          scrollRef.current,
          (x, y) => { offsets.current[cat] = y; },
          () => {}
        );
      }
    });
  }, [displayCats]);

  const sectionRefs = useRef({});

  // Scroll → update active category
  const onScroll = useCallback((e) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    let current = displayCats[0];
    for (const cat of displayCats) {
      const off = offsets.current[cat];
      if (off !== undefined && off <= scrollY + 5) {
        current = cat;
      }
    }
    setActiveCat(current);
  }, [displayCats]);

  // Render a category section
  const renderSection = (cat) => {
    const catProducts = grouped[cat];
    return (
      <View key={cat} style={styles.section}
        ref={el => { sectionRefs.current[cat] = el; }}>
        <Text style={styles.sectionTitle}>{cat}</Text>
        {catProducts.map(item => (
          <View key={item.id} style={styles.product}>
            <Text style={styles.productEmoji}>{item.emoji}</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productRating}>⭐ {item.rating}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                isInCart(item.id) && styles.toggleBtnRemove,
              ]}
              onPress={() => toggleItem(item)}
            >
              <Text style={styles.toggleText}>{isInCart(item.id) ? '−' : '+'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ ShopEasy</Text>
        <TouchableOpacity onPress={() => setCartOpen(true)} style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
          {totalItems() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Category panel — TOP on mobile, LEFT on web */}
        {!isWide && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.catScroll}>
            {displayCats.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, activeCat === cat && styles.catBtnActive]}
                onPress={() => selectCategory(cat)}
              >
                <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isWide && (
          <ScrollView style={styles.catScrollWeb}>
            {displayCats.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, activeCat === cat && styles.catBtnActive]}
                onPress={() => selectCategory(cat)}
              >
                <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Scrollable product content */}
        <ScrollView style={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}>
          {displayCats.map(renderSection)}
        </ScrollView>
      </View>

      {/* Cart Drawer */}
      {cartOpen && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>🛒 Cart ({totalItems()})</Text>
            <TouchableOpacity onPress={() => setCartOpen(false)} style={styles.drawerClose}>
              <Text>✕</Text>
            </TouchableOpacity>
          </View>
          {items.length === 0 ? (
            <View style={styles.drawerEmpty}>
              <Text style={styles.drawerEmptyText}>Your cart is empty</Text>
            </View>
          ) : (
            <ScrollView style={{ flex: 1, padding: 12 }}>
              {items.map(i => (
                <View key={i.id} style={styles.drawerItem}>
                  <Text style={{ fontSize: 28 }}>{i.emoji}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontWeight: '600', fontSize: 14 }}>{i.name}</Text>
                    <Text style={{ color: '#27ae60', fontWeight: '700', marginTop: 2 }}>
                      ${i.price.toFixed(2)} × {i.qty}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.drawerFooter}>
            <Text style={styles.drawerTotalLabel}>Total ({totalItems()} items)</Text>
            <Text style={styles.drawerTotalValue}>${cartTotal().toFixed(2)}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
