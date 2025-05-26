import { TrekHostProps } from "../types/trek";

export const MOCK_TREKS: TrekHostProps[] = [
  {
    id: '1',
    name: 'Leo núi Fansipan',
    description: 'Tour leo núi Fansipan trong 2 ngày 1 đêm, khám phá đỉnh núi cao nhất Đông Dương với độ cao 3.143m.',
    location: 'Sa Pa, Lào Cai',
    duration: '2 ngày 1 đêm',
    rate: 4.8,
    price: 2500000,
    distance: 20,
    elevation: 3143,
    level: 'KHÓ',
    images: [
      'https://images.unsplash.com/photo-1576225106612-ea30b5bb16b0',
      'https://images.unsplash.com/photo-1576225106612-ea30b5bb16b0'
    ],
    start_date: '2024-11-10T01:00:00.000Z',
    end_date: '2024-11-11T10:00:00.000Z',
    booked: 2,
    total_slot: 10,
    available_slot: 8
  },
  {
    id: '2',
    name: 'Trekking Tà Năng - Phan Dũng',
    description: 'Hành trình xuyên rừng 3 ngày 2 đêm qua cung đường trekking nổi tiếng.',
    location: 'Lâm Đồng - Bình Thuận',
    duration: '3 ngày 2 đêm',
    rate: 4.9,
    price: 3500000,
    distance: 35,
    elevation: 1100,
    level: 'KHÓ',
    images: [
      'https://images.unsplash.com/photo-1576225106612-ea30b5bb16b0',
      'https://images.unsplash.com/photo-1576225106612-ea30b5bb16b0'
    ],
    start_date: '2024-12-01T01:00:00.000Z',
    end_date: '2024-12-03T10:00:00.000Z',
    booked: 5,
    total_slot: 15,
    available_slot: 10
  }
];

export const mockTrekService = {
  getHostTreks: async (): Promise<TrekHostProps[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_TREKS];
  },

  getTrekById: async (trekId: string): Promise<TrekHostProps | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TREKS.find(trek => trek.id === trekId);
  },

  createTrek: async (trekData: Omit<TrekHostProps, 'id' | 'rate'>): Promise<TrekHostProps> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTrek: TrekHostProps = {
      ...trekData,
      id: (MOCK_TREKS.length + 1).toString(),
      rate: 0
    };
    MOCK_TREKS.push(newTrek);
    return newTrek;
  },

  updateTrek: async (trekId: string, trekData: Partial<TrekHostProps>): Promise<TrekHostProps | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_TREKS.findIndex(trek => trek.id === trekId);
    if (index !== -1) {
      MOCK_TREKS[index] = {
        ...MOCK_TREKS[index],
        ...trekData
      };
      return MOCK_TREKS[index];
    }
    return undefined;
  },

  deleteTrek: async (trekId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_TREKS.findIndex(trek => trek.id === trekId);
    if (index !== -1) {
      MOCK_TREKS.splice(index, 1);
      return true;
    }
    return false;
  }
}; 