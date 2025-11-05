package com.pixiflow.pixiflow.service;

import com.pixiflow.pixiflow.dto.UserDTO;
import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Not found"));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }

    public ResponseEntity<?> saveUser(UserDTO u, PasswordEncoder encoder) {
        if(userRepository.findByEmail(u.email).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).body("Taken");

        User newUser = new User();
        newUser.setId(UUID.randomUUID().toString());
        newUser.setName(u.name);
        newUser.setEmail(u.email);
        newUser.setPassword(encoder.encode(u.password));
        newUser.setDeleted(false);
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(Instant.now());
        userRepository.save(newUser);

        return ResponseEntity.ok("registered");
    }
}
