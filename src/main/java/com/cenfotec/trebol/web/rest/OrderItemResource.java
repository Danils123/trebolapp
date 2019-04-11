package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.domain.OrderItem;
import com.cenfotec.trebol.domain.ProductsPerOrder;
import com.cenfotec.trebol.repository.OrderItemRepository;
import com.cenfotec.trebol.repository.ProductsPerOrderRepository;
import com.cenfotec.trebol.web.rest.errors.BadRequestAlertException;
import com.cenfotec.trebol.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing OrderItem.
 */
@RestController
@RequestMapping("/api")
public class OrderItemResource {

    private final Logger log = LoggerFactory.getLogger(OrderItemResource.class);

    private static final String ENTITY_NAME = "orderItem";

    private final OrderItemRepository orderItemRepository;
    private final ProductsPerOrderResource productsPerOrderResource;
    private final ProductsPerOrderRepository productsPerOrderRepository;

    public OrderItemResource(OrderItemRepository orderItemRepository, ProductsPerOrderResource productsPerOrderResource,
            ProductsPerOrderRepository productsPerOrderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.productsPerOrderResource = productsPerOrderResource;
        this.productsPerOrderRepository = productsPerOrderRepository;
    }

    /**
     * POST /order-items : Create a new orderItem.
     *
     * @param orderItem the orderItem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         orderItem, or with status 400 (Bad Request) if the orderItem has
     *         already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/order-items")
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) throws URISyntaxException {
        log.debug("REST request to save OrderItem : {}", orderItem);
        if (orderItem.getId() != null) {
            throw new BadRequestAlertException("A new orderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        orderItem.setDate(Instant.now());
        OrderItem result = orderItemRepository.save(orderItem);
        for (ProductsPerOrder product : orderItem.getProductsPerOrders()) {
            product.setOrderItem(result);
            productsPerOrderResource.createProductsPerOrder(product);
        }
        return ResponseEntity.created(new URI("/api/order-items/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * PUT /order-items : Updates an existing orderItem.
     *
     * @param orderItem the orderItem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         orderItem, or with status 400 (Bad Request) if the orderItem is not
     *         valid, or with status 500 (Internal Server Error) if the orderItem
     *         couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/order-items")
    public ResponseEntity<OrderItem> updateOrderItem(@RequestBody OrderItem orderItem) throws URISyntaxException {
        log.debug("REST request to update OrderItem : {}", orderItem);
        if (orderItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        OrderItem result = orderItemRepository.save(orderItem);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, orderItem.getId().toString())).body(result);
    }

    /**
     * GET /order-items : get all the orderItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of orderItems in
     *         body
     */
    @GetMapping("/order-items")
    public List<OrderItem> getAllOrderItems() {
        log.debug("REST request to get all OrderItems");
        return orderItemRepository.findAll();
    }

    /**
     * GET /order-items/:id : get the "id" orderItem.
     *
     * @param id the id of the orderItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the orderItem,
     *         or with status 404 (Not Found)
     */
    @GetMapping("/order-items/{id}")
    public OrderItem getOrderItem(@PathVariable Long id) {
        log.debug("REST request to get OrderItem : {}", id);
        Optional<OrderItem> orderItem = orderItemRepository.findById(id);
        OrderItem response = orderItem.get();
        response.setProductsPerOrders(productsPerOrderRepository.findByOrderItemId(response.getId()));
        return response;
    }

    /**
     * GET /order-items/:id : get the "id" orderItem.
     *
     * @param id the id of the orderItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the orderItem,
     *         or with status 404 (Not Found)
     */
    @GetMapping("/order-items-by-commerce/{commerceId}")
    public Set<OrderItem> getOrderItemByCommerce(@PathVariable Long commerceId) {
        log.debug("REST request to get OrderItem by commerceId : {}", commerceId);
        return orderItemRepository.findByCommerceIdOrderByDateAsc(commerceId);
    }

    /**
     * DELETE /order-items/:id : delete the "id" orderItem.
     *
     * @param id the id of the orderItem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/order-items/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete OrderItem : {}", id);
        orderItemRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
