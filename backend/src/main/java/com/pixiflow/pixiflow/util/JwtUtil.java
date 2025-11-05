package com.pixiflow.pixiflow.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expMs;

    private Key key(){
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails ud){
        Date now = new Date();
        Date exp = new Date(now.getTime() + expMs);
        return Jwts.builder()
                .setSubject(ud.getUsername())
                .setIssuedAt(now)
                .setExpiration(exp)
                .claim("roles", ud.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token){
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, UserDetails ud){
        try {
            Claims c = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
            return c.getSubject().equals(ud.getUsername()) && c.getExpiration().after(new Date());
        } catch (JwtException e){
            return false;
        }
    }
}
