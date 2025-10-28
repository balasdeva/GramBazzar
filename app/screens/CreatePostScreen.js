import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlert from '../components/CustomeAlert';
import { apiService } from '../config/api';
import BottomNavWrapper from '../DynamicBottomNav';
// Generate light unique colors for categories
const generateLightColor = (index) => {
  const colors = [
    '#FFE5E5', '#E5F5FF', '#FFF5E5', '#E5FFE5', '#F5E5FF',
    '#FFE5F5', '#E5FFFF', '#FFFFE5', '#F5FFE5', '#E5F5F5',
    '#FFE5EE', '#EEE5FF', '#E5FFEE', '#FFEEEE', '#EEF5FF',
    '#FFF5EE', '#F5FFEE', '#EEE5F5', '#E5EEFF', '#F5E5EE',
  ];
  return colors[index % colors.length];
};

export default function CreatePostScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
   const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'info'
  });
  // Dynamic fields
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  // Function to clear all form data
  const clearForm = () => {
    setSelectedCategory(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setImages([]);
    setYear('');
    setKilometers('');
    setBreed('');
    setAge('');
  };

  useEffect(() => {
    fetchCategories();

    // Add listener to clear form when screen comes into focus from Account screen
    const unsubscribe = navigation.addListener('focus', () => {
      // Check if we're coming from Account screen via bottom nav
      // This ensures form is cleared when user navigates back
      const routes = navigation.getState()?.routes;
      const currentIndex = navigation.getState()?.index;

      if (routes && currentIndex > 0) {
        const previousRoute = routes[currentIndex - 1];
        if (previousRoute?.name === 'Account') {
          // User is navigating from Account, clear the form
          clearForm();
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiService.getCategoryList();

      if (response.success && response.data) {
        // Map API data to component format with colors
        const formattedCategories = response.data.map((cat, index) => ({
          id: cat.categoryId,
          name: cat.categoryNameGujarati,
          nameEnglish: cat.categoryNameEnglish,
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
          buttons: [{ text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }],
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

    } finally {
      setCategoriesLoading(false);
    }
  };

  const selectedCategoryData = selectedCategory;

  // Image picker function
//   const handleImagePick = async () => {
//     if (images.length >= 4) {
//       Alert.alert('મર્યાદા પૂર્ણ', 'તમે મહત્તમ 4 ફોટો પસંદ કરી શકો છો');
//       return;
//     }

//     // Request permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('પરવાનગી જરૂરી', 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો');
//       return;
//     }

//     // Launch image picker
//    const result = await ImagePicker.launchImageLibraryAsync({
//   mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Correct for expo-image-picker v17
//   allowsMultipleSelection: true,
//   selectionLimit: 4 - images.length,
//   quality: 0.8,
//   aspect: [4, 3],
// });


//     if (!result.canceled) {
//       const newImages = result.assets.map(asset => ({
//         uri: asset.uri,
//         type: asset.type || 'image/jpeg',
//         fileName: asset.fileName || `image_${Date.now()}.jpg`,
//       }));
      
//       setImages([...images, ...newImages].slice(0, 4));
//     }
//   };

// const handleImagePick = async () => {
//   if (images.length >= 4) {
//     Alert.alert('મર્યાદા પૂર્ણ', 'તમે મહત્તમ 4 ફોટો પસંદ કરી શકો છો');
//     return;
//   }

//   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (status !== 'granted') {
//     Alert.alert('પરવાનગી જરૂરી', 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો');
//     return;
//   }

//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ['images'],
//     allowsMultipleSelection: true,
//     selectionLimit: 4 - images.length,
//     quality: 0.8,
//     aspect: [4, 3],
//   });

//   if (!result.canceled) {
//     const newImages = result.assets.map(asset => {
//       // Fix the MIME type - expo-image-picker returns incomplete type
//       let mimeType = 'image/jpeg'; // default
      
//       if (asset.mimeType) {
//         mimeType = asset.mimeType;
//       } else if (asset.type) {
//         // If type is just "image", derive from URI
//         if (asset.uri.toLowerCase().includes('.png')) {
//           mimeType = 'image/png';
//         } else if (asset.uri.toLowerCase().includes('.jpg') || asset.uri.toLowerCase().includes('.jpeg')) {
//           mimeType = 'image/jpeg';
//         }
//       }
      
//       console.log('Selected image:', asset.uri, 'MIME type:', mimeType, asset.fileName);
      
//       return {
//         uri: asset.uri,
//         type: mimeType, // ✅ Use proper MIME type
//         fileName: asset.fileName || `image_${Date.now()}.jpg`,
//       };
//     });
    
//     console.log('New images to add:', newImages);
//     setImages([...images, ...newImages].slice(0, 4));
//   }
// };
// Find this function (around line 80) and REPLACE it:
const handleImagePick = async () => {
  if (images.length >= 4) {
    setAlertConfig({
  visible: true,
  title: 'મર્યાદા પૂર્ણ',
  message: 'તમે મહત્તમ 4 ફોટો પસંદ કરી શકો છો',
  buttons: [
    { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
  ],
  type: 'warning'
});

    return;
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    setAlertConfig({
  visible: true,
  title: 'પરવાનગી જરૂરી',
  message: 'કૃપા કરીને ફોટો લાઇબ્રેરી એક્સેસ કરવાની પરવાનગી આપો',
  buttons: [
    { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
  ],
  type: 'warning'
});

    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], // ✅ Fixed: Use array format instead of deprecated MediaTypeOptions
    allowsMultipleSelection: false, // ✅ Single image at a time for stability
    quality: 0.7,
    aspect: [4, 3],
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    
    const newImage = {
      uri: asset.uri,
      fileName: asset.fileName || `image_${Date.now()}.jpg`,
    };
    
    console.log('Selected image:', newImage);
    setImages([...images, newImage].slice(0, 4));
  }
};
  // Remove image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    // Validation
  if (!selectedCategory) {
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'કૃપા કરીને કેટેગરી પસંદ કરો',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'warning'
  });
  return;
}

if (!title) {
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'કૃપા કરીને શીર્ષક દાખલ કરો',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'warning'
  });
  return;
}

if (!price) {
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'કૃપા કરીને કિંમત દાખલ કરો',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'warning'
  });
  return;
}

if (!location) {
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'કૃપા કરીને સ્થળ દાખલ કરો',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'warning'
  });
  return;
}

if (images.length === 0) {
  setAlertConfig({
    visible: true,
    title: 'ભૂલ',
    message: 'કૃપા કરીને ઓછામાં ઓછો 1 ફોટો ઉમેરો',
    buttons: [
      { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
    ],
    type: 'warning'
  });
  return;
}


    setLoading(true);

    try {
      // Get user data from storage
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataString);

      if (!userData) {
        setAlertConfig({
  visible: true,
  title: 'ભૂલ',
  message: 'કૃપા કરીને ફરી લૉગિન કરો',
  buttons: [
    { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
  ],
  type: 'warning'
});
        navigation.navigate('Welcome');
        return;
      }

      // Prepare post data
      const postData = {
        title: title,
        description: description || 'વધુ માહિતી માટે સંપર્ક કરો',
        price: parseFloat(price),
        priceType: 'NEGOTIABLE',
        condition: 'GOOD',
        categoryId: selectedCategoryData?.categoryId || selectedCategoryData?.id || 1,
        subCategoryId: selectedCategoryData?.id || 1,
        districtId: userData.districtId,
        talukaId: userData.talukaId,
        villageId: userData.villageId,
        address: location,
        contactMethod: 'BOTH',
        contactPhone: userData.mobile,
      };

      // Add dynamic fields based on category (if needed in future)
      if (year || kilometers) {
        postData.description = `${description}\nવર્ષ: ${year}, કિ.મી.: ${kilometers}`;
      } else if (breed || age) {
        postData.description = `${description}\nજાતિ: ${breed}, ઉંમર: ${age}`;
      }

      // Step 1: Create the post
      const response = await apiService.createPost(postData);

      if (response.success) {
        const postId = response.data.postId;

        // Step 2: Upload images if post creation successful
        setUploadingImages(true);
        
        try {
          const uploadResponse = await apiService.uploadPostImages(postId, images);
          
          if (uploadResponse.success) {
            // Clear form after successful post creation
            clearForm();

            setAlertConfig({
  visible: true,
  title: 'સફળતા!',
  message: `તમારી જાહેરાત અને ${uploadResponse.data.length} ફોટો સફળતાપૂર્વક અપલોડ થયા!`,
  buttons: [
    {
      text: 'ઠીક છે',
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        navigation.replace('Account');
      }
    }
  ],
  type: 'success'
});

          } else {
            // Post created but images failed
            clearForm();

            setAlertConfig({
  visible: true,
  title: 'આંશિક સફળતા',
  message: 'તમારી જાહેરાત પોસ્ટ થઈ પરંતુ ફોટો અપલોડમાં સમસ્યા આવી',
  buttons: [
    {
      text: 'ઠીક છે',
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        navigation.replace('Account');
      }
    }
  ],
  type: 'warning'
});

          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          clearForm();

          setAlertConfig({
  visible: true,
  title: 'આંશિક સફળતા',
  message: 'તમારી જાહેરાત પોસ્ટ થઈ પરંતુ ફોટો અપલોડમાં સમસ્યા આવી',
  buttons: [
    {
      text: 'ઠીક છે',
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        navigation.replace('Account');
      }
    }
  ],
  type: 'warning'
});

        }
      } else {
        Alert.alert('ભૂલ', response.message || 'જાહેરાત પોસ્ટ કરવામાં સમસ્યા');
      }
    } catch (error) {
      if (error.message.includes('લૉગિન')) {
        setAlertConfig({
  visible: true,
  title: 'સત્ર સમાપ્ત',
  message: error.message,
  buttons: [
    {
      text: 'ઠીક છે',
      onPress: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        navigation.navigate('Welcome');
      }
    }
  ],
  type: 'warning'
});

      } else {
        setAlertConfig({
  visible: true,
  title: 'ભૂલ',
  message: 'કનેક્શન સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.',
  buttons: [
    { text: 'ઠીક છે', onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })) }
  ],
  type: 'error'
});

      }
      console.error('Create Post Error:', error);
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  // Category Selector Modal Component
  const CategorySelectorModal = () => (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowCategorySelector(false)}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>કેટેગરી પસંદ કરો</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Grid */}
      {categoriesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>કેટેગરી લોડ થઈ રહી છે...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryListItem}
              onPress={() => {
                setSelectedCategory(item);
                setShowCategorySelector(false);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: item.color }]}>
                <Text style={styles.categoryListIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.categoryListName}>{item.name}</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryListContainer}
        />
      )}
    </View>
  );

  // If category selector is shown, display the modal
  if (showCategorySelector) {
    return <CategorySelectorModal />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>જાહેરાત મૂકો</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selection Button */}
        <View style={styles.section}>
          <Text style={styles.label}>કેટેગરી પસંદ કરો *</Text>
          <TouchableOpacity
            style={styles.categorySelectorButton}
            onPress={() => setShowCategorySelector(true)}
          >
            {selectedCategory ? (
              <>
                <View style={[styles.selectedCategoryIconBox, { backgroundColor: selectedCategory.color }]}>
                  <Text style={styles.selectedCategoryIcon}>{selectedCategory.icon}</Text>
                </View>
                <Text style={styles.selectedCategoryName}>{selectedCategory.name}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            ) : (
              <>
                <Text style={styles.placeholderCategoryIcon}>📦</Text>
                <Text style={styles.placeholderCategoryText}>કેટેગરી પસંદ કરો</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>ફોટો ઉમેરો * ({images.length}/4)</Text>
          
          {/* Display selected images */}
          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add photo button */}
          {images.length < 4 && (
            <TouchableOpacity 
              style={styles.imageUploadBox}
              onPress={handleImagePick}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>ફોટો પસંદ કરો</Text>
              <Text style={styles.uploadSubtext}>મહત્તમ 4 ફોટો</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>શીર્ષક *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. Bajaj Pulsar 150 અથવા દેશી ગાય"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>વર્ણન</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="તમારી વસ્તુ વિશે વિગતવાર માહિતી આપો..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Dynamic Fields - Vehicle Info */}
        {selectedCategoryData?.needsVehicleInfo && (
          <>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>વર્ષ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2020"
                  placeholderTextColor="#999"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>કિલોમીટર</Text>
                <TextInput
                  style={styles.input}
                  placeholder="15000"
                  placeholderTextColor="#999"
                  value={kilometers}
                  onChangeText={setKilometers}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        {/* Dynamic Fields - Animal Info */}
        {selectedCategoryData?.needsAnimalInfo && (
          <>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>જાતિ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="દા.ત. ગીર, મુર્રાહ"
                  placeholderTextColor="#999"
                  value={breed}
                  onChangeText={setBreed}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>ઉંમર</Text>
                <TextInput
                  style={styles.input}
                  placeholder="દા.ત. 3 વર્ષ"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
            </View>
          </>
        )}

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>કિંમત (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. 45000"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.label}>સ્થળ *</Text>
          <TextInput
            style={styles.input}
            placeholder="દા.ત. અમદાવાદ"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            તમારી જાહેરાત ચકાસણી પછી 6 કલાકમાં લાઇવ થશે
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, (loading || uploadingImages) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || uploadingImages}
        >
          {loading || uploadingImages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.submitText}>
                {uploadingImages ? 'ફોટો અપલોડ થઈ રહ્યા છે...' : 'પોસ્ટ થઈ રહ્યું છે...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitText}>જાહેરાત પોસ્ટ કરો</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
      <BottomNavWrapper navigation={navigation} activeTab="createPost" />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  // Category Selector Button Styles
  categorySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    padding: 15,
  },
  selectedCategoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedCategoryIcon: {
    fontSize: 28,
  },
  selectedCategoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeholderCategoryIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  placeholderCategoryText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  arrowIcon: {
    fontSize: 28,
    color: '#999',
  },
  // Category List Modal Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  categoryListContainer: {
    padding: 10,
  },
  categoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryListIcon: {
    fontSize: 32,
  },
  categoryListName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageUploadBox: {
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingTop: 15,
    marginTop: 10,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 15,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});