package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.Purchase;
import com.cenfotec.trebol.repository.PurchaseRepository;
import com.cenfotec.trebol.service.PurchaseService;
import com.cenfotec.trebol.web.rest.errors.ExceptionTranslator;
import com.cenfotec.trebol.service.dto.PurchaseCriteria;
import com.cenfotec.trebol.service.PurchaseQueryService;

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
 * Test class for the PurchaseResource REST controller.
 *
 * @see PurchaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class PurchaseResourceIntTest {

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_HOME_DELIVERY = false;
    private static final Boolean UPDATED_HOME_DELIVERY = true;

    private static final Long DEFAULT_PAYMENT_ID = 1L;
    private static final Long UPDATED_PAYMENT_ID = 2L;

    private static final Long DEFAULT_ORDER_ID = 1L;
    private static final Long UPDATED_ORDER_ID = 2L;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PurchaseQueryService purchaseQueryService;

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

    private MockMvc restPurchaseMockMvc;

    private Purchase purchase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PurchaseResource purchaseResource = new PurchaseResource(purchaseService, purchaseQueryService);
        this.restPurchaseMockMvc = MockMvcBuilders.standaloneSetup(purchaseResource)
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
    public static Purchase createEntity(EntityManager em) {
        Purchase purchase = new Purchase()
            .state(DEFAULT_STATE)
            .homeDelivery(DEFAULT_HOME_DELIVERY)
            .paymentId(DEFAULT_PAYMENT_ID)
            .orderId(DEFAULT_ORDER_ID);
        return purchase;
    }

    @Before
    public void initTest() {
        purchase = createEntity(em);
    }

    @Test
    @Transactional
    public void createPurchase() throws Exception {
        int databaseSizeBeforeCreate = purchaseRepository.findAll().size();

        // Create the Purchase
        restPurchaseMockMvc.perform(post("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(purchase)))
            .andExpect(status().isCreated());

        // Validate the Purchase in the database
        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeCreate + 1);
        Purchase testPurchase = purchaseList.get(purchaseList.size() - 1);
        assertThat(testPurchase.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testPurchase.isHomeDelivery()).isEqualTo(DEFAULT_HOME_DELIVERY);
        assertThat(testPurchase.getPaymentId()).isEqualTo(DEFAULT_PAYMENT_ID);
        assertThat(testPurchase.getOrderId()).isEqualTo(DEFAULT_ORDER_ID);
    }

    @Test
    @Transactional
    public void createPurchaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = purchaseRepository.findAll().size();

        // Create the Purchase with an existing ID
        purchase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseMockMvc.perform(post("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(purchase)))
            .andExpect(status().isBadRequest());

        // Validate the Purchase in the database
        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseRepository.findAll().size();
        // set the field null
        purchase.setState(null);

        // Create the Purchase, which fails.

        restPurchaseMockMvc.perform(post("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(purchase)))
            .andExpect(status().isBadRequest());

        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHomeDeliveryIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseRepository.findAll().size();
        // set the field null
        purchase.setHomeDelivery(null);

        // Create the Purchase, which fails.

        restPurchaseMockMvc.perform(post("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(purchase)))
            .andExpect(status().isBadRequest());

        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPurchases() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList
        restPurchaseMockMvc.perform(get("/api/purchases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchase.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].homeDelivery").value(hasItem(DEFAULT_HOME_DELIVERY.booleanValue())))
            .andExpect(jsonPath("$.[*].paymentId").value(hasItem(DEFAULT_PAYMENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].orderId").value(hasItem(DEFAULT_ORDER_ID.intValue())));
    }
    
    @Test
    @Transactional
    public void getPurchase() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get the purchase
        restPurchaseMockMvc.perform(get("/api/purchases/{id}", purchase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(purchase.getId().intValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.homeDelivery").value(DEFAULT_HOME_DELIVERY.booleanValue()))
            .andExpect(jsonPath("$.paymentId").value(DEFAULT_PAYMENT_ID.intValue()))
            .andExpect(jsonPath("$.orderId").value(DEFAULT_ORDER_ID.intValue()));
    }

    @Test
    @Transactional
    public void getAllPurchasesByStateIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where state equals to DEFAULT_STATE
        defaultPurchaseShouldBeFound("state.equals=" + DEFAULT_STATE);

        // Get all the purchaseList where state equals to UPDATED_STATE
        defaultPurchaseShouldNotBeFound("state.equals=" + UPDATED_STATE);
    }

    @Test
    @Transactional
    public void getAllPurchasesByStateIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where state in DEFAULT_STATE or UPDATED_STATE
        defaultPurchaseShouldBeFound("state.in=" + DEFAULT_STATE + "," + UPDATED_STATE);

        // Get all the purchaseList where state equals to UPDATED_STATE
        defaultPurchaseShouldNotBeFound("state.in=" + UPDATED_STATE);
    }

    @Test
    @Transactional
    public void getAllPurchasesByStateIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where state is not null
        defaultPurchaseShouldBeFound("state.specified=true");

        // Get all the purchaseList where state is null
        defaultPurchaseShouldNotBeFound("state.specified=false");
    }

    @Test
    @Transactional
    public void getAllPurchasesByHomeDeliveryIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where homeDelivery equals to DEFAULT_HOME_DELIVERY
        defaultPurchaseShouldBeFound("homeDelivery.equals=" + DEFAULT_HOME_DELIVERY);

        // Get all the purchaseList where homeDelivery equals to UPDATED_HOME_DELIVERY
        defaultPurchaseShouldNotBeFound("homeDelivery.equals=" + UPDATED_HOME_DELIVERY);
    }

    @Test
    @Transactional
    public void getAllPurchasesByHomeDeliveryIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where homeDelivery in DEFAULT_HOME_DELIVERY or UPDATED_HOME_DELIVERY
        defaultPurchaseShouldBeFound("homeDelivery.in=" + DEFAULT_HOME_DELIVERY + "," + UPDATED_HOME_DELIVERY);

        // Get all the purchaseList where homeDelivery equals to UPDATED_HOME_DELIVERY
        defaultPurchaseShouldNotBeFound("homeDelivery.in=" + UPDATED_HOME_DELIVERY);
    }

    @Test
    @Transactional
    public void getAllPurchasesByHomeDeliveryIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where homeDelivery is not null
        defaultPurchaseShouldBeFound("homeDelivery.specified=true");

        // Get all the purchaseList where homeDelivery is null
        defaultPurchaseShouldNotBeFound("homeDelivery.specified=false");
    }

    @Test
    @Transactional
    public void getAllPurchasesByPaymentIdIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where paymentId equals to DEFAULT_PAYMENT_ID
        defaultPurchaseShouldBeFound("paymentId.equals=" + DEFAULT_PAYMENT_ID);

        // Get all the purchaseList where paymentId equals to UPDATED_PAYMENT_ID
        defaultPurchaseShouldNotBeFound("paymentId.equals=" + UPDATED_PAYMENT_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByPaymentIdIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where paymentId in DEFAULT_PAYMENT_ID or UPDATED_PAYMENT_ID
        defaultPurchaseShouldBeFound("paymentId.in=" + DEFAULT_PAYMENT_ID + "," + UPDATED_PAYMENT_ID);

        // Get all the purchaseList where paymentId equals to UPDATED_PAYMENT_ID
        defaultPurchaseShouldNotBeFound("paymentId.in=" + UPDATED_PAYMENT_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByPaymentIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where paymentId is not null
        defaultPurchaseShouldBeFound("paymentId.specified=true");

        // Get all the purchaseList where paymentId is null
        defaultPurchaseShouldNotBeFound("paymentId.specified=false");
    }

    @Test
    @Transactional
    public void getAllPurchasesByPaymentIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where paymentId greater than or equals to DEFAULT_PAYMENT_ID
        defaultPurchaseShouldBeFound("paymentId.greaterOrEqualThan=" + DEFAULT_PAYMENT_ID);

        // Get all the purchaseList where paymentId greater than or equals to UPDATED_PAYMENT_ID
        defaultPurchaseShouldNotBeFound("paymentId.greaterOrEqualThan=" + UPDATED_PAYMENT_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByPaymentIdIsLessThanSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where paymentId less than or equals to DEFAULT_PAYMENT_ID
        defaultPurchaseShouldNotBeFound("paymentId.lessThan=" + DEFAULT_PAYMENT_ID);

        // Get all the purchaseList where paymentId less than or equals to UPDATED_PAYMENT_ID
        defaultPurchaseShouldBeFound("paymentId.lessThan=" + UPDATED_PAYMENT_ID);
    }


    @Test
    @Transactional
    public void getAllPurchasesByOrderIdIsEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where orderId equals to DEFAULT_ORDER_ID
        defaultPurchaseShouldBeFound("orderId.equals=" + DEFAULT_ORDER_ID);

        // Get all the purchaseList where orderId equals to UPDATED_ORDER_ID
        defaultPurchaseShouldNotBeFound("orderId.equals=" + UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByOrderIdIsInShouldWork() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where orderId in DEFAULT_ORDER_ID or UPDATED_ORDER_ID
        defaultPurchaseShouldBeFound("orderId.in=" + DEFAULT_ORDER_ID + "," + UPDATED_ORDER_ID);

        // Get all the purchaseList where orderId equals to UPDATED_ORDER_ID
        defaultPurchaseShouldNotBeFound("orderId.in=" + UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByOrderIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where orderId is not null
        defaultPurchaseShouldBeFound("orderId.specified=true");

        // Get all the purchaseList where orderId is null
        defaultPurchaseShouldNotBeFound("orderId.specified=false");
    }

    @Test
    @Transactional
    public void getAllPurchasesByOrderIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where orderId greater than or equals to DEFAULT_ORDER_ID
        defaultPurchaseShouldBeFound("orderId.greaterOrEqualThan=" + DEFAULT_ORDER_ID);

        // Get all the purchaseList where orderId greater than or equals to UPDATED_ORDER_ID
        defaultPurchaseShouldNotBeFound("orderId.greaterOrEqualThan=" + UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void getAllPurchasesByOrderIdIsLessThanSomething() throws Exception {
        // Initialize the database
        purchaseRepository.saveAndFlush(purchase);

        // Get all the purchaseList where orderId less than or equals to DEFAULT_ORDER_ID
        defaultPurchaseShouldNotBeFound("orderId.lessThan=" + DEFAULT_ORDER_ID);

        // Get all the purchaseList where orderId less than or equals to UPDATED_ORDER_ID
        defaultPurchaseShouldBeFound("orderId.lessThan=" + UPDATED_ORDER_ID);
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultPurchaseShouldBeFound(String filter) throws Exception {
        restPurchaseMockMvc.perform(get("/api/purchases?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchase.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].homeDelivery").value(hasItem(DEFAULT_HOME_DELIVERY.booleanValue())))
            .andExpect(jsonPath("$.[*].paymentId").value(hasItem(DEFAULT_PAYMENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].orderId").value(hasItem(DEFAULT_ORDER_ID.intValue())));

        // Check, that the count call also returns 1
        restPurchaseMockMvc.perform(get("/api/purchases/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultPurchaseShouldNotBeFound(String filter) throws Exception {
        restPurchaseMockMvc.perform(get("/api/purchases?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPurchaseMockMvc.perform(get("/api/purchases/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingPurchase() throws Exception {
        // Get the purchase
        restPurchaseMockMvc.perform(get("/api/purchases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePurchase() throws Exception {
        // Initialize the database
        purchaseService.save(purchase);

        int databaseSizeBeforeUpdate = purchaseRepository.findAll().size();

        // Update the purchase
        Purchase updatedPurchase = purchaseRepository.findById(purchase.getId()).get();
        // Disconnect from session so that the updates on updatedPurchase are not directly saved in db
        em.detach(updatedPurchase);
        updatedPurchase
            .state(UPDATED_STATE)
            .homeDelivery(UPDATED_HOME_DELIVERY)
            .paymentId(UPDATED_PAYMENT_ID)
            .orderId(UPDATED_ORDER_ID);

        restPurchaseMockMvc.perform(put("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPurchase)))
            .andExpect(status().isOk());

        // Validate the Purchase in the database
        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeUpdate);
        Purchase testPurchase = purchaseList.get(purchaseList.size() - 1);
        assertThat(testPurchase.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testPurchase.isHomeDelivery()).isEqualTo(UPDATED_HOME_DELIVERY);
        assertThat(testPurchase.getPaymentId()).isEqualTo(UPDATED_PAYMENT_ID);
        assertThat(testPurchase.getOrderId()).isEqualTo(UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingPurchase() throws Exception {
        int databaseSizeBeforeUpdate = purchaseRepository.findAll().size();

        // Create the Purchase

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseMockMvc.perform(put("/api/purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(purchase)))
            .andExpect(status().isBadRequest());

        // Validate the Purchase in the database
        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePurchase() throws Exception {
        // Initialize the database
        purchaseService.save(purchase);

        int databaseSizeBeforeDelete = purchaseRepository.findAll().size();

        // Delete the purchase
        restPurchaseMockMvc.perform(delete("/api/purchases/{id}", purchase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Purchase> purchaseList = purchaseRepository.findAll();
        assertThat(purchaseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Purchase.class);
        Purchase purchase1 = new Purchase();
        purchase1.setId(1L);
        Purchase purchase2 = new Purchase();
        purchase2.setId(purchase1.getId());
        assertThat(purchase1).isEqualTo(purchase2);
        purchase2.setId(2L);
        assertThat(purchase1).isNotEqualTo(purchase2);
        purchase1.setId(null);
        assertThat(purchase1).isNotEqualTo(purchase2);
    }
}
