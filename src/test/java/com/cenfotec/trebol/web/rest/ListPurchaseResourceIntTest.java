package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ListPurchase;
import com.cenfotec.trebol.repository.ListPurchaseRepository;
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
 * Test class for the ListPurchaseResource REST controller.
 *
 * @see ListPurchaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ListPurchaseResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_STATE = false;
    private static final Boolean UPDATED_STATE = true;

    @Autowired
    private ListPurchaseRepository listPurchaseRepository;

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

    private MockMvc restListPurchaseMockMvc;

    private ListPurchase listPurchase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ListPurchaseResource listPurchaseResource = new ListPurchaseResource(listPurchaseRepository);
        this.restListPurchaseMockMvc = MockMvcBuilders.standaloneSetup(listPurchaseResource)
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
    public static ListPurchase createEntity(EntityManager em) {
        ListPurchase listPurchase = new ListPurchase()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .state(DEFAULT_STATE);
        return listPurchase;
    }

    @Before
    public void initTest() {
        listPurchase = createEntity(em);
    }

    @Test
    @Transactional
    public void createListPurchase() throws Exception {
        int databaseSizeBeforeCreate = listPurchaseRepository.findAll().size();

        // Create the ListPurchase
        restListPurchaseMockMvc.perform(post("/api/list-purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listPurchase)))
            .andExpect(status().isCreated());

        // Validate the ListPurchase in the database
        List<ListPurchase> listPurchaseList = listPurchaseRepository.findAll();
        assertThat(listPurchaseList).hasSize(databaseSizeBeforeCreate + 1);
        ListPurchase testListPurchase = listPurchaseList.get(listPurchaseList.size() - 1);
        assertThat(testListPurchase.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testListPurchase.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testListPurchase.isState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    public void createListPurchaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = listPurchaseRepository.findAll().size();

        // Create the ListPurchase with an existing ID
        listPurchase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restListPurchaseMockMvc.perform(post("/api/list-purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listPurchase)))
            .andExpect(status().isBadRequest());

        // Validate the ListPurchase in the database
        List<ListPurchase> listPurchaseList = listPurchaseRepository.findAll();
        assertThat(listPurchaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllListPurchases() throws Exception {
        // Initialize the database
        listPurchaseRepository.saveAndFlush(listPurchase);

        // Get all the listPurchaseList
        restListPurchaseMockMvc.perform(get("/api/list-purchases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(listPurchase.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getListPurchase() throws Exception {
        // Initialize the database
        listPurchaseRepository.saveAndFlush(listPurchase);

        // Get the listPurchase
        restListPurchaseMockMvc.perform(get("/api/list-purchases/{id}", listPurchase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(listPurchase.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingListPurchase() throws Exception {
        // Get the listPurchase
        restListPurchaseMockMvc.perform(get("/api/list-purchases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateListPurchase() throws Exception {
        // Initialize the database
        listPurchaseRepository.saveAndFlush(listPurchase);

        int databaseSizeBeforeUpdate = listPurchaseRepository.findAll().size();

        // Update the listPurchase
        ListPurchase updatedListPurchase = listPurchaseRepository.findById(listPurchase.getId()).get();
        // Disconnect from session so that the updates on updatedListPurchase are not directly saved in db
        em.detach(updatedListPurchase);
        updatedListPurchase
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .state(UPDATED_STATE);

        restListPurchaseMockMvc.perform(put("/api/list-purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedListPurchase)))
            .andExpect(status().isOk());

        // Validate the ListPurchase in the database
        List<ListPurchase> listPurchaseList = listPurchaseRepository.findAll();
        assertThat(listPurchaseList).hasSize(databaseSizeBeforeUpdate);
        ListPurchase testListPurchase = listPurchaseList.get(listPurchaseList.size() - 1);
        assertThat(testListPurchase.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testListPurchase.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testListPurchase.isState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    public void updateNonExistingListPurchase() throws Exception {
        int databaseSizeBeforeUpdate = listPurchaseRepository.findAll().size();

        // Create the ListPurchase

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListPurchaseMockMvc.perform(put("/api/list-purchases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listPurchase)))
            .andExpect(status().isBadRequest());

        // Validate the ListPurchase in the database
        List<ListPurchase> listPurchaseList = listPurchaseRepository.findAll();
        assertThat(listPurchaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteListPurchase() throws Exception {
        // Initialize the database
        listPurchaseRepository.saveAndFlush(listPurchase);

        int databaseSizeBeforeDelete = listPurchaseRepository.findAll().size();

        // Delete the listPurchase
        restListPurchaseMockMvc.perform(delete("/api/list-purchases/{id}", listPurchase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ListPurchase> listPurchaseList = listPurchaseRepository.findAll();
        assertThat(listPurchaseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListPurchase.class);
        ListPurchase listPurchase1 = new ListPurchase();
        listPurchase1.setId(1L);
        ListPurchase listPurchase2 = new ListPurchase();
        listPurchase2.setId(listPurchase1.getId());
        assertThat(listPurchase1).isEqualTo(listPurchase2);
        listPurchase2.setId(2L);
        assertThat(listPurchase1).isNotEqualTo(listPurchase2);
        listPurchase1.setId(null);
        assertThat(listPurchase1).isNotEqualTo(listPurchase2);
    }
}
