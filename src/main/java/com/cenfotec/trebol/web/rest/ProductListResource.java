package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ProductList;
import com.cenfotec.trebol.repository.ProductListRepository;
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
 * REST controller for managing ProductList.
 */
@RestController
@RequestMapping("/api")
public class ProductListResource {

    private final Logger log = LoggerFactory.getLogger(ProductListResource.class);

    private static final String ENTITY_NAME = "productList";

    private final ProductListRepository productListRepository;

    public ProductListResource(ProductListRepository productListRepository) {
        this.productListRepository = productListRepository;
    }

    /**
     * POST  /product-lists : Create a new productList.
     *
     * @param productList the productList to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productList, or with status 400 (Bad Request) if the productList has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-lists")
    public ResponseEntity<ProductList> createProductList(@RequestBody ProductList productList) throws URISyntaxException {
        log.debug("REST request to save ProductList : {}", productList);
        if (productList.getId() != null) {
            throw new BadRequestAlertException("A new productList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductList result = productListRepository.save(productList);
        return ResponseEntity.created(new URI("/api/product-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-lists : Updates an existing productList.
     *
     * @param productList the productList to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productList,
     * or with status 400 (Bad Request) if the productList is not valid,
     * or with status 500 (Internal Server Error) if the productList couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-lists")
    public ResponseEntity<ProductList> updateProductList(@RequestBody ProductList productList) throws URISyntaxException {
        log.debug("REST request to update ProductList : {}", productList);
        if (productList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductList result = productListRepository.save(productList);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productList.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-lists : get all the productLists.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productLists in body
     */
    @GetMapping("/product-lists")
    public List<ProductList> getAllProductLists() {
        log.debug("REST request to get all ProductLists");
        return productListRepository.findAll();
    }

    /**
     * GET  /product-lists/:id : get the "id" productList.
     *
     * @param id the id of the productList to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productList, or with status 404 (Not Found)
     */
    @GetMapping("/product-lists/{id}")
    public ResponseEntity<ProductList> getProductList(@PathVariable Long id) {
        log.debug("REST request to get ProductList : {}", id);
        Optional<ProductList> productList = productListRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productList);
    }

    /**
     * DELETE  /product-lists/:id : delete the "id" productList.
     *
     * @param id the id of the productList to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-lists/{id}")
    public ResponseEntity<Void> deleteProductList(@PathVariable Long id) {
        log.debug("REST request to delete ProductList : {}", id);
        productListRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
