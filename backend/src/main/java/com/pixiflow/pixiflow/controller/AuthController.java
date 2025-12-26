package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.service.CustomUserDetailsService;
import com.pixiflow.pixiflow.util.JwtUtil;
import java.time.Duration;
import org.openapitools.api.AuthApi;
import org.openapitools.model.GenericResponse;
import org.openapitools.model.LoginRequest;
import org.openapitools.model.RegisterRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
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
  public ResponseEntity<Void> logoutUser() {
    ResponseCookie cookie =
        ResponseCookie.from("access_token", null)
            .httpOnly(true)
            .secure(false) // true in prod
            .sameSite("Lax") // None in prod
            .path("/")
            .maxAge(0)
            .build();

    return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  @Override
  public ResponseEntity<Void> loginUser(LoginRequest loginRequest) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(), loginRequest.getPassword()));
    UserDetails ud = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
    String token = jwt.generateToken(ud);

    ResponseCookie cookie =
        ResponseCookie.from("access_token", token)
            .httpOnly(true)
            .secure(false) // true in prod
            .sameSite("Lax") // None in prod
            .path("/")
            .maxAge(Duration.ofDays(1))
            .build();

    return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
  }

  @Override
  public ResponseEntity<GenericResponse> registerUser(RegisterRequest registerRequest) {
    return customUserDetailsService.saveUser(registerRequest, encoder);
  }

  @Override
  public ResponseEntity<GenericResponse> testApp() {
    return ResponseEntity.ok(new GenericResponse().message("App is running"));
  }
}
