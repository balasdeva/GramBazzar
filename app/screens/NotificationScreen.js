// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     RefreshControl,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { apiService } from '../config/api';
// export default function NotificationScreen() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const navigation = useNavigation();
//   // ✅ Fetch notifications
//   const fetchNotifications = async () => {
//   try {
//     setLoading(true);
//     const data = await apiService.getNotifications(1, 20);

//     console.log('📩 Notifications fetched from API:', data);

//     const list = Array.isArray(data?.data) ? data.data : [];

//     // ✅ Prepend domain to imageUrl if needed
//     const updatedList = list.map((item) => ({
//       ...item,
//       imageUrl: item.imageUrl
//         ? item.imageUrl.startsWith('http')
//           ? item.imageUrl
//           : `http://lokbazzar.com/${item.imageUrl}`
//         : null,
//     }));

//     setNotifications(updatedList);
//   } catch (error) {
//     console.error('❌ Error fetching notifications:', error);
//     Alert.alert('Error', 'Failed to load notifications.');
//   } finally {
//     setLoading(false);
//   }
// };



//   // ✅ Mark a single notification as read
//   const handleMarkAsRead = async (id) => {
//     try {
//       await apiService.markAsRead(id);
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to mark as read.');
//     }
//   };

//   // ✅ Delete a single notification
//   const handleDelete = async (id) => {
//     try {
//       await apiService.deleteNotification(id);
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to delete notification.');
//     }
//   };

//   // ✅ Mark all notifications as read
//   const handleMarkAll = async () => {
//     try {
//       await apiService.markAllAsRead();
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to mark all as read.');
//     }
//   };

//  const handlePostClick = (notification) => {
//     if (notification.referenceId) {
//       navigation.navigate('PostDetail', { post: { postId: notification.referenceId } });
//     } else {
//       Alert.alert('ભૂલ', 'પોસ્ટની માહિતી ઉપલબ્ધ નથી');
//     }
//   };





//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
//       {/* 🔹 Header */}
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 10,
//         }}
//       >
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
//           Notifications
//         </Text>
//         <TouchableOpacity onPress={handleMarkAll}>
//           <Text style={{ color: '#007BFF', fontWeight: '600' }}>
//             Mark All Read
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🔹 Loader */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : notifications.length === 0 ? (
//         <View style={{ alignItems: 'center', marginTop: 50 }}>
//           <Text style={{ color: 'gray', fontSize: 16 }}>
//             No notifications yet 📭
//           </Text>
//         </View>
//       ) : (
//       <FlatList
//   data={notifications}
//   keyExtractor={(item) =>
//     item.notificationId
//       ? item.notificationId.toString()
//       : Math.random().toString()
//   }
//   refreshControl={
//     <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />
//   }
//   renderItem={({ item }) => (
//     <TouchableOpacity
//       onPress={() => handlePostClick(item)} // 👈 navigate to PostDetail
//       activeOpacity={0.8}
//       style={{
//         backgroundColor: item.isRead ? '#f2f2f2' : '#e6f7ff',
//         padding: 12,
//         borderRadius: 10,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         flexDirection: 'row',
//         alignItems: 'center',
//       }}
//     >
//       {/* 🖼️ Notification Image */}
//       {item.imageUrl ? (
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: 8,
//             marginRight: 12,
//             backgroundColor: '#f0f0f0',
//           }}
//         />
//       ) : null}

//       {/* 📜 Text Section */}
//       <View style={{ flex: 1 }}>
//         <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#333' }}>
//           {item.title}
//         </Text>

//         <Text style={{ fontSize: 13, color: '#555', marginTop: 3 }}>
//           {item.message}
//         </Text>

//         <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
//           {new Date(item.createdAt).toLocaleString()}
//         </Text>

//         {/* 🔘 Action Buttons */}
//         <View style={{ flexDirection: 'row', marginTop: 6 }}>
//           {!item.isRead && (
//             <TouchableOpacity
//               onPress={() => handleMarkAsRead(item.notificationId)}
//               style={{ marginRight: 15 }}
//             >
//               <Text style={{ color: 'green', fontWeight: '600' }}>
//                 Mark as Read
//               </Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity onPress={() => handleDelete(item.notificationId)}>
//             <Text style={{ color: 'red', fontWeight: '600' }}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )}
// />

//       )}
//     </View>
//   );
// }
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiService } from '../config/api';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications(1, 20);
      const list = Array.isArray(data?.data) ? data.data : [];

      const updatedList = list.map((item) => ({
        ...item,
        imageUrl: item.imageUrl
          ? item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `http://lokbazzar.com/${item.imageUrl}`
          : null,
      }));

      setNotifications(updatedList);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      Alert.alert('ભૂલ', 'સૂચનાઓ લોડ કરવામાં સમસ્યા આવી.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await apiService.markAsRead(id);
      fetchNotifications();
    } catch {
      Alert.alert('ભૂલ', 'વાંચેલ તરીકે ચિહ્નિત કરવામાં સમસ્યા.');
    }
  };

  // ✅ Delete notification
  const handleDelete = async (id) => {
    try {
      await apiService.deleteNotification(id);
      fetchNotifications();
    } catch {
      Alert.alert('ભૂલ', 'સૂચના કાઢવામાં સમસ્યા.');
    }
  };

  // ✅ Mark all notifications as read
  const handleMarkAll = async () => {
    try {
      await apiService.markAllAsRead();
      fetchNotifications();
    } catch {
      Alert.alert('ભૂલ', 'બધી સૂચનાઓ વાંચેલ તરીકે ચિહ્નિત કરવામાં સમસ્યા.');
    }
  };

  // ✅ Navigate to Post Detail
  const handlePostClick = (notification) => {
    if (notification.referenceId) {
      navigation.navigate('PostDetail', { post: { postId: notification.referenceId } });
    } else {
      Alert.alert('ભૂલ', 'પોસ્ટની માહિતી ઉપલબ્ધ નથી.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // ✅ Render each notification card
  const renderItem = ({ item }) => {
    const isUnread = !item.isRead;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePostClick(item)}
        style={[
          styles.card,
          isUnread && styles.unreadCard,
        ]}
      >
        {/* 🔔 Icon / Image */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.notificationImage}
          />
        ) : (
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔔</Text>
          </View>
        )}

        {/* 📜 Notification Info */}
        <View style={styles.cardContent}>
          <Text style={styles.notificationTitle}>
            {item.title || 'સૂચના'}
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>

          {/* 🔘 Actions */}
          <View style={styles.actionRow}>
            {!item.isRead && (
              <TouchableOpacity onPress={() => handleMarkAsRead(item.notificationId)}>
                <Text style={styles.markReadText}>વાંચેલ</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleDelete(item.notificationId)}>
              <Text style={styles.deleteText}>કાઢી નાંખો</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 સૂચનાઓ</Text>
        <TouchableOpacity onPress={handleMarkAll}>
          <Text style={styles.headerAction}>બધી વાંચેલ</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Loading / Empty / List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loaderText}>લોડ થઈ રહ્યું છે...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>કોઈ સૂચનાઓ નથી</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) =>
            item.notificationId ? item.notificationId.toString() : Math.random().toString()
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#777',
    marginTop: 10,
  },
  listContent: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#E8F5E9',
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  markReadText: {
    color: '#388E3C',
    fontWeight: '600',
    marginRight: 15,
  },
  deleteText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
};
