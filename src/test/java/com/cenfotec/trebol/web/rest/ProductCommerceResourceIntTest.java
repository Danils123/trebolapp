package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ProductCommerce;
import com.cenfotec.trebol.repository.ProductCommerceRepository;
import com.cenfotec.trebol.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;


import static com.cenfotec.trebol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProductCommerceResource REST controller.
 *
 * @see ProductCommerceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ProductCommerceResourceIntTest {

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private ProductCommerceRepository productCommerceRepository;

    @Mock
    private ProductCommerceRepository productCommerceRepositoryMock;

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

    private MockMvc restProductCommerceMockMvc;

    private ProductCommerce productCommerce;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductCommerceResource productCommerceResource = new ProductCommerceResource(productCommerceRepository);
        this.restProductCommerceMockMvc = MockMvcBuilders.standaloneSetup(productCommerceResource)
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
    public static ProductCommerce createEntity(EntityManager em) {
        ProductCommerce productCommerce = new ProductCommerce()
            .price(DEFAULT_PRICE)
            .quantity(DEFAULT_QUANTITY);
        return productCommerce;
    }

    @Before
    public void initTest() {
        productCommerce = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductCommerce() throws Exception {
        int databaseSizeBeforeCreate = productCommerceRepository.findAll().size();

        // Create the ProductCommerce
        restProductCommerceMockMvc.perform(post("/api/product-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productCommerce)))
            .andExpect(status().isCreated());

        // Validate the ProductCommerce in the database
        List<ProductCommerce> productCommerceList = productCommerceRepository.findAll();
        assertThat(productCommerceList).hasSize(databaseSizeBeforeCreate + 1);
        ProductCommerce testProductCommerce = productCommerceList.get(productCommerceList.size() - 1);
        assertThat(testProductCommerce.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testProductCommerce.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    public void createProductCommerceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productCommerceRepository.findAll().size();

        // Create the ProductCommerce with an existing ID
        productCommerce.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductCommerceMockMvc.perform(post("/api/product-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ProductCommerce in the database
        List<ProductCommerce> productCommerceList = productCommerceRepository.findAll();
        assertThat(productCommerceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductCommerces() throws Exception {
        // Initialize the database
        productCommerceRepository.saveAndFlush(productCommerce);

        // Get all the productCommerceList
        restProductCommerceMockMvc.perform(get("/api/product-commerces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productCommerce.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllProductCommercesWithEagerRelationshipsIsEnabled() throws Exception {
        ProductCommerceResource productCommerceResource = new ProductCommerceResource(productCommerceRepositoryMock);
        when(productCommerceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restProductCommerceMockMvc = MockMvcBuilders.standaloneSetup(productCommerceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProductCommerceMockMvc.perform(get("/api/product-commerces?eagerload=true"))
        .andExpect(status().isOk());

        verify(productCommerceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllProductCommercesWithEagerRelationshipsIsNotEnabled() throws Exception {
        ProductCommerceResource productCommerceResource = new ProductCommerceResource(productCommerceRepositoryMock);
            when(productCommerceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restProductCommerceMockMvc = MockMvcBuilders.standaloneSetup(productCommerceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProductCommerceMockMvc.perform(get("/api/product-commerces?eagerload=true"))
        .andExpect(status().isOk());

            verify(productCommerceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getProductCommerce() throws Exception {
        // Initialize the database
        productCommerceRepository.saveAndFlush(productCommerce);

        // Get the productCommerce
        restProductCommerceMockMvc.perform(get("/api/product-commerces/{id}", productCommerce.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productCommerce.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingProductCommerce() throws Exception {
        // Get the productCommerce
        restProductCommerceMockMvc.perform(get("/api/product-commerces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductCommerce() throws Exception {
        // Initialize the database
        productCommerceRepository.saveAndFlush(productCommerce);

        int databaseSizeBeforeUpdate = productCommerceRepository.findAll().size();

        // Update the productCommerce
        ProductCommerce updatedProductCommerce = productCommerceRepository.findById(productCommerce.getId()).get();
        // Disconnect from session so that the updates on updatedProductCommerce are not directly saved in db
        em.detach(updatedProductCommerce);
        updatedProductCommerce
            .price(UPDATED_PRICE)
            .quantity(UPDATED_QUANTITY);

        restProductCommerceMockMvc.perform(put("/api/product-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductCommerce)))
            .andExpect(status().isOk());

        // Validate the ProductCommerce in the database
        List<ProductCommerce> productCommerceList = productCommerceRepository.findAll();
        assertThat(productCommerceList).hasSize(databaseSizeBeforeUpdate);
        ProductCommerce testProductCommerce = productCommerceList.get(productCommerceList.size() - 1);
        assertThat(testProductCommerce.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testProductCommerce.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingProductCommerce() throws Exception {
        int databaseSizeBeforeUpdate = productCommerceRepository.findAll().size();

        // Create the ProductCommerce

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCommerceMockMvc.perform(put("/api/product-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ProductCommerce in the database
        List<ProductCommerce> productCommerceList = productCommerceRepository.findAll();
        assertThat(productCommerceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductCommerce() throws Exception {
        // Initialize the database
        productCommerceRepository.saveAndFlush(productCommerce);

        int databaseSizeBeforeDelete = productCommerceRepository.findAll().size();

        // Delete the productCommerce
        restProductCommerceMockMvc.perform(delete("/api/product-commerces/{id}", productCommerce.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductCommerce> productCommerceList = productCommerceRepository.findAll();
        assertThat(productCommerceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductCommerce.class);
        ProductCommerce productCommerce1 = new ProductCommerce();
        productCommerce1.setId(1L);
        ProductCommerce productCommerce2 = new ProductCommerce();
        productCommerce2.setId(productCommerce1.getId());
        assertThat(productCommerce1).isEqualTo(productCommerce2);
        productCommerce2.setId(2L);
        assertThat(productCommerce1).isNotEqualTo(productCommerce2);
        productCommerce1.setId(null);
        assertThat(productCommerce1).isNotEqualTo(productCommerce2);
    }
}
