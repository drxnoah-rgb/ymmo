package com.ymmo.ymmo_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ymmo.ymmo_api", "com.ymmo.ymmo_api"})
@EnableJpaRepositories(basePackages = "com.ymmo.ymmo_api.repository")
@EntityScan(basePackages = "com.ymmo.ymmo_api.entity")
public class YmmoApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(YmmoApiApplication.class, args);
    }
}
