    package com.franchise.backend.service;

    import java.util.List;
    import java.util.Optional;

    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import com.franchise.backend.dto.*;
    import com.franchise.backend.entity.*;
    import com.franchise.backend.repository.*;

    @Service
    @Transactional
    public class OrderService {

        private final OrderRepository orderRepository;
        private final OrderItemRepository orderItemRepository;
        private final ProductRepository productRepository;
        private final BranchRepository branchRepository;
        private final UserRepository userRepository;
        private final PaymentRepository paymentRepository;
        private final InventoryRepository inventoryRepository;
        private final AlertRepository alertRepository;

        public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                ProductRepository productRepository, BranchRepository branchRepository,
                UserRepository userRepository, PaymentRepository paymentRepository,
                InventoryRepository inventoryRepository,
                AlertRepository alertRepository) {
            this.orderRepository = orderRepository;
            this.orderItemRepository = orderItemRepository;
            this.productRepository = productRepository;
            this.branchRepository = branchRepository;
            this.userRepository = userRepository;
            this.paymentRepository = paymentRepository;
            this.inventoryRepository = inventoryRepository;
            this.alertRepository = alertRepository;
        }

        private String generateOrderNumber() {
            long count = orderRepository.getTotalOrders();
            return String.format("ORD-%04d", count + 1000);
        }

        private OrderResponseDTO toDTO(Order o) {
            return new OrderResponseDTO(o.getId(), o.getOrderNumber(),
                    o.getTotalAmount(), o.getPaymentMethod(), o.getCreatedAt());
        }

        public OrderResponseDTO createOrder(OrderRequestDTO request) {

            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));

            User staff = userRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            Order order = new Order();
            order.setBranch(branch);
            order.setStaff(staff);
            order.setPaymentStatus("PAID");
            order.setPaymentMethod(request.getPaymentMethod());
            order.setOrderNumber(generateOrderNumber());

            orderRepository.save(order);

            double total = 0;

            for (OrderItemRequestDTO item : request.getItems()) {

                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                double subtotal = product.getPrice() * item.getQuantity();

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(item.getQuantity());
                orderItem.setUnitPrice(product.getPrice());
                orderItem.setSubtotal(subtotal);

                orderItemRepository.save(orderItem);

                total += subtotal;

                // INVENTORY DEDUCTION
                Inventory inventory = inventoryRepository
                        .findByBranchIdAndProductId(branch.getId(), product.getId())
                        .orElseThrow(() -> new RuntimeException("Inventory not found for product"));

                if (inventory.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Not enough stock for " + product.getName());
                }

                inventory.setStockQuantity(
                        inventory.getStockQuantity() - item.getQuantity()
                );

                inventoryRepository.save(inventory);

                Optional<Alert> existingAlert = alertRepository
                        .findByBranchIdAndProductIdAndAlertTypeAndStatus(
                                branch.getId(),
                                product.getId(),
                                "Inventory",
                                "UNRESOLVED"
                        );

                if(inventory.getStockQuantity() <= inventory.getLowStockThreshold()){

                    if(existingAlert.isPresent()){

                        Alert alert = existingAlert.get();

                        alert.setMessage(
                            product.getName() + " stock is low (" +
                            inventory.getStockQuantity() + " remaining)"
                        );

                        alertRepository.save(alert);

                    } else {

                        Alert alert = new Alert();
                        alert.setBranch(branch);
                        alert.setProduct(product);
                        alert.setAlertType("Inventory");
                        alert.setTitle("Low Stock Warning: " +product.getName());
                        alert.setMessage(
                        " stock is low (" +
                            inventory.getStockQuantity() + " remaining)"
                        );
                        alert.setSeverity("HIGH");
                        alert.setStatus("UNRESOLVED");

                        alertRepository.save(alert);
                    }

                }else{

                    alertRepository.deleteByBranchIdAndProductIdAndAlertTypeAndStatus(
                            branch.getId(),
                            product.getId(),
                            "Inventory",
                            "UNRESOLVED"
                    );
                }
            }

            order.setTotalAmount(total);
            orderRepository.save(order);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(total);
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setPaymentStatus("SUCCESS");

            paymentRepository.save(payment);

            return toDTO(order);
        }

        public List<OrderResponseDTO> getRecentOrdersByBranch(Long branchId) {
            return orderRepository.findTop10ByBranchIdOrderByCreatedAtDesc(branchId)
                    .stream().map(this::toDTO).toList();
        }
    }
