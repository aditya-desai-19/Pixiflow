package com.pixiflow.pixiflow.serviceTests;

import com.pixiflow.pixiflow.dto.FileUploadResponse;
import com.pixiflow.pixiflow.entity.Image;
import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.exceptions.ImageNotFoundException;
import com.pixiflow.pixiflow.exceptions.UserNotFoundException;
import com.pixiflow.pixiflow.repository.ImageRepository;
import com.pixiflow.pixiflow.service.CustomUserDetailsService;
import com.pixiflow.pixiflow.service.ImageService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openapitools.model.ImageDetailsResponse;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import static org.mockito.Mockito.when;

//@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class ImageServiceTest {

    @InjectMocks
    private ImageService imageService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private ImageRepository imageRepository;

    @Test
    void shouldSaveImage() throws UserNotFoundException {
        FileUploadResponse fileUploadResponse = new FileUploadResponse("test.jpg", "https://pixiflow-test/test.jpg");
        User user = new User();
        user.setEmail("user@gmail.com");
        user.setId("1");

        when(customUserDetailsService.getCurrentUser()).thenReturn(user);

        ResponseEntity<?> response = imageService.saveImage(fileUploadResponse);

        Assertions.assertEquals(response.getStatusCode().value(), HttpStatus.CREATED.value());
    }

    @Test
    void shouldThrowErrorIfUserIsNotPresent() {
        FileUploadResponse fileUploadResponse = new FileUploadResponse("test.jpg", "https://pixiflow-test/test.jpg");

        when(customUserDetailsService.getCurrentUser()).thenReturn(null);

        UserNotFoundException exception = Assertions.assertThrows(UserNotFoundException.class, () -> imageService.saveImage(fileUploadResponse));

        Assertions.assertEquals("User can't be null", exception.getMessage());
    }

    @Test
    void shouldReturnImageDetails() throws UserNotFoundException, ImageNotFoundException {
        User user = new User();
        user.setEmail("user@gmail.com");
        user.setId("1");

        Image image = new Image();
        image.setId("i-1");
        image.setName("image1.jpg");
        image.setImgUrl("https://pixiflow-test/image1.jpg");
        image.setDeleted(false);
        image.setUser(user);

        when(customUserDetailsService.getCurrentUser()).thenReturn(user);
        when(imageRepository.getImageByImageId(user.getId(), image.getId())).thenReturn(image);

        ImageDetailsResponse imageDetailsResponse = imageService.getImageById("i-1");

        Assertions.assertEquals(imageDetailsResponse.getImageId(), image.getId());
    }

    @Test
    void shouldThrowErrorIfUserIsNotPresent_GetImageById() {
        when(customUserDetailsService.getCurrentUser()).thenReturn(null);

        UserNotFoundException exception = Assertions.assertThrows(UserNotFoundException.class, () -> imageService.getImageById("1"));

        Assertions.assertEquals("User can't be null", exception.getMessage());
    }

    @Test
    void shouldThrowImageNotFoundException_IfImageIsNull() {
        User user = new User();
        user.setEmail("user@gmail.com");
        user.setId("1");

        when(customUserDetailsService.getCurrentUser()).thenReturn(user);
        when(imageRepository.getImageByImageId(user.getId(), "1")).thenReturn(null);

        ImageNotFoundException exception = Assertions.assertThrows(ImageNotFoundException.class, () -> imageService.getImageById("1"));

        Assertions.assertEquals(exception.getMessage(), "Image not found");
    }
}
