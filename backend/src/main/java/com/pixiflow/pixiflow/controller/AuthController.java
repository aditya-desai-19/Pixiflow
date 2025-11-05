package com.pixiflow.pixiflow.controller;

import com.pixiflow.pixiflow.dto.AuthRequestDTO;
import com.pixiflow.pixiflow.dto.AuthResponseDTO;
import com.pixiflow.pixiflow.dto.UserDTO;
import com.pixiflow.pixiflow.service.CustomUserDetailsService;
import com.pixiflow.pixiflow.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthenticationManager authenticationManager;

    private CustomUserDetailsService customUserDetailsService;

    private JwtUtil jwt;

    private final PasswordEncoder encoder;

    public AuthController(AuthenticationManager am, CustomUserDetailsService uds, JwtUtil jwt, PasswordEncoder encoder) {
        this.authenticationManager = am;
        this.customUserDetailsService = uds;
        this.jwt = jwt;
        this.encoder = encoder;
    }

    @GetMapping("/test")
    public String test() {
        return "App is running";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDTO r){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(r.email, r.password));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        UserDetails ud = customUserDetailsService.loadUserByUsername(r.email);
        String token = jwt.generateToken(ud);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO u){
        return customUserDetailsService.saveUser(u, encoder);
    }
}
