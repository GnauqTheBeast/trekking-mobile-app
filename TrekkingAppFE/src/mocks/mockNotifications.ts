
export const MOCK_NOTIFICATIONS = [
    {
      id: '1',
      title: 'Đặt phòng thành công',
      message: 'Bạn đã đặt phòng khách sạn ABC thành công cho ngày 15/05/2025',
      type: 'booking',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      actionData: { bookingId: '123', screen: 'BookingDetails' }
    },
    {
      id: '2',
      title: 'Thanh toán thành công',
      message: 'Bạn đã thanh toán thành công cho đơn hàng #ABC123',
      type: 'payment',
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      actionData: { paymentId: '456', screen: 'PaymentDetails' }
    },
    {
      id: '3',
      title: 'Khuyến mãi 30% cho khách sạn',
      message: 'Nhân dịp hè 2025, giảm giá 30% cho tất cả khách sạn tại Đà Nẵng',
      type: 'promotion',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
      actionData: { promoId: '789', screen: 'PromotionDetails' }
    },
    {
      id: '4',
      title: 'Chuyến đi sắp tới',
      message: 'Hãy chuẩn bị cho chuyến đi Phú Quốc vào ngày mai',
      type: 'trip',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
      actionData: { tripId: '101', screen: 'TripDetails' }
    },
    {
      id: '5',
      title: 'Đánh giá khách sạn',
      message: 'Hãy để lại đánh giá về khách sạn XYZ sau chuyến đi của bạn',
      type: 'booking',
      isRead: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
      actionData: { reviewId: '202', screen: 'ReviewScreen' }
    }
  ];