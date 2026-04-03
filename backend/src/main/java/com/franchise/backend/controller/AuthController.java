package com.franchise.backend.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.franchise.backend.dto.AuthResponseDTO;
import com.franchise.backend.dto.LoginRequestDTO;
import com.franchise.backend.dto.LoginResponseDTO;
import com.franchise.backend.dto.RegisterRequestDTO;
import com.franchise.backend.security.CustomUserDetails;
import com.franchise.backend.security.CustomUserDetailsService;
import com.franchise.backend.security.JwtService;
import com.franchise.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService
    ){
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public AuthResponseDTO register(
            @RequestBody RegisterRequestDTO request
    ){
        return authService.register(request);
    }

    @PostMapping("/login")
public LoginResponseDTO login(
        @RequestBody LoginRequestDTO request
){

    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    CustomUserDetails userDetails =
            (CustomUserDetails) userDetailsService.loadUserByUsername(request.getEmail());

    String token = jwtService.generateToken(userDetails);

    return new LoginResponseDTO(
            token,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority(),
            userDetails.getName(),
         userDetails.getBranchId()
         
    );
}

    @GetMapping("/me")
    public String currentUser(Authentication authentication){

        return authentication.getName();
    }
}