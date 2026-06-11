package com.ymmo.ymmo_api.repository;

import com.ymmo.ymmo_api.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAcheteurId(Long acheteurId);
    List<Transaction> findByAgentId(Long agentId);
    List<Transaction> findByBienId(Long bienId);
    List<Transaction> findByStatut(Transaction.StatutTransaction statut);
}
