package com.adminster.java.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String Type,
        Long expiresIN
) {
    public AuthResponse(String accessToken, String refreshToken, Long expiresIN){
        this(accessToken, refreshToken,"Bearer", expiresIN);
    }
}
