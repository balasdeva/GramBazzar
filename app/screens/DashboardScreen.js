import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import BottomNavWrapper from '../DynamicBottomNav';

import { BannerShimmer, CategoryShimmer } from '../components/Shimmer';
import { apiService } from '../config/api';

// Generate light unique colors for categories
const generateLightColor = (index) => {
  const colors = [
    '#FFE5E5', '#E5F5FF', '#FFF5E5', '#E5FFE5', '#F5E5FF',
    '#FFE5F5', '#E5FFFF', '#FFFFE5', '#F5FFE5', '#E5F5F5',
    '#FFE5EE', '#EEE5FF', '#E5FFEE', '#FFEEEE', '#EEF5FF',
    '#FFF5EE', '#F5FFEE', '#EEE5F5', '#E5EEFF', '#F5E5EE',
    '#FFEEE5', '#E5FFEE', '#EEE5EE', '#F5F5E5', '#E5F5EE',
    '#FFE5DD', '#E5DDFF', '#DDEEFF', '#FFDDEE', '#EEFFDD',
    '#FFDDDD', '#DDFFF5', '#F5DDFF', '#DDFFDD', '#FFEEAA',
  ];
  return colors[index % colors.length];
};

export default function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategoryList();
      
      if (response.success && response.data) {
        // Map API data to component format with colors
        const formattedCategories = response.data.map((cat, index) => ({
          id: cat.categoryId,
          name: cat.categoryNameGujarati,
          icon: cat.categoryIcon || '📦',
          categoryId: cat.categoryId,
          color: generateLightColor(index),
        }));
        setCategories(formattedCategories);
      } else {
        setAlertConfig({
  visible: true,
  title: 'ભૂલ',
  message: 'શ્રેણીઓ લોડ કરવામાં નિષ્ફળ',
  buttons: [
    { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
  ],
  type: 'error'
});

      }
    } catch (error) {
  console.error('Error fetching categories:', error);
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'શ્રેણીઓ લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'error'
  });
}
finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.name);
    navigation.navigate('PostListing', { 
      category: category.name,
      categoryId: category.categoryId
    });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>લોકબજાર</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Favorites')}
            >
              <Text style={styles.iconText}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="શોધો..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        {loading ? (
          <BannerShimmer />
        ) : (
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerText}>🛒 લોકબજાર!</Text>
              <Text style={styles.bannerSubtext}>
                તમારી જરૂરિયાત, અમારી સેવા
              </Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200' }}
              style={styles.bannerImage}
            />
          </View>
        )}

        {/* Categories Grid */}
        {loading ? (
          <CategoryShimmer />
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                activeOpacity={0.8}
                onPress={() => handleCategoryClick(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>ઝડપથી</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreatePost')}>
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionText}>જાહેરાત મૂકો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>ભાવ જાણો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🌤️</Text>
              <Text style={styles.actionText}>હવામાન</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('LocalCardHome')}
            >
              <Text style={styles.actionIcon}>💼</Text>
              <Text style={styles.actionText}>સ્થાનિક કાર્ડ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>
            🏠
          </Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
            હોમ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <View style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.navText}>જાહેરાત કરો</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.navIcon, activeTab === 'favorites' && styles.navIconActive]}>
            ❤️
          </Text>
          <Text style={[styles.navText, activeTab === 'favorites' && styles.navTextActive]}>
            સાચવેલું
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={[styles.navIcon, activeTab === 'account' && styles.navIconActive]}>
            👤
          </Text>
          <Text style={[styles.navText, activeTab === 'account' && styles.navTextActive]}>
            એકાઉન્ટ
          </Text>
        </TouchableOpacity>
      </View> */}
      <BottomNavWrapper navigation={navigation} activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 125,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#FBC02D',
  },
  bannerContent: {
    flex: 1,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 5,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#F57F17',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom:-200,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});