package com.pixiflow.pixiflow.exceptions;

import java.io.IOException;

import org.openapitools.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            new ErrorResponse(ex.getMessage())
    );
  }

  @ExceptionHandler(ImageNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleImageNotFoundException(ImageNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            new ErrorResponse(ex.getMessage())
    );
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
              new ErrorResponse(ex.getMessage())
      );
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
              new ErrorResponse(ex.getMessage())
      );
  }

  @ExceptionHandler(ImageListEmptyException.class)
  public ResponseEntity<ErrorResponse> handleImageIdsListEmptyException(
      ImageListEmptyException ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
              new ErrorResponse(ex.getMessage())
      );
  }

  @ExceptionHandler(IOException.class)
  public ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
              new ErrorResponse(ex.getMessage())
      );
  }
}
