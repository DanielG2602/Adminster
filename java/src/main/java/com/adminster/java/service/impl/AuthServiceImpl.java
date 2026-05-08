package com.adminster.java.service.impl;

import com.adminster.java.domain.User;
import com.adminster.java.dto.request.LoginRequest;
import com.adminster.java.dto.response.AuthResponse;
import com.adminster.java.exception.BusinessException;
import com.adminster.java.repository.UserRepository;
import com.adminster.java.service.AuthService;
import com.adminster.java.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    @Override
    public AuthResponse login (LoginRequest request){
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        }catch (AuthenticationException e){
            throw  new BusinessException("Email ou senha invalidos");
        }

        var user = userRepository.findByEmail(request.email()).orElseThrow(()-> new BusinessException("Usuario nao encontrado"));

        String accessToken = jwtService.gerarToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.gerarRefreshToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(accessToken, refreshToken, expiration);
    }

    @Override
    public AuthResponse refresh(String refreshToken){
        String jti = jwtService.extrairJti(refreshToken);
        Boolean blackList = redisTemplate.hasKey("blacklist:jwt:" + jti);
        if(Boolean.TRUE.equals(blackList)){
            throw new BusinessException("Refresh Token Invalido");
        }

        if(jwtService.isTokenExpirado(refreshToken)){
            throw new BusinessException("Refresh Token Invalido");
        }

        String email = jwtService.extrairEmail(refreshToken);
        var user = userRepository.findByEmail(email).orElseThrow(()-> new BusinessException("Email nao encontrado"));

        redisTemplate.opsForValue().set(
                "blacklist:jwt:" + jti,
                "refresh",
                refreshExpiration,
                TimeUnit.MILLISECONDS
                );

        String newAcessToken = jwtService.gerarToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtService.gerarRefreshToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(newAcessToken, newRefreshToken, expiration);
    }

    @Override
    public void logout (String token){
        String jti = jwtService.extrairJti(token);
        long tempoRestante = jwtService.extrairExpiracao(token).getTime() - System.currentTimeMillis();

        if(tempoRestante > 0){
            redisTemplate.opsForValue().set(
                    "blacklist:jwt:" + jti,
                    "logout",
                    tempoRestante,
                    TimeUnit.MILLISECONDS
            );
        }
    }

}
