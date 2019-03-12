package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.PointsCommerce;
import com.cenfotec.trebol.repository.PointsCommerceRepository;
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
 * Test class for the PointsCommerceResource REST controller.
 *
 * @see PointsCommerceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class PointsCommerceResourceIntTest {

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    @Autowired
    private PointsCommerceRepository pointsCommerceRepository;

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

    private MockMvc restPointsCommerceMockMvc;

    private PointsCommerce pointsCommerce;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointsCommerceResource pointsCommerceResource = new PointsCommerceResource(pointsCommerceRepository);
        this.restPointsCommerceMockMvc = MockMvcBuilders.standaloneSetup(pointsCommerceResource)
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
    public static PointsCommerce createEntity(EntityManager em) {
        PointsCommerce pointsCommerce = new PointsCommerce()
            .points(DEFAULT_POINTS);
        return pointsCommerce;
    }

    @Before
    public void initTest() {
        pointsCommerce = createEntity(em);
    }

    @Test
    @Transactional
    public void createPointsCommerce() throws Exception {
        int databaseSizeBeforeCreate = pointsCommerceRepository.findAll().size();

        // Create the PointsCommerce
        restPointsCommerceMockMvc.perform(post("/api/points-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsCommerce)))
            .andExpect(status().isCreated());

        // Validate the PointsCommerce in the database
        List<PointsCommerce> pointsCommerceList = pointsCommerceRepository.findAll();
        assertThat(pointsCommerceList).hasSize(databaseSizeBeforeCreate + 1);
        PointsCommerce testPointsCommerce = pointsCommerceList.get(pointsCommerceList.size() - 1);
        assertThat(testPointsCommerce.getPoints()).isEqualTo(DEFAULT_POINTS);
    }

    @Test
    @Transactional
    public void createPointsCommerceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointsCommerceRepository.findAll().size();

        // Create the PointsCommerce with an existing ID
        pointsCommerce.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsCommerceMockMvc.perform(post("/api/points-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the PointsCommerce in the database
        List<PointsCommerce> pointsCommerceList = pointsCommerceRepository.findAll();
        assertThat(pointsCommerceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPointsCommerces() throws Exception {
        // Initialize the database
        pointsCommerceRepository.saveAndFlush(pointsCommerce);

        // Get all the pointsCommerceList
        restPointsCommerceMockMvc.perform(get("/api/points-commerces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pointsCommerce.getId().intValue())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }
    
    @Test
    @Transactional
    public void getPointsCommerce() throws Exception {
        // Initialize the database
        pointsCommerceRepository.saveAndFlush(pointsCommerce);

        // Get the pointsCommerce
        restPointsCommerceMockMvc.perform(get("/api/points-commerces/{id}", pointsCommerce.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pointsCommerce.getId().intValue()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }

    @Test
    @Transactional
    public void getNonExistingPointsCommerce() throws Exception {
        // Get the pointsCommerce
        restPointsCommerceMockMvc.perform(get("/api/points-commerces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePointsCommerce() throws Exception {
        // Initialize the database
        pointsCommerceRepository.saveAndFlush(pointsCommerce);

        int databaseSizeBeforeUpdate = pointsCommerceRepository.findAll().size();

        // Update the pointsCommerce
        PointsCommerce updatedPointsCommerce = pointsCommerceRepository.findById(pointsCommerce.getId()).get();
        // Disconnect from session so that the updates on updatedPointsCommerce are not directly saved in db
        em.detach(updatedPointsCommerce);
        updatedPointsCommerce
            .points(UPDATED_POINTS);

        restPointsCommerceMockMvc.perform(put("/api/points-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPointsCommerce)))
            .andExpect(status().isOk());

        // Validate the PointsCommerce in the database
        List<PointsCommerce> pointsCommerceList = pointsCommerceRepository.findAll();
        assertThat(pointsCommerceList).hasSize(databaseSizeBeforeUpdate);
        PointsCommerce testPointsCommerce = pointsCommerceList.get(pointsCommerceList.size() - 1);
        assertThat(testPointsCommerce.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    public void updateNonExistingPointsCommerce() throws Exception {
        int databaseSizeBeforeUpdate = pointsCommerceRepository.findAll().size();

        // Create the PointsCommerce

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsCommerceMockMvc.perform(put("/api/points-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the PointsCommerce in the database
        List<PointsCommerce> pointsCommerceList = pointsCommerceRepository.findAll();
        assertThat(pointsCommerceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePointsCommerce() throws Exception {
        // Initialize the database
        pointsCommerceRepository.saveAndFlush(pointsCommerce);

        int databaseSizeBeforeDelete = pointsCommerceRepository.findAll().size();

        // Delete the pointsCommerce
        restPointsCommerceMockMvc.perform(delete("/api/points-commerces/{id}", pointsCommerce.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<PointsCommerce> pointsCommerceList = pointsCommerceRepository.findAll();
        assertThat(pointsCommerceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointsCommerce.class);
        PointsCommerce pointsCommerce1 = new PointsCommerce();
        pointsCommerce1.setId(1L);
        PointsCommerce pointsCommerce2 = new PointsCommerce();
        pointsCommerce2.setId(pointsCommerce1.getId());
        assertThat(pointsCommerce1).isEqualTo(pointsCommerce2);
        pointsCommerce2.setId(2L);
        assertThat(pointsCommerce1).isNotEqualTo(pointsCommerce2);
        pointsCommerce1.setId(null);
        assertThat(pointsCommerce1).isNotEqualTo(pointsCommerce2);
    }
}
