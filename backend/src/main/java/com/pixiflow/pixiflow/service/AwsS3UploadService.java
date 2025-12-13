package com.pixiflow.pixiflow.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.pixiflow.pixiflow.dto.FileUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
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

    public FileUploadResponse uploadFile(byte[] fileBytes, String contentType) throws IOException {
        InputStream inputStream = new ByteArrayInputStream(fileBytes);
        String fileContentType = "." + contentType.substring(6); //extracting file format(Eg: "image/png" -> "png"
        String fileName = UUID.randomUUID().toString() + fileContentType;

        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, inputStream, null);
        amazonS3.putObject(putObjectRequest);

        String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
        return new FileUploadResponse(fileName, fileUrl);
    }
}
