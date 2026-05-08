package com.adminster.java.service;


import com.adminster.java.dto.request.LoginRequest;
import com.adminster.java.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String refreshToken);
    void logout(String token);
}
