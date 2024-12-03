package job.catcher.restaurant.restaurant.service;

import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> searchRestaurant(double latitude, double longitude) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        return restaurantRepository.findRestaurantInRange(geoHashs);
    }
}
