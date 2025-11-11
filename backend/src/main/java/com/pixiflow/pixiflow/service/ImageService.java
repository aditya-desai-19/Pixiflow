package com.pixiflow.pixiflow.service;

import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.dto.ImageResponseDTO;
import com.pixiflow.pixiflow.entity.Image;
import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.repository.ImageRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final CustomUserDetailsService customUserDetailsService;

    public ImageService(ImageRepository imageRepository, CustomUserDetailsService customUserDetailsService) {
        this.imageRepository = imageRepository;
        this.customUserDetailsService = customUserDetailsService;
    }

    public ResponseEntity<?> saveImage(@Valid FileUploadResponse fileUploadResponse) {
        User user = customUserDetailsService.getCurrentUser();
        if(user == null) {
            System.out.println("User not found");
            return ResponseEntity.notFound().build();
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
        return  new ImageResponseDTO(image.getId(), image.getImgUrl(), image.getUser().getId(), image.isDeleted(), image.getCreatedAt(), image.getUpdatedAt());
    }

    public ImageResponseDTO getImageById(String id) throws ImageNotFoundException {
        Image image = imageRepository.findById(id).orElseThrow(() -> new ImageNotFoundException("Image with " + id + " not found"));
        return convertImageToImageResponseDTO(image);
    }

    public Page<ImageResponseDTO> getAllImages(Pageable pageable) {
        Page<Image> images = imageRepository.findAll(pageable);
        Page<ImageResponseDTO> res = images.map(ImageService::convertImageToImageResponseDTO);
        return res;
    }
}
