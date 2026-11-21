package com.mrkzone.repository;

import com.mrkzone.model.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ReturnRequest> findAllByOrderByCreatedAtDesc();
    List<ReturnRequest> findByOrderId(Long orderId);
}
