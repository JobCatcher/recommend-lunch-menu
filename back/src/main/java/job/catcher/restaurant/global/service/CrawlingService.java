package job.catcher.restaurant.global.service;

import job.catcher.restaurant.global.response.RestaurantCrawlingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrawlingService {

    private final WebClient webClient;

    public Mono<List<RestaurantCrawlingDto>> fetchRestaurantData(double latitude, double longitude) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder
//                        .path("/restaurants/crawling")
                        .path("/api/restaurants/search")
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .build())
                .retrieve()
                .bodyToFlux(RestaurantCrawlingDto.class)
                .collectList();
    }
}
