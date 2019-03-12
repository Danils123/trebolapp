package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ParametersCommerce;
import com.cenfotec.trebol.repository.ParametersCommerceRepository;
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
 * Test class for the ParametersCommerceResource REST controller.
 *
 * @see ParametersCommerceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ParametersCommerceResourceIntTest {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_STATE = false;
    private static final Boolean UPDATED_STATE = true;

    @Autowired
    private ParametersCommerceRepository parametersCommerceRepository;

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

    private MockMvc restParametersCommerceMockMvc;

    private ParametersCommerce parametersCommerce;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ParametersCommerceResource parametersCommerceResource = new ParametersCommerceResource(parametersCommerceRepository);
        this.restParametersCommerceMockMvc = MockMvcBuilders.standaloneSetup(parametersCommerceResource)
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
    public static ParametersCommerce createEntity(EntityManager em) {
        ParametersCommerce parametersCommerce = new ParametersCommerce()
            .key(DEFAULT_KEY)
            .value(DEFAULT_VALUE)
            .state(DEFAULT_STATE);
        return parametersCommerce;
    }

    @Before
    public void initTest() {
        parametersCommerce = createEntity(em);
    }

    @Test
    @Transactional
    public void createParametersCommerce() throws Exception {
        int databaseSizeBeforeCreate = parametersCommerceRepository.findAll().size();

        // Create the ParametersCommerce
        restParametersCommerceMockMvc.perform(post("/api/parameters-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parametersCommerce)))
            .andExpect(status().isCreated());

        // Validate the ParametersCommerce in the database
        List<ParametersCommerce> parametersCommerceList = parametersCommerceRepository.findAll();
        assertThat(parametersCommerceList).hasSize(databaseSizeBeforeCreate + 1);
        ParametersCommerce testParametersCommerce = parametersCommerceList.get(parametersCommerceList.size() - 1);
        assertThat(testParametersCommerce.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testParametersCommerce.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testParametersCommerce.isState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    public void createParametersCommerceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = parametersCommerceRepository.findAll().size();

        // Create the ParametersCommerce with an existing ID
        parametersCommerce.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restParametersCommerceMockMvc.perform(post("/api/parameters-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parametersCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ParametersCommerce in the database
        List<ParametersCommerce> parametersCommerceList = parametersCommerceRepository.findAll();
        assertThat(parametersCommerceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllParametersCommerces() throws Exception {
        // Initialize the database
        parametersCommerceRepository.saveAndFlush(parametersCommerce);

        // Get all the parametersCommerceList
        restParametersCommerceMockMvc.perform(get("/api/parameters-commerces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parametersCommerce.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getParametersCommerce() throws Exception {
        // Initialize the database
        parametersCommerceRepository.saveAndFlush(parametersCommerce);

        // Get the parametersCommerce
        restParametersCommerceMockMvc.perform(get("/api/parameters-commerces/{id}", parametersCommerce.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(parametersCommerce.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingParametersCommerce() throws Exception {
        // Get the parametersCommerce
        restParametersCommerceMockMvc.perform(get("/api/parameters-commerces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateParametersCommerce() throws Exception {
        // Initialize the database
        parametersCommerceRepository.saveAndFlush(parametersCommerce);

        int databaseSizeBeforeUpdate = parametersCommerceRepository.findAll().size();

        // Update the parametersCommerce
        ParametersCommerce updatedParametersCommerce = parametersCommerceRepository.findById(parametersCommerce.getId()).get();
        // Disconnect from session so that the updates on updatedParametersCommerce are not directly saved in db
        em.detach(updatedParametersCommerce);
        updatedParametersCommerce
            .key(UPDATED_KEY)
            .value(UPDATED_VALUE)
            .state(UPDATED_STATE);

        restParametersCommerceMockMvc.perform(put("/api/parameters-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedParametersCommerce)))
            .andExpect(status().isOk());

        // Validate the ParametersCommerce in the database
        List<ParametersCommerce> parametersCommerceList = parametersCommerceRepository.findAll();
        assertThat(parametersCommerceList).hasSize(databaseSizeBeforeUpdate);
        ParametersCommerce testParametersCommerce = parametersCommerceList.get(parametersCommerceList.size() - 1);
        assertThat(testParametersCommerce.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testParametersCommerce.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testParametersCommerce.isState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    public void updateNonExistingParametersCommerce() throws Exception {
        int databaseSizeBeforeUpdate = parametersCommerceRepository.findAll().size();

        // Create the ParametersCommerce

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParametersCommerceMockMvc.perform(put("/api/parameters-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parametersCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ParametersCommerce in the database
        List<ParametersCommerce> parametersCommerceList = parametersCommerceRepository.findAll();
        assertThat(parametersCommerceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteParametersCommerce() throws Exception {
        // Initialize the database
        parametersCommerceRepository.saveAndFlush(parametersCommerce);

        int databaseSizeBeforeDelete = parametersCommerceRepository.findAll().size();

        // Delete the parametersCommerce
        restParametersCommerceMockMvc.perform(delete("/api/parameters-commerces/{id}", parametersCommerce.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ParametersCommerce> parametersCommerceList = parametersCommerceRepository.findAll();
        assertThat(parametersCommerceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParametersCommerce.class);
        ParametersCommerce parametersCommerce1 = new ParametersCommerce();
        parametersCommerce1.setId(1L);
        ParametersCommerce parametersCommerce2 = new ParametersCommerce();
        parametersCommerce2.setId(parametersCommerce1.getId());
        assertThat(parametersCommerce1).isEqualTo(parametersCommerce2);
        parametersCommerce2.setId(2L);
        assertThat(parametersCommerce1).isNotEqualTo(parametersCommerce2);
        parametersCommerce1.setId(null);
        assertThat(parametersCommerce1).isNotEqualTo(parametersCommerce2);
    }
}
