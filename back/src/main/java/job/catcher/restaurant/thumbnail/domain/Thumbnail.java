package job.catcher.restaurant.thumbnail.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "thumbnail")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Thumbnail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "url", nullable = false)
    private String url;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "table_name", nullable = false)
    private TableName tableName;

    @Column(name = "record_id", nullable = false)
    private Long recordId;

    @Builder
    public Thumbnail(String name, String originalName, String url, TableName tableName, Long recordId) {
        this.name = name;
        this.originalName = originalName;
        this.url = url;
        this.tableName = tableName;
        this.recordId = recordId;
    }
}
