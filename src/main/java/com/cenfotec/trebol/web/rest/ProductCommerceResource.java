package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ProductCommerce;
import com.cenfotec.trebol.repository.ProductCommerceRepository;
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
 * REST controller for managing ProductCommerce.
 */
@RestController
@RequestMapping("/api")
public class ProductCommerceResource {

    private final Logger log = LoggerFactory.getLogger(ProductCommerceResource.class);

    private static final String ENTITY_NAME = "productCommerce";

    private final ProductCommerceRepository productCommerceRepository;

    public ProductCommerceResource(ProductCommerceRepository productCommerceRepository) {
        this.productCommerceRepository = productCommerceRepository;
    }

    /**
     * POST  /product-commerces : Create a new productCommerce.
     *
     * @param productCommerce the productCommerce to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productCommerce, or with status 400 (Bad Request) if the productCommerce has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-commerces")
    public ResponseEntity<ProductCommerce> createProductCommerce(@RequestBody ProductCommerce productCommerce) throws URISyntaxException {
        log.debug("REST request to save ProductCommerce : {}", productCommerce);
        if (productCommerce.getId() != null) {
            throw new BadRequestAlertException("A new productCommerce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductCommerce result = productCommerceRepository.save(productCommerce);
        return ResponseEntity.created(new URI("/api/product-commerces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-commerces : Updates an existing productCommerce.
     *
     * @param productCommerce the productCommerce to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productCommerce,
     * or with status 400 (Bad Request) if the productCommerce is not valid,
     * or with status 500 (Internal Server Error) if the productCommerce couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-commerces")
    public ResponseEntity<ProductCommerce> updateProductCommerce(@RequestBody ProductCommerce productCommerce) throws URISyntaxException {
        log.debug("REST request to update ProductCommerce : {}", productCommerce);
        if (productCommerce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductCommerce result = productCommerceRepository.save(productCommerce);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productCommerce.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-commerces : get all the productCommerces.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of productCommerces in body
     */
    @GetMapping("/product-commerces")
    public List<ProductCommerce> getAllProductCommerces(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProductCommerces");
        return productCommerceRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /product-commerces/:id : get the "id" productCommerce.
     *
     * @param id the id of the productCommerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productCommerce, or with status 404 (Not Found)
     */
    @GetMapping("/product-commerces-bycommerce/{id}")
    public List<ProductCommerce> getProductByCommerceId(@PathVariable Long id) {
        log.debug("REST request to get ProductCommerce : {}", id);
        return  productCommerceRepository.findByCommerceId(id);

    }

    /**
     * GET  /product-commerces/:id : get the "id" productCommerce.
     *
     * @param id the id of the productCommerce to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productCommerce, or with status 404 (Not Found)
     */
    @GetMapping("/product-commerces/{id}")
    public ResponseEntity<ProductCommerce> getProductCommerce(@PathVariable Long id) {
        log.debug("REST request to get ProductCommerce : {}", id);
        Optional<ProductCommerce> productCommerce = productCommerceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(productCommerce);
    }

    /**
     * DELETE  /product-commerces/:id : delete the "id" productCommerce.
     *
     * @param id the id of the productCommerce to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-commerces/{id}")
    public ResponseEntity<Void> deleteProductCommerce(@PathVariable Long id) {
        log.debug("REST request to delete ProductCommerce : {}", id);
        productCommerceRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
