package job.catcher.restaurant.restaurant.domain;

import lombok.Getter;

@Getter
public enum Category {

    KOREA("korea"),
    JAPAN("japan"),
    CHINA("china");

    private final String value;

    Category(String value) {
        this.value = value;
    }
}
