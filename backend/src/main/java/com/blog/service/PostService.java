package com.blog.service;

import com.blog.dto.PostDTO;
import com.blog.entity.Post;
import com.blog.entity.Tag;
import com.blog.entity.User;
import com.blog.repository.PostRepository;
import com.blog.repository.TagRepository;
import com.blog.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    public Page<PostDTO.Summary> getPublishedPosts(Pageable pageable) {
        return postRepository.findByStatus(Post.PostStatus.PUBLISHED, pageable)
                .map(this::toSummary);
    }

    public Page<PostDTO.Summary> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable).map(this::toSummary);
    }

    public PostDTO.Response getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
String username = SecurityContextHolder.getContext().getAuthentication().getName();
    User requester = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    if (!post.getAuthor().getUsername().equals(username) && requester.getRole() != User.Role.ADMIN) {
        throw new RuntimeException("You are not allowed to edit this post");
    }
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return toResponse(post);
    }

    public PostDTO.Response getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return toResponse(post);
    }

    public PostDTO.Response createPost(PostDTO.Request request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setCoverImage(request.getCoverImage());
        post.setStatus(request.getStatus() != null ? request.getStatus() : Post.PostStatus.DRAFT);
        post.setAuthor(author);
        post.setTags(resolveTags(request.getTags()));

        return toResponse(postRepository.save(post));
    }

    public PostDTO.Response updatePost(Long id, PostDTO.Request request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (request.getTitle() != null) post.setTitle(request.getTitle());
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getExcerpt() != null) post.setExcerpt(request.getExcerpt());
        if (request.getCoverImage() != null) post.setCoverImage(request.getCoverImage());
        if (request.getStatus() != null) post.setStatus(request.getStatus());
        if (request.getTags() != null) post.setTags(resolveTags(request.getTags()));

        return toResponse(postRepository.save(post));
    }

   public void deletePost(Long id) {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Post not found"));
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    User requester = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    if (!post.getAuthor().getUsername().equals(username) && requester.getRole() != User.Role.ADMIN) {
        throw new RuntimeException("You are not allowed to delete this post");
    }
    postRepository.deleteById(id);
}

    public Page<PostDTO.Summary> searchPosts(String query, Pageable pageable) {
        return postRepository.search(query, pageable).map(this::toSummary);
    }

    public Page<PostDTO.Summary> getPostsByTag(String tag, Pageable pageable) {
        return postRepository.findByTag(tag, pageable).map(this::toSummary);
    }

    private List<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null) return new ArrayList<>();
        return tagNames.stream().map(name ->
            tagRepository.findByName(name).orElseGet(() -> tagRepository.save(new Tag(name)))
        ).collect(Collectors.toList());
    }

    private PostDTO.Response toResponse(Post post) {
        PostDTO.Response dto = new PostDTO.Response();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setExcerpt(post.getExcerpt());
        dto.setCoverImage(post.getCoverImage());
        dto.setSlug(post.getSlug());
        dto.setStatus(post.getStatus());
        dto.setViewCount(post.getViewCount());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        if (post.getAuthor() != null) dto.setAuthor(toAuthorInfo(post.getAuthor()));
        dto.setTags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        return dto;
    }

    private PostDTO.Summary toSummary(Post post) {
        PostDTO.Summary dto = new PostDTO.Summary();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setExcerpt(post.getExcerpt());
        dto.setCoverImage(post.getCoverImage());
        dto.setSlug(post.getSlug());
        dto.setStatus(post.getStatus());
        dto.setViewCount(post.getViewCount());
        dto.setCreatedAt(post.getCreatedAt());
        if (post.getAuthor() != null) dto.setAuthor(toAuthorInfo(post.getAuthor()));
        dto.setTags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        return dto;
    }

    private PostDTO.AuthorInfo toAuthorInfo(User user) {
        PostDTO.AuthorInfo info = new PostDTO.AuthorInfo();
        info.setId(user.getId());
        info.setUsername(user.getUsername());
        info.setDisplayName(user.getDisplayName());
        info.setAvatarUrl(user.getAvatarUrl());
        return info;
    }
}
