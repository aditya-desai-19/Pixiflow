package com.pixiflow.pixiflow.repository;

import com.pixiflow.pixiflow.entity.Image;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, String> {

  @Query("SELECT i " + "FROM Image i JOIN i.user u " + "WHERE u.id = :userId AND i.id = :imageId")
  Image getImageByImageId(@Param("userId") String userId, @Param("imageId") String imageId);

  @Query(
      value = "SELECT i FROM Image i JOIN i.user u WHERE u.id = :userId",
      countQuery =
          "SELECT COUNT(i) FROM Image i JOIN i.user u WHERE u.id = :userId") // Define the count
  // query
  Page<Image> getAllImagesByUserId(Pageable pageable, @Param("userId") String userId);

  @Query("SELECT i " + "FROM Image i JOIN i.user u " + "WHERE u.id = :userId AND i.id IN :ids")
  List<Image> getAllImagesByImageIdsAndUserId(
      @Param("ids") List<String> ids, @Param("userId") String userId);

  @Modifying
  @Transactional
  @Query("DELETE FROM Image i WHERE i.user.id = :userId AND i.id IN :ids")
  int deleteImagesByImageIdsAndUserId(
      @Param("ids") List<String> ids, @Param("userId") String userId);
}
