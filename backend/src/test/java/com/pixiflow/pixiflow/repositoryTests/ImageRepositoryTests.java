package com.pixiflow.pixiflow.repositoryTests;

import com.pixiflow.pixiflow.entity.Image;
import com.pixiflow.pixiflow.entity.User;
import com.pixiflow.pixiflow.repository.ImageRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.event.annotation.BeforeTestMethod;

@DataJpaTest
public class ImageRepositoryTests {

  @Autowired private ImageRepository imageRepository;

  @Autowired private TestEntityManager entityManager;

  private static final int TOTAL_IMAGES = 10;
  private static final int PAGE_SIZE = 3;
  private static final String REQUIRED_TAG = "NEEDS_DATA";

  @BeforeTestMethod("testFirstPage")
  void conditionalSetup(TestInfo testInfo) {
    if (testInfo.getTags().contains(REQUIRED_TAG)) {
      User user = new User();
      user.setId("1");
      user.setName("Test");
      user.setEmail("test@gmail.com");
      user.setPassword("test*123");

      for (int i = 1; i <= TOTAL_IMAGES; i++) {
        Image image = new Image();
        image.setId("image-" + i + ".jpg");
        image.setName(i + ".jpg");
        image.setImgUrl("https://test.com/" + i + ".jpg");
        image.setUser(user);
        image.setDeleted(false);
        image.setCreatedAt(Instant.now());
        entityManager.persistAndFlush(image);
      }
    } else {
      System.out.println("Skipping test data setup");
    }
  }

  @Test
  void testSaveImage() {
    User user = new User();
    user.setId("1");
    user.setName("Test");
    user.setEmail("test@gmail.com");
    user.setPassword("test*123");

    Image newImage = new Image();
    newImage.setId(UUID.randomUUID().toString());
    newImage.setName("123.jpg");
    newImage.setImgUrl("https://test.com/123.jpg");
    newImage.setUser(user);
    newImage.setDeleted(false);
    newImage.setCreatedAt(Instant.now());

    Image savedImage = imageRepository.save(newImage);

    Assertions.assertEquals(savedImage.getId(), newImage.getId());
    Assertions.assertEquals(savedImage.getImgUrl(), newImage.getImgUrl());
  }

  @Test
  void testFindById() {
    User user = new User();
    user.setId("1");
    user.setName("Test");
    user.setEmail("test@gmail.com");
    user.setPassword("test*123");

    Image newImage = new Image();
    newImage.setId(UUID.randomUUID().toString());
    newImage.setName("123.jpg");
    newImage.setImgUrl("https://test.com/123.jpg");
    newImage.setUser(user);
    newImage.setDeleted(false);
    newImage.setCreatedAt(Instant.now());

    imageRepository.save(newImage);

    Optional<Image> image = imageRepository.findById(newImage.getId());

    Assertions.assertTrue(image.isPresent());
  }

  @Test
  void testImageNotFound() {
    User user = new User();
    user.setId("1");
    user.setName("Test");
    user.setEmail("test@gmail.com");
    user.setPassword("test*123");

    Image newImage = new Image();
    newImage.setId(UUID.randomUUID().toString());
    newImage.setName("123.jpg");
    newImage.setImgUrl("https://test.com/123.jpg");
    newImage.setUser(user);
    newImage.setDeleted(false);
    newImage.setCreatedAt(Instant.now());

    imageRepository.save(newImage);

    Optional<Image> image = imageRepository.findById("125");

    Assertions.assertTrue(image.isEmpty());
  }

  @Test
  @Tag(REQUIRED_TAG)
  void testFirstPage() {
    Pageable pageable = PageRequest.of(0, PAGE_SIZE);

    Page<Image> imagePage = imageRepository.findAll(pageable);

    Assertions.assertEquals(PAGE_SIZE, imagePage.getSize());
    Assertions.assertEquals(0, imagePage.getNumber());
    Assertions.assertTrue(imagePage.isFirst());
    //        Assertions.assertEquals("image-1.jpg", imagePage.getContent().get(0).getId());
  }

  @Test
  @Tag(REQUIRED_TAG)
  void testLastPage() {
    Pageable pageable = PageRequest.of(3, PAGE_SIZE);

    Page<Image> imagePage = imageRepository.findAll(pageable);

    Assertions.assertEquals(PAGE_SIZE, imagePage.getSize());
    Assertions.assertEquals(3, imagePage.getNumber());
    Assertions.assertTrue(imagePage.isLast());
  }

  @Test
  @Tag(REQUIRED_TAG)
  void testNotFoundPage() {
    Pageable pageable = PageRequest.of(5, PAGE_SIZE);

    Page<Image> imagePage = imageRepository.findAll(pageable);

    Assertions.assertTrue(imagePage.getContent().isEmpty());
  }
}
