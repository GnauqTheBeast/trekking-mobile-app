import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Button, Text, Icon } from '@rneui/themed';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TrekHostProps } from '../../../types/trek';
import { TrekStackParamList } from '../../../types/navigation';
import { theme } from '../../../theme';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { trekService } from '../../../services/trek.service';
import { AuthContext } from '../../../context/AuthProvider';
import ReturnButton from '../../../components/common/ReturnButton';

type TrekDetailRouteProp = RouteProp<TrekStackParamList, 'TrekDetail'>;
type TrekDetailNavigationProp = StackNavigationProp<TrekStackParamList>;

const TrekDetail = () => {
  const route = useRoute<TrekDetailRouteProp>();
  const navigation = useNavigation<TrekDetailNavigationProp>();
  const [trek, setTrek] = useState<TrekHostProps | null>(null);
  const [loading, setLoading] = useState(false);
  const { trekId } = route.params;
  const auth = useContext(AuthContext)!;
  const user = auth.user;

  const fetchTrekDetail = async () => {
    if (!trekId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin tour');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      const response = await trekService.getTrekById(trekId);
      if (!response?.data?.message) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin tour');
        navigation.goBack();
        return;
      }

      const trekData = response.data.message;
      const mappedTrek: TrekHostProps = {
        id: trekData.id,
        name: trekData.name,
        description: trekData.description,
        location: trekData.location,
        duration: trekData.duration,
        rate: parseFloat(trekData.rate),
        price: trekData.price,
        distance: trekData.distance,
        elevation: trekData.elevation,
        level: trekData.level,
        images: JSON.parse(trekData.images),
        startAt: trekData.start_at,
        endAt: trekData.end_at,
        total_slot: trekData.slot,
        available_slot: trekData.available_slot,
        host: {
          id: user!.id,
          name: user!.fullname,
          image: user?.image || null
        },
        status: trekData.status,
        createdAt: trekData.createdAt,
        updatedAt: trekData.updateAt
        // booked: trekData.slot - trekData.available_slot
      };

      setTrek(mappedTrek);
    } catch (error) {
      console.error('Error fetching trek:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrekDetail();
  }, [trekId]);

  const handleDelete = async () => {
    if (!trek) return;

    Alert.alert(
      'Xóa Tour',
      'Bạn có chắc chắn muốn xóa tour này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await trekService.deleteTrek(trek.id);
              navigation.navigate('TrekList');
            } catch (error) {
              console.error('Error deleting trek:', error);
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa tour');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!trek) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin tour</Text>
        <Button
          title="Quay lại"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.errorButton}
        />
      </View>
    );
  }

  console.log(trek.images)

  return (
    <ScrollView style={styles.container}>
      <ReturnButton top={60}/>
      <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
        {trek.images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri: uri }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => console.log('Error:', error.nativeEvent.error)}
          />
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text h4 style={styles.title}>{trek.name}</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(trek.level) }]}>
            <Text style={styles.levelText}>{trek.level}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Icon name="map-marker" type="material-community" color="#FF8E4F" size={20} />
          <Text style={styles.location}>{trek.location}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" type="material-community" color="#FF8E4F" size={20} />
            <Text style={styles.infoText}>{trek.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="currency-usd" type="material-community" color="#FF8E4F" size={20} />
            <Text style={styles.infoText}>{trek.price.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="account-group" type="material-community" color="#FF8E4F" size={20} />
            <Text style={styles.infoText}>{trek.total_slot - trek.available_slot}/{trek.total_slot}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name="map-marker-distance" type="material-community" color="#2A5848" size={20} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Khoảng cách</Text>
                <Text style={styles.detailValue}>{trek.distance} km</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="mountain" type="material-community" color="#2A5848" size={20} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Độ cao</Text>
                <Text style={styles.detailValue}>{trek.elevation} m</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="calendar-start" type="material-community" color="#2A5848" size={20} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Bắt đầu</Text>
                <Text style={styles.detailValue}>
                  {format(new Date(trek.startAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="calendar-end" type="material-community" color="#2A5848" size={20} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Kết thúc</Text>
                <Text style={styles.detailValue}>
                  {format(new Date(trek.endAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{trek.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Chỉnh sửa"
            icon={<Icon name="pencil" type="material-community" color="white" size={20} style={styles.buttonIcon} />}
            onPress={() => navigation.navigate('EditTrek', { trekId: trek.id })}
            buttonStyle={[styles.button, styles.editButton]}
          />
          <Button
            title="Xóa"
            icon={<Icon name="delete" type="material-community" color="white" size={20} style={styles.buttonIcon} />}
            onPress={handleDelete}
            buttonStyle={[styles.button, styles.deleteButton]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "dễ":
      return "#0E871C";
    case "trung bình":
      return "#E47507";
    case "khó":
      return "#E40505";
    default:
      return "#2A5848";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "cover"
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    color: '#2A5848',
    marginRight: 12,
    fontSize: 24,
    fontWeight: '700',
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 12,
  },
  location: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2A5848',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 28,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginTop: 12,
    color: '#2A5848',
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2A5848',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  detailValue: {
    color: '#2A5848',
    fontWeight: '600',
    fontSize: 15,
  },
  description: {
    lineHeight: 26,
    color: '#333',
    fontSize: 15,
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#2A5848',
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
  errorButton: {
    backgroundColor: '#2A5848',
    borderRadius: 12,
    padding: 16,
  },
});

export default TrekDetail;
