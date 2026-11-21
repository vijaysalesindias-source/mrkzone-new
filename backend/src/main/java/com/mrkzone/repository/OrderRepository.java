package com.mrkzone.repository;

import com.mrkzone.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByOrderStatus(Order.OrderStatus status);
    long countByPaymentStatus(Order.PaymentStatus status);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0.0) FROM Order o WHERE o.paymentStatus = 'COMPLETED'")
    Double calculateTotalRevenue();
}
