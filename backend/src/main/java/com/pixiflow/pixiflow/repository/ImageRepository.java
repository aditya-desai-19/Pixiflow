package com.pixiflow.pixiflow.repository;

import com.pixiflow.pixiflow.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, String> {

  @Query("SELECT i " + "FROM Image i JOIN i.user u " + "WHERE u.id = :userId and i.id = :imageId")
  Image getImageByImageId(@Param("userId") String userId, @Param("imageId") String imageId);
}
