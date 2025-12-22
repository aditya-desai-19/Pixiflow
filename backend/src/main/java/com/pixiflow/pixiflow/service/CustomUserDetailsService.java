package com.pixiflow.pixiflow.service;

import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.repository.UserRepository;
import java.time.Instant;
import java.util.Collections;
import java.util.UUID;
import org.openapitools.model.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Not found"));

    return new org.springframework.security.core.userdetails.User(
        user.getEmail(), user.getPassword(), Collections.emptyList());
  }

  public ResponseEntity<String> saveUser(RegisterRequest registerRequest, PasswordEncoder encoder) {
    if (userRepository.findByEmail(registerRequest.getEmail()).isPresent())
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Taken");

    User newUser = new User();
    newUser.setId(UUID.randomUUID().toString());
    newUser.setName(registerRequest.getName());
    newUser.setEmail(registerRequest.getEmail());
    newUser.setPassword(encoder.encode(registerRequest.getPassword()));
    newUser.setDeleted(false);
    newUser.setCreatedAt(Instant.now());
    newUser.setUpdatedAt(Instant.now());
    userRepository.save(newUser);

    return ResponseEntity.ok("registered");
  }

  public User getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.getPrincipal() instanceof UserDetails) {
      UserDetails userDetails = (UserDetails) auth.getPrincipal();
      return userRepository
          .findByEmail(userDetails.getUsername())
          .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    return null;
  }
}
