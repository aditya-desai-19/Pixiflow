package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.dto.ImageResponseDTO;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.service.AwsS3UploadService;
import com.pixiflow.pixiflow.service.ImageService;
import com.pixiflow.pixiflow.service.OpenCVService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final AwsS3UploadService awsS3UploadService;
    private final ImageService imageService;
    private final OpenCVService openCVService;

    public ImageController(AwsS3UploadService awsS3UploadService, ImageService imageService, OpenCVService openCVService) {
        this.awsS3UploadService = awsS3UploadService;
        this.imageService = imageService;
        this.openCVService = openCVService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("height") double height, @RequestParam("width") double width) {
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

            FileUploadResponse response = awsS3UploadService.uploadFile(resizedImage, file.getContentType());

            imageService.saveImage(response);

            return ResponseEntity.ok(response.fileUrl);
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Some error occured");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ImageResponseDTO getImageById(@PathVariable String id) throws ImageNotFoundException {
        return imageService.getImageById(id);
    }

    @GetMapping
    public Page<ImageResponseDTO> getAllImages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return imageService.getAllImages(pageable);
    }
}
