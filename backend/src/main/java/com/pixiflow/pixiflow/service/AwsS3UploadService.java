package com.pixiflow.pixiflow.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.pixiflow.pixiflow.dto.FileUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class AwsS3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public AwsS3UploadService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public FileUploadResponse uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getName();
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file.getInputStream(), null);
        amazonS3.putObject(putObjectRequest);
        String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
        return new FileUploadResponse(fileName, fileUrl);
    }
}
