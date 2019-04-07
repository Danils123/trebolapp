package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.CommerceUser;
import com.cenfotec.trebol.repository.CommerceUserRepository;
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
 * Test class for the CommerceUserResource REST controller.
 *
 * @see CommerceUserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class CommerceUserResourceIntTest {

    private static final Long DEFAULT_ID_COMMERCE = 1L;
    private static final Long UPDATED_ID_COMMERCE = 2L;

    private static final Long DEFAULT_ID_USER = 1L;
    private static final Long UPDATED_ID_USER = 2L;

    @Autowired
    private CommerceUserRepository commerceUserRepository;

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

    private MockMvc restCommerceUserMockMvc;

    private CommerceUser commerceUser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CommerceUserResource commerceUserResource = new CommerceUserResource(commerceUserRepository);
        this.restCommerceUserMockMvc = MockMvcBuilders.standaloneSetup(commerceUserResource)
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
    public static CommerceUser createEntity(EntityManager em) {
        CommerceUser commerceUser = new CommerceUser()
            .idCommerce(DEFAULT_ID_COMMERCE)
            .idUser(DEFAULT_ID_USER);
        return commerceUser;
    }

    @Before
    public void initTest() {
        commerceUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createCommerceUser() throws Exception {
        int databaseSizeBeforeCreate = commerceUserRepository.findAll().size();

        // Create the CommerceUser
        restCommerceUserMockMvc.perform(post("/api/commerce-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commerceUser)))
            .andExpect(status().isCreated());

        // Validate the CommerceUser in the database
        List<CommerceUser> commerceUserList = commerceUserRepository.findAll();
        assertThat(commerceUserList).hasSize(databaseSizeBeforeCreate + 1);
        CommerceUser testCommerceUser = commerceUserList.get(commerceUserList.size() - 1);
        assertThat(testCommerceUser.getIdCommerce()).isEqualTo(DEFAULT_ID_COMMERCE);
        assertThat(testCommerceUser.getIdUser()).isEqualTo(DEFAULT_ID_USER);
    }

    @Test
    @Transactional
    public void createCommerceUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = commerceUserRepository.findAll().size();

        // Create the CommerceUser with an existing ID
        commerceUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommerceUserMockMvc.perform(post("/api/commerce-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commerceUser)))
            .andExpect(status().isBadRequest());

        // Validate the CommerceUser in the database
        List<CommerceUser> commerceUserList = commerceUserRepository.findAll();
        assertThat(commerceUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCommerceUsers() throws Exception {
        // Initialize the database
        commerceUserRepository.saveAndFlush(commerceUser);

        // Get all the commerceUserList
        restCommerceUserMockMvc.perform(get("/api/commerce-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commerceUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].idCommerce").value(hasItem(DEFAULT_ID_COMMERCE.intValue())))
            .andExpect(jsonPath("$.[*].idUser").value(hasItem(DEFAULT_ID_USER.intValue())));
    }
    
    @Test
    @Transactional
    public void getCommerceUser() throws Exception {
        // Initialize the database
        commerceUserRepository.saveAndFlush(commerceUser);

        // Get the commerceUser
        restCommerceUserMockMvc.perform(get("/api/commerce-users/{id}", commerceUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(commerceUser.getId().intValue()))
            .andExpect(jsonPath("$.idCommerce").value(DEFAULT_ID_COMMERCE.intValue()))
            .andExpect(jsonPath("$.idUser").value(DEFAULT_ID_USER.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCommerceUser() throws Exception {
        // Get the commerceUser
        restCommerceUserMockMvc.perform(get("/api/commerce-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCommerceUser() throws Exception {
        // Initialize the database
        commerceUserRepository.saveAndFlush(commerceUser);

        int databaseSizeBeforeUpdate = commerceUserRepository.findAll().size();

        // Update the commerceUser
        CommerceUser updatedCommerceUser = commerceUserRepository.findById(commerceUser.getId()).get();
        // Disconnect from session so that the updates on updatedCommerceUser are not directly saved in db
        em.detach(updatedCommerceUser);
        updatedCommerceUser
            .idCommerce(UPDATED_ID_COMMERCE)
            .idUser(UPDATED_ID_USER);

        restCommerceUserMockMvc.perform(put("/api/commerce-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCommerceUser)))
            .andExpect(status().isOk());

        // Validate the CommerceUser in the database
        List<CommerceUser> commerceUserList = commerceUserRepository.findAll();
        assertThat(commerceUserList).hasSize(databaseSizeBeforeUpdate);
        CommerceUser testCommerceUser = commerceUserList.get(commerceUserList.size() - 1);
        assertThat(testCommerceUser.getIdCommerce()).isEqualTo(UPDATED_ID_COMMERCE);
        assertThat(testCommerceUser.getIdUser()).isEqualTo(UPDATED_ID_USER);
    }

    @Test
    @Transactional
    public void updateNonExistingCommerceUser() throws Exception {
        int databaseSizeBeforeUpdate = commerceUserRepository.findAll().size();

        // Create the CommerceUser

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommerceUserMockMvc.perform(put("/api/commerce-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commerceUser)))
            .andExpect(status().isBadRequest());

        // Validate the CommerceUser in the database
        List<CommerceUser> commerceUserList = commerceUserRepository.findAll();
        assertThat(commerceUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCommerceUser() throws Exception {
        // Initialize the database
        commerceUserRepository.saveAndFlush(commerceUser);

        int databaseSizeBeforeDelete = commerceUserRepository.findAll().size();

        // Delete the commerceUser
        restCommerceUserMockMvc.perform(delete("/api/commerce-users/{id}", commerceUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CommerceUser> commerceUserList = commerceUserRepository.findAll();
        assertThat(commerceUserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CommerceUser.class);
        CommerceUser commerceUser1 = new CommerceUser();
        commerceUser1.setId(1L);
        CommerceUser commerceUser2 = new CommerceUser();
        commerceUser2.setId(commerceUser1.getId());
        assertThat(commerceUser1).isEqualTo(commerceUser2);
        commerceUser2.setId(2L);
        assertThat(commerceUser1).isNotEqualTo(commerceUser2);
        commerceUser1.setId(null);
        assertThat(commerceUser1).isNotEqualTo(commerceUser2);
    }
}
