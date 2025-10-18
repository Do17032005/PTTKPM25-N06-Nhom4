package com.bookstore.onlinebookstore.controller;


import com.bookstore.onlinebookstore.model.BorrowRecord;
import com.bookstore.onlinebookstore.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/borrows")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BorrowController {
    private final BorrowService borrowService;
    
    @PostMapping
    public ResponseEntity<BorrowRecord> borrowBook(
            @RequestParam Long userId, 
            @RequestParam Long bookId) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(borrowService.borrowBook(userId, bookId));
    }
    
    @PutMapping("/{id}/return")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }
    
    @GetMapping
    public ResponseEntity<List<BorrowRecord>> getAllBorrowRecords() {
        return ResponseEntity.ok(borrowService.getAllBorrowRecords());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowRecord>> getUserBorrowHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getUserBorrowHistory(userId));
    }
    
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<BorrowRecord>> getActiveBorrows(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getActiveBorrows(userId));
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecord>> getOverdueRecords() {
        return ResponseEntity.ok(borrowService.getOverdueRecords());
    }
}
