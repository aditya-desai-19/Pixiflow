package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.service.CustomUserDetailsService;
import com.pixiflow.pixiflow.util.JwtUtil;
import org.openapitools.api.AuthApi;
import org.openapitools.model.LoginRequest;
import org.openapitools.model.LoginResponse;
import org.openapitools.model.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController implements AuthApi {

  private AuthenticationManager authenticationManager;

  private CustomUserDetailsService customUserDetailsService;

  private JwtUtil jwt;

  private final PasswordEncoder encoder;

  public AuthController(
      AuthenticationManager am,
      CustomUserDetailsService uds,
      JwtUtil jwt,
      PasswordEncoder encoder) {
    this.authenticationManager = am;
    this.customUserDetailsService = uds;
    this.jwt = jwt;
    this.encoder = encoder;
  }

  @Override
  public ResponseEntity<LoginResponse> loginUser(LoginRequest loginRequest) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(), loginRequest.getPassword()));
    UserDetails ud = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
    String token = jwt.generateToken(ud);
    return ResponseEntity.ok(new LoginResponse().token(token));
  }

  @Override
  public ResponseEntity<String> registerUser(RegisterRequest registerRequest) {
    return customUserDetailsService.saveUser(registerRequest, encoder);
  }

  @Override
  public ResponseEntity<String> testApp() {
    return ResponseEntity.ok("App is running");
  }
}
