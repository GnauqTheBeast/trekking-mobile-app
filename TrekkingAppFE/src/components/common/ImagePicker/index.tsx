import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Icon, Text } from '@rneui/themed';
import { theme } from '../../../theme';
import { launchImageLibrary } from 'react-native-image-picker';

interface ImagePickerProps {
  images: string[];
  onImagesSelected: (images: string[]) => void;
  maxImages?: number;
}

const CustomImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onImagesSelected,
  maxImages = 5
}) => {
  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Thông báo', 'Bạn đã đạt đến giới hạn số lượng ảnh.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const newImages = [...images, result.assets[0].uri || ''];
        onImagesSelected(newImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hình ảnh ({images.length}/{maxImages})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Icon name="add" size={40} color={theme.colors.grey3} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.grey3,
  },
  scrollView: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomImagePicker; 
