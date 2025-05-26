export const solveImageUrl = (image: string): string[] => {
    try {
        const imagesArray = JSON.parse(image);
        return Array.isArray(imagesArray) ? imagesArray.filter((url: string) => typeof url === 'string') : [];
      } catch (error) {
        console.error("Lỗi khi parse JSON images:", error);
        return [];
      }
}