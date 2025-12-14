package com.pixiflow.pixiflow.dto;

import java.time.Instant;

public class ImageResponseDTO {
  public String imageId;
  public String imageUrl;
  public String userId;
  public boolean isDeleted;
  public Instant createdAt;
  public Instant updatedAt;

  public ImageResponseDTO(
      String imageId,
      String imageUrl,
      String userId,
      boolean isDeleted,
      Instant createdAt,
      Instant updatedAt) {
    this.imageId = imageId;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
