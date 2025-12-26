package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.service.CustomUserDetailsService;
import org.openapitools.api.UserApi;
import org.openapitools.model.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController implements UserApi {
  private final CustomUserDetailsService customUserDetailsService;

  public UserController(CustomUserDetailsService customUserDetailsService) {
    this.customUserDetailsService = customUserDetailsService;
  }

  @Override
  public ResponseEntity<UserResponse> getUser() {
    UserResponse userResponse = customUserDetailsService.getNameAndEmailOfCurrentUser();
    return ResponseEntity.ok(userResponse);
  }
}
