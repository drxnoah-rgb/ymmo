package com.ymmo.ymmoapi.repository;

import com.ymmo.ymmoapi.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByBienId(Long bienId);
}