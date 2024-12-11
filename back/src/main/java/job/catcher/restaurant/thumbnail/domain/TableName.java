package job.catcher.restaurant.thumbnail.domain;

import lombok.Getter;

@Getter
public enum TableName {

    RESTAURANT("restaurant");

    private final String value;

    TableName(String value) {
        this.value = value;
    }
}
