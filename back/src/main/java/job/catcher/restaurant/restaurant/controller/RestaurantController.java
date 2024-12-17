package job.catcher.restaurant.restaurant.controller;

import job.catcher.restaurant.global.response.ApiResponse;
import job.catcher.restaurant.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/search")
    public ApiResponse<Object> searchRestaurant(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return ApiResponse.success(restaurantService.searchRestaurantV1(latitude, longitude));
    }

    @GetMapping("/all")
    public ApiResponse<Object> allSearchRestaurant() {
        return ApiResponse.success(restaurantService.findAll());
    }
}
