package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.dto.DeleteImagesRequestDTO;
import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.dto.ImageResponseDTO;
import com.pixiflow.pixiflow.exceptions.AwsS3Exception;
import com.pixiflow.pixiflow.exceptions.ImageListEmptyException;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.service.AwsS3Service;
import com.pixiflow.pixiflow.service.ImageService;
import com.pixiflow.pixiflow.service.OpenCVService;
import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
public class ImageController {

  private final AwsS3Service awsS3Service;
  private final ImageService imageService;
  private final OpenCVService openCVService;

  public ImageController(
      AwsS3Service awsS3Service, ImageService imageService, OpenCVService openCVService) {
    this.awsS3Service = awsS3Service;
    this.imageService = imageService;
    this.openCVService = openCVService;
  }

  @PostMapping("/upload")
  public ResponseEntity<?> handleFileUpload(
      @RequestParam("file") MultipartFile file,
      @RequestParam("height") double height,
      @RequestParam("width") double width)
      throws RuntimeException, AwsS3Exception, IOException {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("Please select a file to upload.");
    }

    // Validate file size (e.g., max 5MB)
    if (file.getSize() > 5 * 1024 * 1024) {
      return ResponseEntity.badRequest().body("File size exceeds the limit of 5MB.");
    }

    if (!file.getContentType().startsWith("image/")) {
      return ResponseEntity.badRequest().body("Only image files are allowed.");
    }

    byte[] resizedImage = openCVService.resizeImage(file, height, width);

    FileUploadResponse response = awsS3Service.uploadFile(resizedImage, file.getContentType());

    imageService.saveImage(response);

    return ResponseEntity.ok(response.fileUrl);
  }

  @GetMapping("/{id}")
  public ImageResponseDTO getImageById(@PathVariable String id)
      throws ImageNotFoundException, RuntimeException {
    return imageService.getImageById(id);
  }

  @GetMapping
  public Page<ImageResponseDTO> getAllImages(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int pageSize)
      throws RuntimeException {
    Pageable pageable = PageRequest.of(page, pageSize);
    return imageService.getAllImages(pageable);
  }

  @DeleteMapping
  public ResponseEntity<?> deleteImages(@RequestBody DeleteImagesRequestDTO deleteImagesRequestDTO)
      throws RuntimeException, ImageListEmptyException, AwsS3Exception {
    List<String> imagesNames = imageService.getImagesNames(deleteImagesRequestDTO.getImageIds());

    imageService.deleteImages(deleteImagesRequestDTO.getImageIds());

    awsS3Service.deleteObjects(imagesNames);

    return ResponseEntity.ok("Successfully deleted images");
  }
}
