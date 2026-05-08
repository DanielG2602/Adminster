package com.adminster.java.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration")
    private Long expiration;

    @Value("${jwt.refresh-expiration")
    private Long refreshExpiration;

    public String gerarToken (String email, String role){
        return buildToken(email, role, expiration);
    }

    public String gerarRefreshToken (String email, String role){
        return buildToken(email, role, refreshExpiration);
    }

    public String buildToken (String email, String role, Long expiration){
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    public String extrairEmail(String token){
        return extrairClaims(token).getSubject();
    }

    public String extrairJti(String token){
        return extrairClaims(token).getId();
    }

    public Date extrairExpiracao(String token){
        return extrairClaims(token).getExpiration();
    }

    public boolean isTokenvalido (String token, String email){
        return extrairEmail(token).equals(email) && !isTokenExpirado(token);
    }

    public boolean isTokenExpirado (String token){
        return extrairExpiracao(token).before(new Date());
    }

    public Claims extrairClaims(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public SecretKey getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
