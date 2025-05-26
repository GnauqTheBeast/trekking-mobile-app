import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FAB } from '@rneui/themed';
import Trek from '../../../components/trek';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TrekHostProps } from '../../../types/trek';
import { TrekStackParamList } from '../../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../../theme';
import { trekService } from '../../../services/trek.service';
import { AuthContext } from '../../../context/AuthProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnButton from '../../../components/common/ReturnButton';

interface ExtendedTrekProps extends TrekHostProps {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVE';
}

type TrekListNavigationProp = StackNavigationProp<TrekStackParamList, 'TrekList'>;

type FilterType = 'all' | 'draft' | 'published' | 'archive';

const TrekList = () => {
  const auth = useContext(AuthContext)!;
  const {user, token} = auth;
  const id = user!.id;
  const role = user?.role?.name;

  const [treks, setTreks] = useState<ExtendedTrekProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showSearch, setShowSearch] = useState(false);
  const navigation = useNavigation<TrekListNavigationProp>();

  const checkUserRole = async () => {
    try {
      if (role) {
        setIsHost(role === 'HOST');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchTreks = async (hostId: string) => {
    try {
      setLoading(true);
      const response = await trekService.getHostTreks(hostId);

      const mappedTreks = response.data.data.map((trek: any) => ({
        id: trek.id,
        name: trek.name,
        description: trek.description,
        location: trek.location,
        duration: trek.duration,
        rate: trek.rate,
        price: trek.price,
        distance: trek.distance,
        elevation: trek.elevation,
        level: trek.level,
        images: trek.images ? JSON.parse(trek.images) : [],
        start_date: trek.start_at,
        end_date: trek.end_at,
        total_slot: trek.slot,
        available_slot: trek.available_slot,
        booked: trek.slot - trek.available_slot,
        status: trek.status
      }));
      setTreks(mappedTreks);
    } catch (error) {
      console.error('Error fetching treks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    console.log("Host id: ", id)
    await fetchTreks(id);
    setRefreshing(false);
  };

  useEffect(() => {
    checkUserRole();
    fetchTreks(id);
  }, []);

  const getFilteredTreks = () => {
    let filtered = treks;

    if (searchQuery) {
      filtered = filtered.filter(trek =>
        trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeFilter) {
      case 'draft':
        filtered = filtered.filter(trek => trek.status === 'DRAFT');
        break;
      case 'published':
        filtered = filtered.filter(trek => trek.status === 'PUBLISHED');
        break;
      case 'archive':
        filtered = filtered.filter(trek => trek.status === 'ARCHIVE');
        break;
      default:
        break;
    }

    return filtered;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
          <ReturnButton top={5} />
          <Text style={styles.headerTitle}>Treks Management</Text>
      </View>
      <View style={styles.headerActions}>
        {/* {showSearch ? ( */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={24} color="black" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tours..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {/* <TouchableOpacity onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        {/* // ) : (
        //   <TouchableOpacity onPress={() => setShowSearch(true)}>
        //     <Icon name="magnify" size={24} color="#1A1A1A" />
        //   </TouchableOpacity>
        // )} */}
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
        onPress={() => setActiveFilter('all')}
      >
        <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'draft' && styles.activeFilter]}
        onPress={() => setActiveFilter('draft')}
      >
        <Text style={[styles.filterText, activeFilter === 'draft' && styles.activeFilterText]}>Draft</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'published' && styles.activeFilter]}
        onPress={() => setActiveFilter('published')}
      >
        <Text style={[styles.filterText, activeFilter === 'published' && styles.activeFilterText]}>Published</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'archive' && styles.activeFilter]}
        onPress={() => setActiveFilter('archive')}
      >
        <Text style={[styles.filterText, activeFilter === 'archive' && styles.activeFilterText]}>Archive</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="hiking" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No Tours Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try different search terms' : 'Start by creating your first tour'}
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      {renderFilters()}

      <FlatList
        data={getFilteredTreks()}
        renderItem={({ item }) => (
          <Trek {...item} isManagementView={true} isHost={isHost} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.listContent,
          getFilteredTreks().length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.btnText} onPress={() => navigation.navigate('CreateTrek')}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
  },
  headerTitleContainer: {
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F2DC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#1A1A1A',
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeFilter: {
    backgroundColor: '#2A5848',
  },
  filterText: {
    fontFamily: 'OpenSans-Regular',
    color: '#666',
  },
  activeFilterText: {
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#1A1A1A',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  btnText: {
    backgroundColor: '#2A5848',
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  },
  addText: {
    color: 'white',
    fontSize: 36,
  }
});

export default TrekList;
