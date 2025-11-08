package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.service.AwsS3UploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final AwsS3UploadService awsS3UploadService;

    public ImageController(AwsS3UploadService awsS3UploadService) {
        this.awsS3UploadService = awsS3UploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            String url = awsS3UploadService.uploadFile(file);
            return ResponseEntity.ok(url);
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Some error occured");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
