package com.pixiflow.pixiflow.service;

import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.dto.ImageResponseDTO;
import com.pixiflow.pixiflow.entity.Image;
import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.exceptions.ImageListEmptyException;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.repository.ImageRepository;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

  private final ImageRepository imageRepository;
  private final CustomUserDetailsService customUserDetailsService;

  public ImageService(
      ImageRepository imageRepository, CustomUserDetailsService customUserDetailsService) {
    this.imageRepository = imageRepository;
    this.customUserDetailsService = customUserDetailsService;
  }

  public ResponseEntity<?> saveImage(@Valid FileUploadResponse fileUploadResponse)
      throws RuntimeException {
    User user = customUserDetailsService.getCurrentUser();
    if (user == null) {
      throw new RuntimeException("User can't be null");
    }

    Image newImage = new Image();
    newImage.setId(UUID.randomUUID().toString());
    newImage.setName(fileUploadResponse.fileName);
    newImage.setImgUrl(fileUploadResponse.fileUrl);
    newImage.setUser(user);
    newImage.setDeleted(false);
    newImage.setCreatedAt(Instant.now());

    imageRepository.save(newImage);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  private static ImageResponseDTO convertImageToImageResponseDTO(Image image) {
    return new ImageResponseDTO(
        image.getId(),
        image.getImgUrl(),
        image.getUser().getId(),
        image.isDeleted(),
        image.getCreatedAt(),
        image.getUpdatedAt());
  }

  public ImageResponseDTO getImageById(String id) throws ImageNotFoundException, RuntimeException {
    User user = customUserDetailsService.getCurrentUser();
    if (user == null) {
      throw new RuntimeException("User can't be null");
    }
    Image image = imageRepository.getImageByImageId(user.getId(), id);

    if (image == null) {
      throw new ImageNotFoundException("Image not found");
    }
    return convertImageToImageResponseDTO(image);
  }

  public Page<ImageResponseDTO> getAllImages(Pageable pageable) throws RuntimeException {
    User user = customUserDetailsService.getCurrentUser();
    if (user == null) {
      throw new RuntimeException("User can't be null");
    }

    Page<Image> images = imageRepository.getAllImagesByUserId(pageable, user.getId());
    Page<ImageResponseDTO> res = images.map(ImageService::convertImageToImageResponseDTO);
    return res;
  }

  public void deleteImages(List<String> imageIds) throws ImageListEmptyException, RuntimeException {
    User user = customUserDetailsService.getCurrentUser();
    if (user == null) {
      throw new RuntimeException("User can't be null");
    }

    if (imageIds.isEmpty()) {
      throw new ImageListEmptyException("imageIds can't be null");
    }

    imageRepository.deleteImagesByImageIdsAndUserId(imageIds, user.getId());
  }

  public List<String> getImagesNames(List<String> imageIds)
      throws ImageListEmptyException, RuntimeException {
    User user = customUserDetailsService.getCurrentUser();
    if (user == null) {
      throw new RuntimeException("User can't be null");
    }

    if (imageIds.isEmpty()) {
      throw new ImageListEmptyException("imageIds can't be null");
    }

    return imageRepository.getAllImagesByImageIdsAndUserId(imageIds, user.getId()).stream()
        .map(Image::getName)
        .toList();
  }
}
