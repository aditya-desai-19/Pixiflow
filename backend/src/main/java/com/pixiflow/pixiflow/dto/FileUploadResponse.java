package com.pixiflow.pixiflow.dto;

import jakarta.validation.constraints.NotBlank;

public class FileUploadResponse {
    @NotBlank
    public String fileName;

    @NotBlank
    public String fileUrl;

    public FileUploadResponse(String fileName, String fileUrl) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
    }
}
