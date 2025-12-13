package com.pixiflow.pixiflow;

import nu.pattern.OpenCV;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PixiflowApplication {

	public static void main(String[] args) {
        OpenCV.loadLocally();
        SpringApplication.run(PixiflowApplication.class, args);
	}

}
