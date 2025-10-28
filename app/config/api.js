import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy'; // ✅ Use legacy API for uploadAsync

// API Configuration
const API_CONFIG = {
  // BASE_URL: 'http://lokbazzar.com/api',
   BASE_URL: 'http://lokbazzar.com/api',
     BASE_URL_Image: 'http://lokbazzar.com/',
  TIMEOUT: 30000,
};

// API Endpoints
export const API_ENDPOINTS = {
  SEND_OTP: '/user/auth/send-otp',
  VERIFY_OTP: '/user/auth/verify-otp',
  LOGIN: '/user/auth/login',
  REGISTER: '/user/auth/register',
  CREATE_POST: '/user/post/create',
  CATEGORY_LIST: '/master/category/list',

    // 👇 Notification APIs
  NOTIFICATION_LIST: '/Notification',
  NOTIFICATION_STATS: '/Notification/stats',
  NOTIFICATION_READ: (id) => `/Notification/${id}/read`,
  NOTIFICATION_READ_ALL: '/Notification/read-all',
  NOTIFICATION_DELETE: (id) => `/Notification/${id}`,
};

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper to make authenticated API calls
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (response.status === 401) {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    throw new Error('UNAUTHORIZED');
  }

  return response;
};


// API Service
export const apiService = {
  // Send OTP
  sendOTP: async (mobile, purpose = 'REGISTER') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEND_OTP}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            purpose: purpose,
          }),
        }
      );
      const data = await response.json();
      //const data = await parseJSONSafe(response);

      return data;
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error;
    }
  },
  
  // Verify OTP
  verifyOTP: async (mobile, otp, purpose = 'REGISTER') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            otp: otp,
            purpose: purpose,
          }),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  },
  
 getCategoryList: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORY_LIST}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Category List Error:', error);
      throw error;
    }
  },

  // Get Districts
  getDistricts: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/districts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Districts Error:', error);
      throw error;
    }
  },

  // Get Talukas by District
  getTalukas: async (districtId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/talukas/${districtId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Talukas Error:', error);
      throw error;
    }
  },

  // Get Villages by Taluka
  getVillages: async (talukaId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/master/location/villages/${talukaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Villages Error:', error);
      throw error;
    }
  },

  // Register User
  registerUser: async (userData) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/user/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Register User Error:', error);
      throw error;
    }
  },
  
  // Login User
  loginUser: async (mobile, password = 'Test@123') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/user/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: mobile,
            password: password,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  // Create Post (AUTH REQUIRED)
  createPost: async (postData) => {
    try {
      const response = await authenticatedFetch(
        API_ENDPOINTS.CREATE_POST,
        {
          method: 'POST',
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Create Post Error:', error);
      throw error;
    }
  },

  // Get Posts by Category
  getPostsByCategory: async (categoryId, pageNumber = 1, pageSize = 20, sortBy = 'NEWEST') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts/category/${categoryId}?sortBy=${sortBy}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Posts Error:', error);
      throw error;
    }
  },

  // Get Posts with Filters
  getPostsWithFilters: async (filters = {}) => {
    try {
      const {
        categoryId,
        districtId,
        talukaId,
        villageId,
        minPrice,
        maxPrice,
        sortBy = 'NEWEST',
        pageSize = 20,
        pageNumber = 1
      } = filters;

      // Build query parameters
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (districtId) params.append('districtId', districtId);
      if (talukaId) params.append('talukaId', talukaId);
      if (villageId) params.append('villageId', villageId);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('sortBy', sortBy);
      params.append('pageSize', pageSize);
      params.append('pageNumber', pageNumber);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Posts with Filters Error:', error);
      throw error;
    }
  },

  // Get Post by ID
  getPostById: async (postId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts/${postId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Post By ID Error:', error);
      throw error;
    }
  },

  // Get User Profile (AUTH REQUIRED)
  getUserProfile: async () => {
    try {
      const response = await authenticatedFetch(
        '/user/auth/profile',
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get Profile Error:', error);
      throw error;
    }
  },

  // Get User's Posts (AUTH REQUIRED)
  getMyPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await authenticatedFetch(
        `/user/post/my-posts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get My Posts Error:', error);
      throw error;
    }
  },

  deletePost: async (postId) => {
  try {
    console.log('🗑️ Deleting post with ID:', postId);

    const response = await authenticatedFetch(`/user/post/${postId}`, {
      method: 'DELETE',
    });

    // Some APIs return 204 (no content), handle safely
    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: response.ok };

    console.log('🟢 Delete API response:', data);
    return data;
  } catch (error) {
    console.error('❌ Delete Post Error:', error);
    throw error;
  }
  },

  updatePostStatus: async (postId, status) => {
  try {
    console.log('🔄 Updating post status:', { postId, status });

    const response = await authenticatedFetch(`/user/post/${postId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : { success: response.ok };

    console.log('🟢 Update Post Status API response:', data);
    return data;
  } catch (error) {
    console.error('❌ Update Post Status Error:', error);
    throw error;
  }
  },



  // Search Posts
  searchPosts: async (query, pageNumber = 1, pageSize = 20, sortBy = 'NEWEST') => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/browse/posts/search?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search Posts Error:', error);
      throw error;
    }
  },
  
  // ✅ FINAL WORKING VERSION - Upload images using FileSystem
  uploadPostImages: async (postId, imageFiles) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('UNAUTHORIZED');
      }

      console.log(`Starting upload of ${imageFiles.length} images for post ${postId}`);

      // Upload images ONE BY ONE
      const uploadResults = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const image = imageFiles[i];
        console.log(`Uploading image ${i + 1}/${imageFiles.length}:`, image.uri);

        try {
          // FileSystem.FileSystemUploadType.MULTIPART works with legacy API
          const uploadResult = await FileSystem.uploadAsync(
            `${API_CONFIG.BASE_URL}/user/post/${postId}/upload-images`,
            image.uri,
            {
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.MULTIPART, // ✅ Works with legacy API
              fieldName: 'images',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          console.log(`Image ${i + 1} upload status:`, uploadResult.status);

          if (uploadResult.status === 200 || uploadResult.status === 201) {
            try {
              const responseData = JSON.parse(uploadResult.body);
              uploadResults.push(responseData);
              console.log(`Image ${i + 1} uploaded successfully`);
            } catch (parseError) {
              console.log(`Image ${i + 1} uploaded but response parse failed`);
              uploadResults.push({ success: true });
            }
          } else {
            console.error(`Image ${i + 1} failed:`, uploadResult.body);
            throw new Error(`Upload failed with status ${uploadResult.status}`);
          }
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          throw uploadError;
        }
      }

      // Return success
      return {
        success: true,
        message: `${imageFiles.length} images uploaded successfully`,
        data: uploadResults,
      };
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Upload Images Error:', error);
      throw error;
    }
  },

  // Get User's Favorite Posts (AUTH REQUIRED)
  getUserFavorites: async (pageNumber = 1, pageSize = 20) => {
    try {
      const response = await authenticatedFetch(
        `/user/post/favorites?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get Favorites Error:', error);
      throw error;
    }
  },

  // Toggle Favorite Post (AUTH REQUIRED)
  toggleFavoritePost: async (postId) => {
    try {
      const response = await authenticatedFetch(
        `/user/post/favorite/${postId}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Toggle Favorite Error:', error);
      throw error;
    }
  },

  // Get User Profile (AUTH REQUIRED)
  getUserProfile: async () => {
    try {
      const response = await authenticatedFetch(
        '/user/auth/profile',
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Get Profile Error:', error);
      throw error;
    }
  },

  // Update User Profile (AUTH REQUIRED)
  updateUserProfile: async (profileData) => {
    try {
      // If it's FormData (with image), use multipart/form-data
      const headers = profileData instanceof FormData 
        ? {} // FormData automatically sets the correct Content-Type
        : { 'Content-Type': 'application/json' };

      const response = await authenticatedFetch(
        '/user/auth/profile',
        {
          method: 'PUT',
          headers,
          body: profileData instanceof FormData 
            ? profileData 
            : JSON.stringify({
                FirstName: profileData.firstName,
                LastName: profileData.lastName,
                Email: profileData.email,
                DistrictId: parseInt(profileData.districtId),
                TalukaId: parseInt(profileData.talukaId),
                VillageId: parseInt(profileData.villageId),
                ProfileImage: profileData.profileImage,
                LocationString: profileData.locationString,
              }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        throw new Error('તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગિન કરો.');
      }
      console.error('Update Profile Error:', error);
      throw error;
    }
  },

  getNotifications: async (pageNumber = 1, pageSize = 20) => {
  try {
    const response = await authenticatedFetch(
      `${API_ENDPOINTS.NOTIFICATION_LIST}?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return await response.json();
  } catch (error) {
    console.error('Get Notifications Error:', error);
    throw error;
  }
},

markAsRead: async (notificationId) => {
  try {
    await authenticatedFetch(API_ENDPOINTS.NOTIFICATION_READ(notificationId), {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Mark As Read Error:', error);
    throw error;
  }
},

markAllAsRead: async () => {
  try {
    await authenticatedFetch(API_ENDPOINTS.NOTIFICATION_READ_ALL, {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Mark All As Read Error:', error);
    throw error;
  }
},

deleteNotification: async (notificationId) => {
  try {
    await authenticatedFetch(API_ENDPOINTS.NOTIFICATION_DELETE(notificationId), {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    throw error;
  }
},



};

export default API_CONFIG;