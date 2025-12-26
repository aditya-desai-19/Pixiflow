package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.service.AwsS3Service;
import com.pixiflow.pixiflow.service.ImageService;
import com.pixiflow.pixiflow.service.OpenCVService;
import java.util.List;
import org.openapitools.api.ImagesApi;
import org.openapitools.model.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ImageController implements ImagesApi {

  private final AwsS3Service awsS3Service;
  private final ImageService imageService;
  private final OpenCVService openCVService;

  public ImageController(
      AwsS3Service awsS3Service, ImageService imageService, OpenCVService openCVService) {
    this.awsS3Service = awsS3Service;
    this.imageService = imageService;
    this.openCVService = openCVService;
  }

  @Override
  public ResponseEntity<String> deleteImagesByIds(DeleteImagesRequest deleteImagesRequest) {
    List<String> imagesNames = imageService.getImagesNames(deleteImagesRequest.getImageIds());

    awsS3Service.deleteObjects(imagesNames);
    imageService.deleteImages(deleteImagesRequest.getImageIds());

    return ResponseEntity.ok("Successfully deleted images");
  }

  @Override
  public ResponseEntity<ImageResponsePage> getAllImages(Integer page, Integer pageSize) {
    Pageable pageable = PageRequest.of(page, pageSize);
    ImageResponsePage responsePage = imageService.getAllImages(pageable);
    return ResponseEntity.ok(responsePage);
  }

  @Override
  public ResponseEntity<ImageDetailsResponse> getImageById(@PathVariable String id) {
    return ResponseEntity.ok(imageService.getImageById(id));
  }

  @Override
  public ResponseEntity<String> uploadImage(MultipartFile file, Integer height, Integer width) {
    byte[] resizedImage = openCVService.resizeImage(file, height, width);

    FileUploadResponse response = awsS3Service.uploadFile(resizedImage, file.getContentType());

    imageService.saveImage(response);

    return ResponseEntity.ok(response.fileUrl);
  }
}
