export const validateFormData = (formData: any) => {
    const {
      name, description, price, total_slot,
      start_date, end_date, duration,
      distance, elevation, location, images
    } = formData;
  
    if (!name.trim()) return 'Tên trek là bắt buộc.';
    if (!description.trim()) return 'Mô tả trek là bắt buộc.';
    if (price <= 0) return 'Giá phải lớn hơn 0.';
    if (total_slot < 1) return 'Số lượng slot phải lớn hơn 0.';
    if (new Date(start_date) >= new Date(end_date)) return 'Thời gian bắt đầu phải trước thời gian kết thúc.';
    if (!duration.trim()) return 'Thời gian trek là bắt buộc.';
    if (distance < 0) return 'Khoảng cách không hợp lệ.';
    if (elevation < 0) return 'Độ cao không hợp lệ.';
    if (!location.trim()) return 'Địa điểm là bắt buộc.';
    if (images.length === 0) return 'Cần chọn ít nhất 1 ảnh.';
    
    return null; 
};