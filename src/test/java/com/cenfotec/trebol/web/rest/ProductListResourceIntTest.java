package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ProductList;
import com.cenfotec.trebol.repository.ProductListRepository;
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
 * Test class for the ProductListResource REST controller.
 *
 * @see ProductListResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ProductListResourceIntTest {

    private static final Boolean DEFAULT_STATE = false;
    private static final Boolean UPDATED_STATE = true;

    @Autowired
    private ProductListRepository productListRepository;

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

    private MockMvc restProductListMockMvc;

    private ProductList productList;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductListResource productListResource = new ProductListResource(productListRepository);
        this.restProductListMockMvc = MockMvcBuilders.standaloneSetup(productListResource)
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
    public static ProductList createEntity(EntityManager em) {
        ProductList productList = new ProductList()
            .state(DEFAULT_STATE);
        return productList;
    }

    @Before
    public void initTest() {
        productList = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductList() throws Exception {
        int databaseSizeBeforeCreate = productListRepository.findAll().size();

        // Create the ProductList
        restProductListMockMvc.perform(post("/api/product-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productList)))
            .andExpect(status().isCreated());

        // Validate the ProductList in the database
        List<ProductList> productListList = productListRepository.findAll();
        assertThat(productListList).hasSize(databaseSizeBeforeCreate + 1);
        ProductList testProductList = productListList.get(productListList.size() - 1);
        assertThat(testProductList.isState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    public void createProductListWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productListRepository.findAll().size();

        // Create the ProductList with an existing ID
        productList.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductListMockMvc.perform(post("/api/product-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productList)))
            .andExpect(status().isBadRequest());

        // Validate the ProductList in the database
        List<ProductList> productListList = productListRepository.findAll();
        assertThat(productListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductLists() throws Exception {
        // Initialize the database
        productListRepository.saveAndFlush(productList);

        // Get all the productListList
        restProductListMockMvc.perform(get("/api/product-lists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productList.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getProductList() throws Exception {
        // Initialize the database
        productListRepository.saveAndFlush(productList);

        // Get the productList
        restProductListMockMvc.perform(get("/api/product-lists/{id}", productList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productList.getId().intValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingProductList() throws Exception {
        // Get the productList
        restProductListMockMvc.perform(get("/api/product-lists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductList() throws Exception {
        // Initialize the database
        productListRepository.saveAndFlush(productList);

        int databaseSizeBeforeUpdate = productListRepository.findAll().size();

        // Update the productList
        ProductList updatedProductList = productListRepository.findById(productList.getId()).get();
        // Disconnect from session so that the updates on updatedProductList are not directly saved in db
        em.detach(updatedProductList);
        updatedProductList
            .state(UPDATED_STATE);

        restProductListMockMvc.perform(put("/api/product-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductList)))
            .andExpect(status().isOk());

        // Validate the ProductList in the database
        List<ProductList> productListList = productListRepository.findAll();
        assertThat(productListList).hasSize(databaseSizeBeforeUpdate);
        ProductList testProductList = productListList.get(productListList.size() - 1);
        assertThat(testProductList.isState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    public void updateNonExistingProductList() throws Exception {
        int databaseSizeBeforeUpdate = productListRepository.findAll().size();

        // Create the ProductList

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductListMockMvc.perform(put("/api/product-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productList)))
            .andExpect(status().isBadRequest());

        // Validate the ProductList in the database
        List<ProductList> productListList = productListRepository.findAll();
        assertThat(productListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductList() throws Exception {
        // Initialize the database
        productListRepository.saveAndFlush(productList);

        int databaseSizeBeforeDelete = productListRepository.findAll().size();

        // Delete the productList
        restProductListMockMvc.perform(delete("/api/product-lists/{id}", productList.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductList> productListList = productListRepository.findAll();
        assertThat(productListList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductList.class);
        ProductList productList1 = new ProductList();
        productList1.setId(1L);
        ProductList productList2 = new ProductList();
        productList2.setId(productList1.getId());
        assertThat(productList1).isEqualTo(productList2);
        productList2.setId(2L);
        assertThat(productList1).isNotEqualTo(productList2);
        productList1.setId(null);
        assertThat(productList1).isNotEqualTo(productList2);
    }
}
