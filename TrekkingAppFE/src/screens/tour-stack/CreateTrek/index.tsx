import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import ImagePicker from '../../../components/common/ImagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { uploadToCloudinary } from '../../../utils/cloudinary.util';
import { validateFormData } from '../../../utils/trek.util';
import { trekService } from '../../../services/trek.service';
import { AuthContext } from '../../../context/AuthProvider';
import ReturnButton from '../../../components/common/ReturnButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type TourStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type TourLevel = 'EASY' | 'MODERATE' | 'HARD';

interface CreateTrekFormData {
  name: string;
  description: string;
  host_id: string;
  price: number;
  level: TourLevel;
  distance: number;
  elevation: number;
  duration: string;
  location: string;
  images: string;
  rate: string;
  slot: number;
  available_slot: number;
  status: TourStatus;
  start_at: string;
  end_at: string;
}

const CreateTrek = () => {

  const auth = useContext(AuthContext);
  const id = auth!.user!.id;
  const token = auth?.token;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [formData, setFormData] = useState<CreateTrekFormData>({
    name: '',
    description: '',
    host_id: id,
    price: 0,
    level: 'MODERATE',
    distance: 0,
    elevation: 0,
    duration: '',
    location: '',
    images: '[]',
    rate: '0',
    slot: 10,
    available_slot: 10,
    status: 'DRAFT',
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString()
  });

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const newDate = new Date(formData.start_at);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setFormData({ ...formData, start_at: newDate.toISOString() });
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.start_at);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, start_at: newDate.toISOString() });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const newDate = new Date(formData.end_at);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setFormData({ ...formData, end_at: newDate.toISOString() });
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.end_at);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFormData({ ...formData, end_at: newDate.toISOString() });
    }
  };

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Host id: ", formData.host_id)
      const errorMessage = validateFormData(formData);
      if (errorMessage) {
        Alert.alert('Lỗi dữ liệu', errorMessage);
        return;
      }

      const submitData = {
        ...formData,
        images: formData.images === '[]' ? '[]' : formData.images
      };

      const response = await trekService.createTrek(submitData);
      const trekData = response.data.data;

      if (trekData) {
        Alert.alert('Thành công', 'Tạo tour thành công!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating trek:', error);
      Alert.alert('Lỗi', 'Không thể tạo tour. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesSelected = async (selectedImages: string[]) => {
    try {
      setLoading(true);
      const uploadPromises = selectedImages.map(uploadToCloudinary);
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({ ...formData, images: JSON.stringify(uploadedUrls) });
    } catch (error) {
      console.error('Error handling image selection:', error);
      Alert.alert('Lỗi', 'Không thể tải lên hình ảnh. Vui lòng thử lại.');
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
          label="Tên Tour"
          value={formData.name}
          onChangeText={(text: string) => setFormData({ ...formData, name: text })}
          placeholder="Nhập tên tour"
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <Input
          label="Mô tả"
          value={formData.description}
          onChangeText={(text: string) => setFormData({ ...formData, description: text })}
          placeholder="Nhập mô tả tour"
          multiline
          numberOfLines={4}
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <Input
          label="Giá (VNĐ)"
          value={formData.price.toString()}
          onChangeText={(text: string) => setFormData({ ...formData, price: parseInt(text) || 0 })}
          placeholder="Nhập giá tour"
          keyboardType="numeric"
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <Input
          label="Số lượng slot"
          value={formData.slot.toString()}
          onChangeText={(text: string) => {
            const total = parseInt(text) || 0;
            setFormData({
              ...formData,
              slot: total,
              available_slot: total
            });
          }}
          placeholder="Nhập số lượng slot"
          keyboardType="numeric"
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Thời gian bắt đầu:</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1, marginRight: 10 }]}
              onPress={showStartDatepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.start_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1 }]}
              onPress={showStartTimepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.start_at).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={new Date(formData.start_at)}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          {showStartTimePicker && (
            <DateTimePicker
              value={new Date(formData.start_at)}
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
                {new Date(formData.end_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateButton, { flex: 1 }]}
              onPress={showEndTimepicker}
            >
              <Text style={styles.dateText}>
                {new Date(formData.end_at).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
          {showEndPicker && (
            <DateTimePicker
              value={new Date(formData.end_at)}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date(formData.end_at)}
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
          placeholder="Nhập thời gian tour"
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <View style={styles.rowContainer}>
          <Input
            containerStyle={styles.halfInput}
            label="Khoảng cách (km)"
            value={formData.distance.toString()}
            onChangeText={(text: string) => setFormData({ ...formData, distance: parseInt(text) || 0 })}
            placeholder="Nhập khoảng cách"
            keyboardType="numeric"
            labelStyle={styles.inputLabel}
            inputStyle={styles.input}
          />

          <Input
            containerStyle={styles.halfInput}
            label="Độ cao (m)"
            value={formData.elevation.toString()}
            onChangeText={(text: string) => setFormData({ ...formData, elevation: parseInt(text) || 0 })}
            placeholder="Nhập độ cao"
            keyboardType="numeric"
            labelStyle={styles.inputLabel}
            inputStyle={styles.input}
          />
        </View>

        <Input
          label="Địa điểm"
          value={formData.location}
          onChangeText={(text: string) => setFormData({ ...formData, location: text })}
          placeholder="Nhập địa điểm"
          labelStyle={styles.inputLabel}
          inputStyle={styles.input}
        />

        <View style={styles.levelContainer}>
          <Text style={styles.label}>Mức độ khó:</Text>
          <View style={styles.levelButtons}>
            {(['EASY', 'MODERATE', 'HARD'] as TourLevel[]).map((level) => (
              <Button
                key={level}
                title={level}
                type={formData.level === level ? 'solid' : 'outline'}
                onPress={() => setFormData({ ...formData, level })}
                buttonStyle={[
                  styles.levelButton,
                  formData.level === level && styles.levelButtonActive
                ]}
                titleStyle={[
                  styles.buttonText,
                  formData.level === level ? styles.activeButtonText : styles.inactiveButtonText
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Trạng thái:</Text>
          <View style={styles.statusButtons}>
            {(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as TourStatus[]).map((status) => (
              <Button
                key={status}
                title={status}
                type={formData.status === status ? 'solid' : 'outline'}
                onPress={() => setFormData({ ...formData, status })}
                buttonStyle={[
                  styles.statusButton,
                  formData.status === status && styles.statusButtonActive
                ]}
                titleStyle={[
                  styles.buttonText,
                  formData.status === status ? styles.activeButtonText : styles.inactiveButtonText
                ]}
              />
            ))}
          </View>
        </View>

        <ImagePicker
          images={JSON.parse(formData.images)}
          onImagesSelected={handleImagesSelected}
          maxImages={5}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Tạo Tour"
            onPress={handleSubmit}
            buttonStyle={styles.button}
            titleStyle={styles.submitButtonText}
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
      paddingHorizontal: 16,
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
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
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

export default CreateTrek;
