package job.catcher.restaurant.restaurant.controller;

import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import job.catcher.restaurant.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    private final RestaurantService restaurantService;

    @GetMapping("/search")
    public List<Restaurant> searchRestaurant(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return restaurantService.searchRestaurant(latitude, longitude);
    }

    @GetMapping("/all")
    public List<Restaurant> allSearchRestaurant() {
        return restaurantRepository.findAll();
    }
}
