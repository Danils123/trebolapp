package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ScheduleCommerce;
import com.cenfotec.trebol.repository.ScheduleCommerceRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.cenfotec.trebol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ScheduleCommerceResource REST controller.
 *
 * @see ScheduleCommerceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ScheduleCommerceResourceIntTest {

    private static final String DEFAULT_DAY = "AAAAAAAAAA";
    private static final String UPDATED_DAY = "BBBBBBBBBB";

    private static final Instant DEFAULT_OPEN_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_OPEN_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_CLOSINGTIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CLOSINGTIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private ScheduleCommerceRepository scheduleCommerceRepository;

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

    private MockMvc restScheduleCommerceMockMvc;

    private ScheduleCommerce scheduleCommerce;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ScheduleCommerceResource scheduleCommerceResource = new ScheduleCommerceResource(scheduleCommerceRepository);
        this.restScheduleCommerceMockMvc = MockMvcBuilders.standaloneSetup(scheduleCommerceResource)
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
    public static ScheduleCommerce createEntity(EntityManager em) {
        ScheduleCommerce scheduleCommerce = new ScheduleCommerce()
            .day(DEFAULT_DAY)
            .openTime(DEFAULT_OPEN_TIME)
            .closingtime(DEFAULT_CLOSINGTIME);
        return scheduleCommerce;
    }

    @Before
    public void initTest() {
        scheduleCommerce = createEntity(em);
    }

    @Test
    @Transactional
    public void createScheduleCommerce() throws Exception {
        int databaseSizeBeforeCreate = scheduleCommerceRepository.findAll().size();

        // Create the ScheduleCommerce
        restScheduleCommerceMockMvc.perform(post("/api/schedule-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(scheduleCommerce)))
            .andExpect(status().isCreated());

        // Validate the ScheduleCommerce in the database
        List<ScheduleCommerce> scheduleCommerceList = scheduleCommerceRepository.findAll();
        assertThat(scheduleCommerceList).hasSize(databaseSizeBeforeCreate + 1);
        ScheduleCommerce testScheduleCommerce = scheduleCommerceList.get(scheduleCommerceList.size() - 1);
        assertThat(testScheduleCommerce.getDay()).isEqualTo(DEFAULT_DAY);
        assertThat(testScheduleCommerce.getOpenTime()).isEqualTo(DEFAULT_OPEN_TIME);
        assertThat(testScheduleCommerce.getClosingtime()).isEqualTo(DEFAULT_CLOSINGTIME);
    }

    @Test
    @Transactional
    public void createScheduleCommerceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = scheduleCommerceRepository.findAll().size();

        // Create the ScheduleCommerce with an existing ID
        scheduleCommerce.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restScheduleCommerceMockMvc.perform(post("/api/schedule-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(scheduleCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ScheduleCommerce in the database
        List<ScheduleCommerce> scheduleCommerceList = scheduleCommerceRepository.findAll();
        assertThat(scheduleCommerceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllScheduleCommerces() throws Exception {
        // Initialize the database
        scheduleCommerceRepository.saveAndFlush(scheduleCommerce);

        // Get all the scheduleCommerceList
        restScheduleCommerceMockMvc.perform(get("/api/schedule-commerces?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scheduleCommerce.getId().intValue())))
            .andExpect(jsonPath("$.[*].day").value(hasItem(DEFAULT_DAY.toString())))
            .andExpect(jsonPath("$.[*].openTime").value(hasItem(DEFAULT_OPEN_TIME.toString())))
            .andExpect(jsonPath("$.[*].closingtime").value(hasItem(DEFAULT_CLOSINGTIME.toString())));
    }
    
    @Test
    @Transactional
    public void getScheduleCommerce() throws Exception {
        // Initialize the database
        scheduleCommerceRepository.saveAndFlush(scheduleCommerce);

        // Get the scheduleCommerce
        restScheduleCommerceMockMvc.perform(get("/api/schedule-commerces/{id}", scheduleCommerce.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(scheduleCommerce.getId().intValue()))
            .andExpect(jsonPath("$.day").value(DEFAULT_DAY.toString()))
            .andExpect(jsonPath("$.openTime").value(DEFAULT_OPEN_TIME.toString()))
            .andExpect(jsonPath("$.closingtime").value(DEFAULT_CLOSINGTIME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingScheduleCommerce() throws Exception {
        // Get the scheduleCommerce
        restScheduleCommerceMockMvc.perform(get("/api/schedule-commerces/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateScheduleCommerce() throws Exception {
        // Initialize the database
        scheduleCommerceRepository.saveAndFlush(scheduleCommerce);

        int databaseSizeBeforeUpdate = scheduleCommerceRepository.findAll().size();

        // Update the scheduleCommerce
        ScheduleCommerce updatedScheduleCommerce = scheduleCommerceRepository.findById(scheduleCommerce.getId()).get();
        // Disconnect from session so that the updates on updatedScheduleCommerce are not directly saved in db
        em.detach(updatedScheduleCommerce);
        updatedScheduleCommerce
            .day(UPDATED_DAY)
            .openTime(UPDATED_OPEN_TIME)
            .closingtime(UPDATED_CLOSINGTIME);

        restScheduleCommerceMockMvc.perform(put("/api/schedule-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedScheduleCommerce)))
            .andExpect(status().isOk());

        // Validate the ScheduleCommerce in the database
        List<ScheduleCommerce> scheduleCommerceList = scheduleCommerceRepository.findAll();
        assertThat(scheduleCommerceList).hasSize(databaseSizeBeforeUpdate);
        ScheduleCommerce testScheduleCommerce = scheduleCommerceList.get(scheduleCommerceList.size() - 1);
        assertThat(testScheduleCommerce.getDay()).isEqualTo(UPDATED_DAY);
        assertThat(testScheduleCommerce.getOpenTime()).isEqualTo(UPDATED_OPEN_TIME);
        assertThat(testScheduleCommerce.getClosingtime()).isEqualTo(UPDATED_CLOSINGTIME);
    }

    @Test
    @Transactional
    public void updateNonExistingScheduleCommerce() throws Exception {
        int databaseSizeBeforeUpdate = scheduleCommerceRepository.findAll().size();

        // Create the ScheduleCommerce

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScheduleCommerceMockMvc.perform(put("/api/schedule-commerces")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(scheduleCommerce)))
            .andExpect(status().isBadRequest());

        // Validate the ScheduleCommerce in the database
        List<ScheduleCommerce> scheduleCommerceList = scheduleCommerceRepository.findAll();
        assertThat(scheduleCommerceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteScheduleCommerce() throws Exception {
        // Initialize the database
        scheduleCommerceRepository.saveAndFlush(scheduleCommerce);

        int databaseSizeBeforeDelete = scheduleCommerceRepository.findAll().size();

        // Delete the scheduleCommerce
        restScheduleCommerceMockMvc.perform(delete("/api/schedule-commerces/{id}", scheduleCommerce.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ScheduleCommerce> scheduleCommerceList = scheduleCommerceRepository.findAll();
        assertThat(scheduleCommerceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScheduleCommerce.class);
        ScheduleCommerce scheduleCommerce1 = new ScheduleCommerce();
        scheduleCommerce1.setId(1L);
        ScheduleCommerce scheduleCommerce2 = new ScheduleCommerce();
        scheduleCommerce2.setId(scheduleCommerce1.getId());
        assertThat(scheduleCommerce1).isEqualTo(scheduleCommerce2);
        scheduleCommerce2.setId(2L);
        assertThat(scheduleCommerce1).isNotEqualTo(scheduleCommerce2);
        scheduleCommerce1.setId(null);
        assertThat(scheduleCommerce1).isNotEqualTo(scheduleCommerce2);
    }
}
