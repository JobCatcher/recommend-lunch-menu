interface ReviewAndRating {
  별점?: string;
  방문자리뷰?: string;
  블로그리뷰?: string;
}

export interface RestaurantInfo extends ReviewAndRating {
  restaurantId: number;
  title: string;
  latitude: number;
  longitude: number;
  blogReview: string;
  reviewCount: number;
  rating: number;
  category: string;
  thumbnails: {url: string; thumbnailId: number}[];
}
