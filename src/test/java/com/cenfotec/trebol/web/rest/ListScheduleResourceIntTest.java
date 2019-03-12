package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.ListSchedule;
import com.cenfotec.trebol.repository.ListScheduleRepository;
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
 * Test class for the ListScheduleResource REST controller.
 *
 * @see ListScheduleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class ListScheduleResourceIntTest {

    private static final String DEFAULT_DAY = "AAAAAAAAAA";
    private static final String UPDATED_DAY = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_STATE = false;
    private static final Boolean UPDATED_STATE = true;

    @Autowired
    private ListScheduleRepository listScheduleRepository;

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

    private MockMvc restListScheduleMockMvc;

    private ListSchedule listSchedule;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ListScheduleResource listScheduleResource = new ListScheduleResource(listScheduleRepository);
        this.restListScheduleMockMvc = MockMvcBuilders.standaloneSetup(listScheduleResource)
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
    public static ListSchedule createEntity(EntityManager em) {
        ListSchedule listSchedule = new ListSchedule()
            .day(DEFAULT_DAY)
            .time(DEFAULT_TIME)
            .state(DEFAULT_STATE);
        return listSchedule;
    }

    @Before
    public void initTest() {
        listSchedule = createEntity(em);
    }

    @Test
    @Transactional
    public void createListSchedule() throws Exception {
        int databaseSizeBeforeCreate = listScheduleRepository.findAll().size();

        // Create the ListSchedule
        restListScheduleMockMvc.perform(post("/api/list-schedules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listSchedule)))
            .andExpect(status().isCreated());

        // Validate the ListSchedule in the database
        List<ListSchedule> listScheduleList = listScheduleRepository.findAll();
        assertThat(listScheduleList).hasSize(databaseSizeBeforeCreate + 1);
        ListSchedule testListSchedule = listScheduleList.get(listScheduleList.size() - 1);
        assertThat(testListSchedule.getDay()).isEqualTo(DEFAULT_DAY);
        assertThat(testListSchedule.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testListSchedule.isState()).isEqualTo(DEFAULT_STATE);
    }

    @Test
    @Transactional
    public void createListScheduleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = listScheduleRepository.findAll().size();

        // Create the ListSchedule with an existing ID
        listSchedule.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restListScheduleMockMvc.perform(post("/api/list-schedules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listSchedule)))
            .andExpect(status().isBadRequest());

        // Validate the ListSchedule in the database
        List<ListSchedule> listScheduleList = listScheduleRepository.findAll();
        assertThat(listScheduleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllListSchedules() throws Exception {
        // Initialize the database
        listScheduleRepository.saveAndFlush(listSchedule);

        // Get all the listScheduleList
        restListScheduleMockMvc.perform(get("/api/list-schedules?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(listSchedule.getId().intValue())))
            .andExpect(jsonPath("$.[*].day").value(hasItem(DEFAULT_DAY.toString())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(DEFAULT_TIME.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getListSchedule() throws Exception {
        // Initialize the database
        listScheduleRepository.saveAndFlush(listSchedule);

        // Get the listSchedule
        restListScheduleMockMvc.perform(get("/api/list-schedules/{id}", listSchedule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(listSchedule.getId().intValue()))
            .andExpect(jsonPath("$.day").value(DEFAULT_DAY.toString()))
            .andExpect(jsonPath("$.time").value(DEFAULT_TIME.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingListSchedule() throws Exception {
        // Get the listSchedule
        restListScheduleMockMvc.perform(get("/api/list-schedules/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateListSchedule() throws Exception {
        // Initialize the database
        listScheduleRepository.saveAndFlush(listSchedule);

        int databaseSizeBeforeUpdate = listScheduleRepository.findAll().size();

        // Update the listSchedule
        ListSchedule updatedListSchedule = listScheduleRepository.findById(listSchedule.getId()).get();
        // Disconnect from session so that the updates on updatedListSchedule are not directly saved in db
        em.detach(updatedListSchedule);
        updatedListSchedule
            .day(UPDATED_DAY)
            .time(UPDATED_TIME)
            .state(UPDATED_STATE);

        restListScheduleMockMvc.perform(put("/api/list-schedules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedListSchedule)))
            .andExpect(status().isOk());

        // Validate the ListSchedule in the database
        List<ListSchedule> listScheduleList = listScheduleRepository.findAll();
        assertThat(listScheduleList).hasSize(databaseSizeBeforeUpdate);
        ListSchedule testListSchedule = listScheduleList.get(listScheduleList.size() - 1);
        assertThat(testListSchedule.getDay()).isEqualTo(UPDATED_DAY);
        assertThat(testListSchedule.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testListSchedule.isState()).isEqualTo(UPDATED_STATE);
    }

    @Test
    @Transactional
    public void updateNonExistingListSchedule() throws Exception {
        int databaseSizeBeforeUpdate = listScheduleRepository.findAll().size();

        // Create the ListSchedule

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListScheduleMockMvc.perform(put("/api/list-schedules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(listSchedule)))
            .andExpect(status().isBadRequest());

        // Validate the ListSchedule in the database
        List<ListSchedule> listScheduleList = listScheduleRepository.findAll();
        assertThat(listScheduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteListSchedule() throws Exception {
        // Initialize the database
        listScheduleRepository.saveAndFlush(listSchedule);

        int databaseSizeBeforeDelete = listScheduleRepository.findAll().size();

        // Delete the listSchedule
        restListScheduleMockMvc.perform(delete("/api/list-schedules/{id}", listSchedule.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ListSchedule> listScheduleList = listScheduleRepository.findAll();
        assertThat(listScheduleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListSchedule.class);
        ListSchedule listSchedule1 = new ListSchedule();
        listSchedule1.setId(1L);
        ListSchedule listSchedule2 = new ListSchedule();
        listSchedule2.setId(listSchedule1.getId());
        assertThat(listSchedule1).isEqualTo(listSchedule2);
        listSchedule2.setId(2L);
        assertThat(listSchedule1).isNotEqualTo(listSchedule2);
        listSchedule1.setId(null);
        assertThat(listSchedule1).isNotEqualTo(listSchedule2);
    }
}
