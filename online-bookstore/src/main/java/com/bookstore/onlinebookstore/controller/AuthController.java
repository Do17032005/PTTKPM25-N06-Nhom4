package com.bookstore.onlinebookstore.controller;

import com.bookstore.onlinebookstore.dto.AuthRequest;
import com.bookstore.onlinebookstore.dto.AuthResponse;
import com.bookstore.onlinebookstore.model.Role;
import com.bookstore.onlinebookstore.model.User;
import com.bookstore.onlinebookstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user = userService.getUserByEmail(request.getEmail());

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid credentials"));
            }

            if (!user.getActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("User account is inactive"));
            }

            AuthResponse response = new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().toString()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            if (userService.getUserByEmailIfExists(request.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Email already registered"));
            }

            User newUser = new User();
            newUser.setFullName(request.getFullName());
            newUser.setEmail(request.getEmail());
            newUser.setPassword(request.getPassword());
            newUser.setRole(Role.MEMBER);
            newUser.setActive(true);

            User createdUser = userService.createUser(newUser);

            AuthResponse response = new AuthResponse(
                createdUser.getId(),
                createdUser.getEmail(),
                createdUser.getFullName(),
                createdUser.getRole().toString()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    // Helper classes
    static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}