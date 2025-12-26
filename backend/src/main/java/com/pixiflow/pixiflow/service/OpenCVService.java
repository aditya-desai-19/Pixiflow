package com.pixiflow.pixiflow.service;

import java.io.IOException;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OpenCVService {

  public byte[] resizeImage(MultipartFile file, double height, double width) {
    try {
      Mat image = createMatObject(file.getBytes());

      Mat resizedImage = new Mat();
      Size size = new Size(width, height);
      Imgproc.resize(image, resizedImage, size);

      MatOfByte matOfByte = new MatOfByte();
      String fileContentType = "." + file.getContentType().substring(6);
      Imgcodecs.imencode(fileContentType, resizedImage, matOfByte);

      return matOfByte.toArray();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private Mat createMatObject(byte[] fileBytes) {
    try {
      MatOfByte matOfByte = new MatOfByte(fileBytes);

      // create mat object from input file
      Mat image = Imgcodecs.imdecode(matOfByte, Imgcodecs.IMREAD_COLOR);

      if (image.empty()) {
        throw new IOException("Failed to decode image from multipart file.");
      }

      return image;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
