package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ProductsPerOrder;
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

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ProductsPerOrder.
 */
@RestController
@RequestMapping("/api")
public class ProductsPerOrderResource {

    private final Logger log = LoggerFactory.getLogger(ProductsPerOrderResource.class);

    private static final String ENTITY_NAME = "productsPerOrder";

    private final ProductsPerOrderRepository productsPerOrderRepository;

    public ProductsPerOrderResource(ProductsPerOrderRepository productsPerOrderRepository) {
        this.productsPerOrderRepository = productsPerOrderRepository;
    }

    /**
     * POST  /products-per-orders : Create a new productsPerOrder.
     *
     * @param productsPerOrder the productsPerOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productsPerOrder, or with status 400 (Bad Request) if the productsPerOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/products-per-orders")
    public ResponseEntity<ProductsPerOrder> createProductsPerOrder(@RequestBody ProductsPerOrder productsPerOrder) throws URISyntaxException {
        log.debug("REST request to save ProductsPerOrder : {}", productsPerOrder);
        if (productsPerOrder.getId() != null) {
            throw new BadRequestAlertException("A new productsPerOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductsPerOrder result = productsPerOrderRepository.save(productsPerOrder);
        return ResponseEntity.created(new URI("/api/products-per-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /products-per-orders : Updates an existing productsPerOrder.
     *
     * @param productsPerOrder the productsPerOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productsPerOrder,
     * or with status 400 (Bad Request) if the productsPerOrder is not valid,
     * or with status 500 (Internal Server Error) if the productsPerOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/products-per-orders")
    public ResponseEntity<ProductsPerOrder> updateProductsPerOrder(@RequestBody ProductsPerOrder productsPerOrder) throws URISyntaxException {
        log.debug("REST request to update ProductsPerOrder : {}", productsPerOrder);
        if (productsPerOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductsPerOrder result = productsPerOrderRepository.save(productsPerOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productsPerOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /products-per-orders : get all the productsPerOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productsPerOrders in body
     */
    @GetMapping("/products-per-orders")
    public List<ProductsPerOrder> getAllProductsPerOrders() {
        log.debug("REST request to get all ProductsPerOrders");
        return productsPerOrderRepository.findAll();
    }

    /**
     * GET  /products-per-orders/:id : get the "id" productsPerOrder.
     *
     * @param id the id of the productsPerOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productsPerOrder, or with status 404 (Not Found)
     */
    @GetMapping("/products-per-orders/{id}")
    public ResponseEntity<ProductsPerOrder> getProductsPerOrder(@PathVariable Long id) {
        log.debug("REST request to get ProductsPerOrder : {}", id);
        Optional<ProductsPerOrder> productsPerOrder = productsPerOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productsPerOrder);
    }

    /**
     * DELETE  /products-per-orders/:id : delete the "id" productsPerOrder.
     *
     * @param id the id of the productsPerOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/products-per-orders/{id}")
    public ResponseEntity<Void> deleteProductsPerOrder(@PathVariable Long id) {
        log.debug("REST request to delete ProductsPerOrder : {}", id);
        productsPerOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
