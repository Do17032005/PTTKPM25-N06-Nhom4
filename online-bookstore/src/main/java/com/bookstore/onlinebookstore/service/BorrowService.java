package com.bookstore.onlinebookstore.service;


import com.bookstore.onlinebookstore.model.BorrowRecord;
import com.bookstore.onlinebookstore.model.BorrowStatus;
import com.bookstore.onlinebookstore.repository.BorrowRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {
    private final BorrowRecordRepository borrowRecordRepository;
    private final BookService bookService;
    private final UserService userService;
    
    private static final int BORROW_PERIOD_DAYS = 14;
    private static final double FINE_PER_DAY = 5000.0;
    
    @Transactional
    public BorrowRecord borrowBook(Long userId, Long bookId) {
        BorrowRecord record = new BorrowRecord();
        record.setUser(userService.getUserById(userId));
        record.setBook(bookService.getBookById(bookId));
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(BORROW_PERIOD_DAYS));
        record.setStatus(BorrowStatus.BORROWED);
        
        bookService.decreaseAvailableCopies(bookId);
        return borrowRecordRepository.save(record);
    }
    
    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Borrow record not found"));
        
        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);
        
        if (LocalDate.now().isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
            record.setFineAmount(daysOverdue * FINE_PER_DAY);
        }
        
        bookService.increaseAvailableCopies(record.getBook().getId());
        return borrowRecordRepository.save(record);
    }
    
    public List<BorrowRecord> getUserBorrowHistory(Long userId) {
        return borrowRecordRepository.findByUserId(userId);
    }
    
    public List<BorrowRecord> getActiveBorrows(Long userId) {
        return borrowRecordRepository.findActiveBorrowsByUser(userId);
    }
    
    public List<BorrowRecord> getOverdueRecords() {
        return borrowRecordRepository.findOverdueRecords(LocalDate.now());
    }
    
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }
}