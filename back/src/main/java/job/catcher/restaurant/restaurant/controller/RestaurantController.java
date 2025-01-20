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

    @GetMapping("/search/v1")
    public ApiResponse<Object> searchRestaurantV1(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return ApiResponse.success(restaurantService.searchRestaurantV1(latitude, longitude));
    }

    @GetMapping("/search/v2")
    public ApiResponse<Object> searchRestaurantV2(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return ApiResponse.success(restaurantService.searchRestaurantV2(latitude, longitude));
    }

    @GetMapping("/search/v3")
    public ApiResponse<Object> searchRestaurantV3(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) {
        return ApiResponse.success(restaurantService.searchRestaurantV3(latitude, longitude));
    }

    @GetMapping("/all")
    public ApiResponse<Object> allSearchRestaurant() {
        return ApiResponse.success(restaurantService.findAll());
    }

    @PutMapping("/geo_hash")
    public ApiResponse<Object> updateGeoHash() {
        restaurantService.updateGeoHash();
        return ApiResponse.EMPTY;
    }
}
