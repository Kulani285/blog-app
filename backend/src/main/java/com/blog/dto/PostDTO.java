package com.blog.dto;

import com.blog.entity.Post;

import java.time.LocalDateTime;
import java.util.List;

public class PostDTO {

    public static class Request {
        private String title;
        private String content;
        private String excerpt;
        private String coverImage;
        private Post.PostStatus status;
        private List<String> tags;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getCoverImage() { return coverImage; }
        public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
        public Post.PostStatus getStatus() { return status; }
        public void setStatus(Post.PostStatus status) { this.status = status; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
    }

    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String excerpt;
        private String coverImage;
        private String slug;
        private Post.PostStatus status;
        private AuthorInfo author;
        private List<String> tags;
        private Integer viewCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getCoverImage() { return coverImage; }
        public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public Post.PostStatus getStatus() { return status; }
        public void setStatus(Post.PostStatus status) { this.status = status; }
        public AuthorInfo getAuthor() { return author; }
        public void setAuthor(AuthorInfo author) { this.author = author; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
        public Integer getViewCount() { return viewCount; }
        public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class Summary {
        private Long id;
        private String title;
        private String excerpt;
        private String coverImage;
        private String slug;
        private Post.PostStatus status;
        private AuthorInfo author;
        private List<String> tags;
        private Integer viewCount;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getExcerpt() { return excerpt; }
        public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
        public String getCoverImage() { return coverImage; }
        public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
        public Post.PostStatus getStatus() { return status; }
        public void setStatus(Post.PostStatus status) { this.status = status; }
        public AuthorInfo getAuthor() { return author; }
        public void setAuthor(AuthorInfo author) { this.author = author; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
        public Integer getViewCount() { return viewCount; }
        public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class AuthorInfo {
        private Long id;
        private String username;
        private String displayName;
        private String avatarUrl;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }
}
