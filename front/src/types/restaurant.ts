interface ReviewAndRating {
  별점?: string;
  방문자리뷰?: string;
  블로그리뷰?: string;
}

export interface RestaurantInfo extends ReviewAndRating {
  title: string;
  latitude: number;
  longitude: number;
  blogReview: string;
  countOfVisitorReview: number;
  rating: number;
  category: string;
  images: string[];
}
