package job.catcher.restaurant.restaurant.controller;

import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import job.catcher.restaurant.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    private final RestaurantRepository restaurantRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/search")
    public List<Restaurant> searchRestaurant(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return restaurantService.searchRestaurant(latitude, longitude);
    }

    @GetMapping
    public String getRestaurant(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("precision") Integer precision
    ) {
        return GeoHashUtil.encode(latitude, longitude, precision);
    }

    @GetMapping("/test")
    public List<String> getRestaurantTest(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return GeoHashUtil.getNeighbors(latitude, longitude, 6);
    }

    @Transactional
    @PutMapping("/update")
    public void updateRestaurant() {
        List<Restaurant> all = restaurantRepository.findAll();
        for (Restaurant r: all) {
            String geoHash = GeoHashUtil.encode(r.getLatitude(), r.getLongitude(), 6);
            r.updateGeoHash(geoHash);
        }
    }
}
