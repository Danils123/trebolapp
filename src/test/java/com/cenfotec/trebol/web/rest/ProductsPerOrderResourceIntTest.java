package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ProductsPerOrder;
import com.cenfotec.trebol.repository.ProductsPerOrderRepository;
import com.cenfotec.trebol.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.cenfotec.trebol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProductsPerOrderResource REST controller.
 *
 * @see ProductsPerOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ProductsPerOrderResourceIntTest {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private ProductsPerOrderRepository productsPerOrderRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restProductsPerOrderMockMvc;

    private ProductsPerOrder productsPerOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductsPerOrderResource productsPerOrderResource = new ProductsPerOrderResource(productsPerOrderRepository);
        this.restProductsPerOrderMockMvc = MockMvcBuilders.standaloneSetup(productsPerOrderResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductsPerOrder createEntity(EntityManager em) {
        ProductsPerOrder productsPerOrder = new ProductsPerOrder()
            .quantity(DEFAULT_QUANTITY);
        return productsPerOrder;
    }

    @Before
    public void initTest() {
        productsPerOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductsPerOrder() throws Exception {
        int databaseSizeBeforeCreate = productsPerOrderRepository.findAll().size();

        // Create the ProductsPerOrder
        restProductsPerOrderMockMvc.perform(post("/api/products-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productsPerOrder)))
            .andExpect(status().isCreated());

        // Validate the ProductsPerOrder in the database
        List<ProductsPerOrder> productsPerOrderList = productsPerOrderRepository.findAll();
        assertThat(productsPerOrderList).hasSize(databaseSizeBeforeCreate + 1);
        ProductsPerOrder testProductsPerOrder = productsPerOrderList.get(productsPerOrderList.size() - 1);
        assertThat(testProductsPerOrder.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    public void createProductsPerOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productsPerOrderRepository.findAll().size();

        // Create the ProductsPerOrder with an existing ID
        productsPerOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductsPerOrderMockMvc.perform(post("/api/products-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productsPerOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ProductsPerOrder in the database
        List<ProductsPerOrder> productsPerOrderList = productsPerOrderRepository.findAll();
        assertThat(productsPerOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductsPerOrders() throws Exception {
        // Initialize the database
        productsPerOrderRepository.saveAndFlush(productsPerOrder);

        // Get all the productsPerOrderList
        restProductsPerOrderMockMvc.perform(get("/api/products-per-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productsPerOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @Test
    @Transactional
    public void getProductsPerOrder() throws Exception {
        // Initialize the database
        productsPerOrderRepository.saveAndFlush(productsPerOrder);

        // Get the productsPerOrder
        restProductsPerOrderMockMvc.perform(get("/api/products-per-orders/{id}", productsPerOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productsPerOrder.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingProductsPerOrder() throws Exception {
        // Get the productsPerOrder
        restProductsPerOrderMockMvc.perform(get("/api/products-per-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductsPerOrder() throws Exception {
        // Initialize the database
        productsPerOrderRepository.saveAndFlush(productsPerOrder);

        int databaseSizeBeforeUpdate = productsPerOrderRepository.findAll().size();

        // Update the productsPerOrder
        ProductsPerOrder updatedProductsPerOrder = productsPerOrderRepository.findById(productsPerOrder.getId()).get();
        // Disconnect from session so that the updates on updatedProductsPerOrder are not directly saved in db
        em.detach(updatedProductsPerOrder);
        updatedProductsPerOrder
            .quantity(UPDATED_QUANTITY);

        restProductsPerOrderMockMvc.perform(put("/api/products-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductsPerOrder)))
            .andExpect(status().isOk());

        // Validate the ProductsPerOrder in the database
        List<ProductsPerOrder> productsPerOrderList = productsPerOrderRepository.findAll();
        assertThat(productsPerOrderList).hasSize(databaseSizeBeforeUpdate);
        ProductsPerOrder testProductsPerOrder = productsPerOrderList.get(productsPerOrderList.size() - 1);
        assertThat(testProductsPerOrder.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingProductsPerOrder() throws Exception {
        int databaseSizeBeforeUpdate = productsPerOrderRepository.findAll().size();

        // Create the ProductsPerOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductsPerOrderMockMvc.perform(put("/api/products-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productsPerOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ProductsPerOrder in the database
        List<ProductsPerOrder> productsPerOrderList = productsPerOrderRepository.findAll();
        assertThat(productsPerOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductsPerOrder() throws Exception {
        // Initialize the database
        productsPerOrderRepository.saveAndFlush(productsPerOrder);

        int databaseSizeBeforeDelete = productsPerOrderRepository.findAll().size();

        // Delete the productsPerOrder
        restProductsPerOrderMockMvc.perform(delete("/api/products-per-orders/{id}", productsPerOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductsPerOrder> productsPerOrderList = productsPerOrderRepository.findAll();
        assertThat(productsPerOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductsPerOrder.class);
        ProductsPerOrder productsPerOrder1 = new ProductsPerOrder();
        productsPerOrder1.setId(1L);
        ProductsPerOrder productsPerOrder2 = new ProductsPerOrder();
        productsPerOrder2.setId(productsPerOrder1.getId());
        assertThat(productsPerOrder1).isEqualTo(productsPerOrder2);
        productsPerOrder2.setId(2L);
        assertThat(productsPerOrder1).isNotEqualTo(productsPerOrder2);
        productsPerOrder1.setId(null);
        assertThat(productsPerOrder1).isNotEqualTo(productsPerOrder2);
    }
}
