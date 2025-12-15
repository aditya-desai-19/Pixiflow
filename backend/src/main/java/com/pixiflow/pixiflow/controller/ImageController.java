package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.dto.DeleteImagesRequestDTO;
import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.dto.ImageResponseDTO;
import com.pixiflow.pixiflow.exceptions.AwsS3Exception;
import com.pixiflow.pixiflow.exceptions.ImageIdsListEmptyException;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.service.AwsS3Service;
import com.pixiflow.pixiflow.service.ImageService;
import com.pixiflow.pixiflow.service.OpenCVService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
      @RequestParam("width") double width) {
    try {
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
    } catch (AwsS3Exception ex) {
      System.out.println(ex.getMessage());
      System.out.println("Some error occured in AWS S3 service");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } catch (Exception ex) {
      System.out.println(ex.getMessage());
      System.out.println("Some error occured");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/{id}")
  public ImageResponseDTO getImageById(@PathVariable String id) throws ImageNotFoundException {
    return imageService.getImageById(id);
  }

  // todo correct way to handle exception
  @GetMapping
  public Page<ImageResponseDTO> getAllImages(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int pageSize) {
    Pageable pageable = PageRequest.of(page, pageSize);
    return imageService.getAllImages(pageable);
  }

  @DeleteMapping
  public ResponseEntity<?> deleteImages(
      @RequestBody DeleteImagesRequestDTO deleteImagesRequestDTO) {
    try {
      List<String> imagesNames = imageService.getImagesNames(deleteImagesRequestDTO.getImageIds());

      imageService.deleteImages(deleteImagesRequestDTO.getImageIds());

      awsS3Service.deleteObjects(imagesNames);

      return ResponseEntity.ok("Successfully deleted images");
    } catch (ImageIdsListEmptyException ex) {
      System.out.println("Image ids list can't be empty");
      return ResponseEntity.badRequest().build();
    } catch (AwsS3Exception ex) {
      System.out.println("Some error occured while deleting objects in AWS S3");
      return ResponseEntity.internalServerError().build();
    }
  }
}
