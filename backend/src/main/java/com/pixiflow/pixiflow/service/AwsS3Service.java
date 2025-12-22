package com.pixiflow.pixiflow.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.HeadBucketRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.pixiflow.pixiflow.dto.FileUploadResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AwsS3Service {

  private final AmazonS3 amazonS3;

  @Value("${aws.s3.bucketName}")
  private String bucketName;

  @Value("${aws.s3.region}")
  private String region;

  public AwsS3Service(AmazonS3 amazonS3) {
    this.amazonS3 = amazonS3;
  }

  public FileUploadResponse uploadFile(byte[] fileBytes, String contentType) {
    if(!isS3Available()) {
      throw new RuntimeException("AWS S3 service is down");
    }

    try {
      InputStream inputStream = new ByteArrayInputStream(fileBytes);
      String fileContentType =
          "." + contentType.substring(6); // extracting file format(Eg: "image/png" -> "png"
      String fileName = UUID.randomUUID().toString() + fileContentType;

      PutObjectRequest putObjectRequest =
          new PutObjectRequest(bucketName, fileName, inputStream, null);
      amazonS3.putObject(putObjectRequest);

      String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
      return new FileUploadResponse(fileName, fileUrl);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public void deleteObjects(List<String> imageNames) {
    if(!isS3Available()) {
      throw new RuntimeException("AWS S3 service is down");
    }

    try {
      List<DeleteObjectsRequest.KeyVersion> keysToDelete = new ArrayList<>();
      for (String key : imageNames) {
        keysToDelete.add(new DeleteObjectsRequest.KeyVersion(key));
      }

      DeleteObjectsRequest deleteObjectsRequest =
          new DeleteObjectsRequest(bucketName).withKeys(keysToDelete).withQuiet(false);

      amazonS3.deleteObjects(deleteObjectsRequest);
    } catch (Exception ex) {
      throw new RuntimeException(ex.getMessage());
    }
  }

  private boolean isS3Available() {
    try {
      amazonS3.headBucket(
              new HeadBucketRequest(bucketName)
      );
      return true;
    } catch (SdkClientException e) {
      return false;
    }
  }
}
