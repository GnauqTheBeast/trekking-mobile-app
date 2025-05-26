import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trekService } from '../../../services/trek.service';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TrekHostProps } from '../../../types/trek';
import { TrekStackParamList } from '../../../types/navigation';
import ImagePicker from '../../../components/common/ImagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../../context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnButton from '../../../components/common/ReturnButton';

type EditTrekRouteProp = RouteProp<TrekStackParamList, 'EditTrek'>;
type EditTrekNavigationProp = StackNavigationProp<TrekStackParamList, 'EditTrek'>;

const EditTrek = () => {

  const auth = useContext(AuthContext);
  const user = auth?.user;

  const route = useRoute<EditTrekRouteProp>();
  const navigation = useNavigation<EditTrekNavigationProp>();
  const [loading, setLoading] = useState(false);
  const { trekId } = route.params;
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [formData, setFormData] = useState<TrekHostProps>({
    id: trekId,
    name: '',
    description: '',
    location: '',
    duration: '',
    rate: 0,
    price: 0,
    distance: 0,
    elevation: 0,
    level: 'MODERATE',
    images: [],
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString(),
    total_slot: 10,
    available_slot: 0,
    host: {
      id: user!.id,
      name: user!.fullname,
      image: user?.image || null
    },
    status: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchTrekDetail = async () => {
      try {
        setLoading(true);
        const response = await trekService.getTrekById(trekId);

        if (response && response.data && response.data.message) {
          const trekData = {
            ...response.data.message,
            images: JSON.parse(response.data.message.images || '[]'),
            startAt: response.data.message.start_at,
            endAt: response.data.message.end_at,
            total_slot: response.data.message.slot,
          };

          setFormData(trekData);
        }
      } catch (error) {
        console.error('Error fetching trek:', error);
      } finally {
        setLoading(false);
      }
    };

    if (trekId) {
      fetchTrekDetail();
    }
  }, [trekId]);

  const showStartDatepicker = () => {
    setShowStartPicker(true);
  };

  const showStartTimepicker = () => {
    setShowStartTimePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndPicker(true);
  };

  const showEndTimepicker = () => {
    setShowEndTimePicker(true);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const newDate = new Date(formData.startAt);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setFormData({ ...formData, startAt: newDate.toISOString() });
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.startAt);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, startAt: newDate.toISOString() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const newDate = new Date(formData.endAt);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setFormData({ ...formData, endAt: newDate.toISOString() });
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.endAt);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, endAt: newDate.toISOString() });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        slot: formData.total_slot,
        level: formData.level,
        distance: formData.distance,
        elevation: formData.elevation,
        duration: formData.duration,
        location: formData.location,
        images: JSON.stringify(formData.images),
        rate: formData.rate?.toString() || '0',
        start_at: formData.startAt,
        end_at: formData.endAt,
        status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      };

      await trekService.updateTrek(trekId, updateData);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating trek:', error?.message || 'Unknown error');
      Alert.alert('Error', 'Failed to update trek. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
          <ReturnButton />
          <Text style={styles.headerTitle}>Explore Treks</Text>
      </View>
      <ScrollView style={styles.content}>
        <Input
          label="Tên Trek"
          value={formData.name}
          onChangeText={(text: string) => setFormData({ ...formData, name: text })}
          placeholder="Nhập tên Trek"
        />

        <Input
          label="Mô tả"
          value={formData.description}
          onChangeText={(text: string) => setFormData({ ...formData, description: text })}
          placeholder="Nhập mô tả Trek"
          multiline
          numberOfLines={4}
        />

        <Input
          label="Giá (VNĐ)"
          value={formData.price?.toString() || ''}
          onChangeText={(text: string) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
          placeholder="Nhập giá Trek"
          keyboardType="numeric"
        />

        <Input
          label="Số lượng slot"
          value={formData.total_slot?.toString() || ''}
          onChangeText={(text: string) => {
            const total = parseInt(text) || 0;
            setFormData({ ...formData, total_slot: total });
          }}
          placeholder="Nhập số lượng slot"
          keyboardType="numeric"
        />

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Thời gian bắt đầu:</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1, marginRight: 10 }]}
              onPress={showStartDatepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.startAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1 }]}
              onPress={showStartTimepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.startAt).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={new Date(formData.startAt)}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          {showStartTimePicker && (
            <DateTimePicker
              value={new Date(formData.startAt)}
              mode="time"
              display="default"
              onChange={handleStartTimeChange}
            />
          )}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Thời gian kết thúc:</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1, marginRight: 10 }]}
              onPress={showEndDatepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.startAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1 }]}
              onPress={showEndTimepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.startAt).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
          {showEndPicker && (
            <DateTimePicker
              value={new Date(formData.startAt)}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date(formData.endAt)}
              mode="time"
              display="default"
              onChange={handleEndTimeChange}
            />
          )}
        </View>

        <Input
          label="Thời gian (VD: 2 ngày 1 đêm)"
          value={formData.duration}
          onChangeText={(text: string) => setFormData({ ...formData, duration: text })}
          placeholder="Nhập thời gian Trek"
        />

        <View style={styles.rowContainer}>
          <Input
            containerStyle={styles.halfInput}
            label="Khoảng cách (km)"
            value={formData.distance?.toString() || ''}
            onChangeText={(text: string) => setFormData({ ...formData, distance: parseFloat(text) || 0 })}
            placeholder="Nhập khoảng cách"
            keyboardType="numeric"
          />

          <Input
            containerStyle={styles.halfInput}
            label="Độ cao (m)"
            value={formData.elevation?.toString() || ''}
            onChangeText={(text: string) => setFormData({ ...formData, elevation: parseFloat(text) || 0 })}
            placeholder="Nhập độ cao"
            keyboardType="numeric"
          />
        </View>

        <Input
          label="Địa điểm"
          value={formData.location}
          onChangeText={(text: string) => setFormData({ ...formData, location: text })}
          placeholder="Nhập địa điểm"
        />

        <View style={styles.levelContainer}>
          <Text style={styles.label}>Mức độ khó:</Text>
          <View style={styles.levelButtons}>
            {(['EASY', 'MODERATE', 'HARD'] as const).map((level) => (
              <Button
                key={level}
                title={level}
                type={formData.level === level ? 'solid' : 'outline'}
                onPress={() => setFormData({ ...formData, level })}
                buttonStyle={[
                  styles.levelButton,
                  formData.level === level && styles.levelButtonActive
                ]}
              />
            ))}
          </View>
        </View>

        <ImagePicker
          images={formData.images || []}
          onImagesSelected={(images: string[]) => setFormData({ ...formData, images: images })}
          maxImages={5}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Lưu thay đổi"
            onPress={handleSubmit}
            buttonStyle={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
      flex: 1,
      paddingHorizontal: 8,
      paddingVertical: 16,
      backgroundColor: '#f2f2f2',
  },
  header: {
      marginTop: 0,
      paddingTop: 5,
      paddingBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white'
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  inputLabel: {
    color: '#2A5848',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A5848',
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#F8F8F8',
  },
  dateText: {
    fontSize: 15,
    color: '#2A5848',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2A5848',
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  levelButton: {
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  levelButtonActive: {
    backgroundColor: '#2A5848',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#2A5848',
  },
  buttonContainer: {
    marginVertical: 24,
  },
  button: {
    backgroundColor: '#2A5848',
    borderRadius: 8,
    padding: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statusButtonActive: {
    backgroundColor: '#2A5848',
  },
});

export default EditTrek;