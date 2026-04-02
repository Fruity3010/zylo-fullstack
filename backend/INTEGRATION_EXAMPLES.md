# React Native Backend Integration Examples

This guide shows how to integrate the backend API into your React Native screens.

---

## 1. Login Screen Integration

Update your login screen to use the API:

```typescript
// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response.success) {
        Alert.alert('Success', 'Login successful!');
        // Navigate to dashboard
        router.replace('/dashboard');
      } else {
        Alert.alert('Login Failed', response.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#6AFF6A',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 2. Signup Screen Integration

```typescript
// app/signup.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signup } from '../services/auth';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'sender' as 'sender' | 'errander' | 'both',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    const { email, password, full_name, role } = formData;

    if (!email || !password || !full_name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await signup({ email, password, full_name, role });

      if (response.success) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/dashboard'),
            },
          ]
        );
      } else {
        Alert.alert('Signup Failed', response.error || 'Could not create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Full Name"
        value={formData.full_name}
        onChangeText={(text) => setFormData({ ...formData, full_name: text })}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      {/* Role Selector */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setFormData({ ...formData, role: 'sender' })}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: formData.role === 'sender' ? '#6AFF6A' : '#ddd',
            marginRight: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: 'center' }}>Sender</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFormData({ ...formData, role: 'errander' })}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: formData.role === 'errander' ? '#6AFF6A' : '#ddd',
            marginLeft: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: 'center' }}>Errander</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignup}
        disabled={loading}
        style={{
          backgroundColor: '#6AFF6A',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 3. Create Errand Integration

Update your dashboard errand form to submit to the backend:

```typescript
// app/dashboard/index.tsx or your errand form component
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { createErrand } from '../../services/errands';

export default function CreateErrandForm() {
  const [formData, setFormData] = useState({
    category: 'courier_delivery' as any,
    title: '',
    description: '',
    budget: '',
    pickupLocation: null,
    destinationLocation: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { title, description, budget, destinationLocation } = formData;

    // Validation
    if (!title || !description || !budget || !destinationLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await createErrand({
        category: formData.category,
        title,
        description,
        budget: parseFloat(budget),
        pickup_location: formData.pickupLocation || undefined,
        destination_location: destinationLocation,
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Errand created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setFormData({
                  category: 'courier_delivery',
                  title: '',
                  description: '',
                  budget: '',
                  pickupLocation: null,
                  destinationLocation: null,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to create errand');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Your form UI here...
  // When user selects location from map, update formData.destinationLocation
  // Format: { latitude: number, longitude: number, address: string }
}
```

---

## 4. Display Errands List

Create a screen to show all available errands:

```typescript
// app/errands/list.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { getErrands } from '../../services/errands';
import type { Errand } from '../../services/errands';

export default function ErrandsListScreen() {
  const [errands, setErrands] = useState<Errand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchErrands = async () => {
    try {
      const response = await getErrands({ status: 'open' });

      if (response.success && response.data) {
        setErrands(response.data.errands);
      }
    } catch (error) {
      console.error('Error fetching errands:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchErrands();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchErrands();
  };

  const renderErrand = ({ item }: { item: Errand }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
        {item.title}
      </Text>
      <Text style={{ color: '#666', marginBottom: 5 }}>
        {item.description}
      </Text>
      <Text style={{ color: '#6AFF6A', fontWeight: 'bold' }}>
        Budget: ${item.budget}
      </Text>
      <Text style={{ color: '#888', fontSize: 12, marginTop: 5 }}>
        {item.destination_location.address}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading errands...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={errands}
        keyExtractor={(item) => item.id}
        renderItem={renderErrand}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text>No errands available</Text>
          </View>
        }
      />
    </View>
  );
}
```

---

## 5. Protected Route / Auth Check

Protect dashboard routes with authentication:

```typescript
// app/dashboard/_layout.tsx
import { useEffect, useState } from 'react';
import { useRouter, Slot } from 'expo-router';
import { View, Text } from 'react-native';
import { isAuthenticated } from '../../services/auth';

export default function DashboardLayout() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    setChecking(false);

    if (!isAuth) {
      router.replace('/login');
    }
  };

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <Slot />;
}
```

---

## 6. User Profile / Logout

```typescript
// app/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUserFromStorage, logout } from '../services/auth';
import type { User } from '../services/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getCurrentUserFromStorage();
    setUser(userData);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Profile
      </Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: '#666' }}>Name</Text>
        <Text style={{ fontSize: 18 }}>{user.full_name}</Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: '#666' }}>Email</Text>
        <Text style={{ fontSize: 18 }}>{user.email}</Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: '#666' }}>Role</Text>
        <Text style={{ fontSize: 18, textTransform: 'capitalize' }}>
          {user.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#ff4444',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 7. Apply to Errand (Errander)

```typescript
// app/errands/[id].tsx - Errand detail screen
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { applyToErrand } from '../../services/errands';

export default function ErrandDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleApply = async () => {
    Alert.alert(
      'Apply to Errand',
      'Are you sure you want to accept this errand?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: async () => {
            const response = await applyToErrand(id as string);

            if (response.success) {
              Alert.alert(
                'Success',
                'You have successfully applied to this errand!',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } else {
              Alert.alert('Error', response.error || 'Failed to apply');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Errand details here */}

      <TouchableOpacity
        onPress={handleApply}
        style={{
          backgroundColor: '#6AFF6A',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          Apply to this Errand
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Common Patterns

### Error Handling

```typescript
try {
  const response = await someApiCall();

  if (!response.success) {
    Alert.alert('Error', response.error || 'Something went wrong');
    return;
  }

  // Handle success
} catch (error) {
  console.error('API Error:', error);
  Alert.alert('Error', 'Network error. Please check your connection.');
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

### Pull to Refresh

```typescript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

// In FlatList
<FlatList
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  }
/>
```

---

## Testing Tips

### 1. Test API Connection First

```typescript
// Test component
import { useEffect } from 'react';
import api from '../services/api';

export default function TestScreen() {
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await api.get('/health');
      console.log('API Connection:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return null;
}
```

### 2. Log Requests/Responses

```typescript
// In services/api.ts, add logging
api.interceptors.request.use(config => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

---

## Next Steps

1. Replace existing screens with API-integrated versions
2. Add loading states and error handling
3. Implement real-time updates (Supabase Realtime)
4. Add image upload functionality
5. Implement chat/messaging
6. Add push notifications

**Happy coding!**
