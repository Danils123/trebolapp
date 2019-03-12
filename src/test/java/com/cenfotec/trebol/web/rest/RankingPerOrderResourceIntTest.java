package com.cenfotec.trebol.web.rest;

import com.cenfotec.trebol.TrebolApp;

import com.cenfotec.trebol.domain.RankingPerOrder;
import com.cenfotec.trebol.repository.RankingPerOrderRepository;
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
 * Test class for the RankingPerOrderResource REST controller.
 *
 * @see RankingPerOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TrebolApp.class)
public class RankingPerOrderResourceIntTest {

    private static final String DEFAULT_COMMENT_FROM_BUYER = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT_FROM_BUYER = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT_FROM_SELLER = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT_FROM_SELLER = "BBBBBBBBBB";

    private static final Integer DEFAULT_RANKING = 1;
    private static final Integer UPDATED_RANKING = 2;

    @Autowired
    private RankingPerOrderRepository rankingPerOrderRepository;

    @Mock
    private RankingPerOrderRepository rankingPerOrderRepositoryMock;

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

    private MockMvc restRankingPerOrderMockMvc;

    private RankingPerOrder rankingPerOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RankingPerOrderResource rankingPerOrderResource = new RankingPerOrderResource(rankingPerOrderRepository);
        this.restRankingPerOrderMockMvc = MockMvcBuilders.standaloneSetup(rankingPerOrderResource)
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
    public static RankingPerOrder createEntity(EntityManager em) {
        RankingPerOrder rankingPerOrder = new RankingPerOrder()
            .commentFromBuyer(DEFAULT_COMMENT_FROM_BUYER)
            .commentFromSeller(DEFAULT_COMMENT_FROM_SELLER)
            .ranking(DEFAULT_RANKING);
        return rankingPerOrder;
    }

    @Before
    public void initTest() {
        rankingPerOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createRankingPerOrder() throws Exception {
        int databaseSizeBeforeCreate = rankingPerOrderRepository.findAll().size();

        // Create the RankingPerOrder
        restRankingPerOrderMockMvc.perform(post("/api/ranking-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rankingPerOrder)))
            .andExpect(status().isCreated());

        // Validate the RankingPerOrder in the database
        List<RankingPerOrder> rankingPerOrderList = rankingPerOrderRepository.findAll();
        assertThat(rankingPerOrderList).hasSize(databaseSizeBeforeCreate + 1);
        RankingPerOrder testRankingPerOrder = rankingPerOrderList.get(rankingPerOrderList.size() - 1);
        assertThat(testRankingPerOrder.getCommentFromBuyer()).isEqualTo(DEFAULT_COMMENT_FROM_BUYER);
        assertThat(testRankingPerOrder.getCommentFromSeller()).isEqualTo(DEFAULT_COMMENT_FROM_SELLER);
        assertThat(testRankingPerOrder.getRanking()).isEqualTo(DEFAULT_RANKING);
    }

    @Test
    @Transactional
    public void createRankingPerOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = rankingPerOrderRepository.findAll().size();

        // Create the RankingPerOrder with an existing ID
        rankingPerOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRankingPerOrderMockMvc.perform(post("/api/ranking-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rankingPerOrder)))
            .andExpect(status().isBadRequest());

        // Validate the RankingPerOrder in the database
        List<RankingPerOrder> rankingPerOrderList = rankingPerOrderRepository.findAll();
        assertThat(rankingPerOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllRankingPerOrders() throws Exception {
        // Initialize the database
        rankingPerOrderRepository.saveAndFlush(rankingPerOrder);

        // Get all the rankingPerOrderList
        restRankingPerOrderMockMvc.perform(get("/api/ranking-per-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rankingPerOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].commentFromBuyer").value(hasItem(DEFAULT_COMMENT_FROM_BUYER.toString())))
            .andExpect(jsonPath("$.[*].commentFromSeller").value(hasItem(DEFAULT_COMMENT_FROM_SELLER.toString())))
            .andExpect(jsonPath("$.[*].ranking").value(hasItem(DEFAULT_RANKING)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllRankingPerOrdersWithEagerRelationshipsIsEnabled() throws Exception {
        RankingPerOrderResource rankingPerOrderResource = new RankingPerOrderResource(rankingPerOrderRepositoryMock);
        when(rankingPerOrderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restRankingPerOrderMockMvc = MockMvcBuilders.standaloneSetup(rankingPerOrderResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restRankingPerOrderMockMvc.perform(get("/api/ranking-per-orders?eagerload=true"))
        .andExpect(status().isOk());

        verify(rankingPerOrderRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllRankingPerOrdersWithEagerRelationshipsIsNotEnabled() throws Exception {
        RankingPerOrderResource rankingPerOrderResource = new RankingPerOrderResource(rankingPerOrderRepositoryMock);
            when(rankingPerOrderRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restRankingPerOrderMockMvc = MockMvcBuilders.standaloneSetup(rankingPerOrderResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restRankingPerOrderMockMvc.perform(get("/api/ranking-per-orders?eagerload=true"))
        .andExpect(status().isOk());

            verify(rankingPerOrderRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getRankingPerOrder() throws Exception {
        // Initialize the database
        rankingPerOrderRepository.saveAndFlush(rankingPerOrder);

        // Get the rankingPerOrder
        restRankingPerOrderMockMvc.perform(get("/api/ranking-per-orders/{id}", rankingPerOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(rankingPerOrder.getId().intValue()))
            .andExpect(jsonPath("$.commentFromBuyer").value(DEFAULT_COMMENT_FROM_BUYER.toString()))
            .andExpect(jsonPath("$.commentFromSeller").value(DEFAULT_COMMENT_FROM_SELLER.toString()))
            .andExpect(jsonPath("$.ranking").value(DEFAULT_RANKING));
    }

    @Test
    @Transactional
    public void getNonExistingRankingPerOrder() throws Exception {
        // Get the rankingPerOrder
        restRankingPerOrderMockMvc.perform(get("/api/ranking-per-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRankingPerOrder() throws Exception {
        // Initialize the database
        rankingPerOrderRepository.saveAndFlush(rankingPerOrder);

        int databaseSizeBeforeUpdate = rankingPerOrderRepository.findAll().size();

        // Update the rankingPerOrder
        RankingPerOrder updatedRankingPerOrder = rankingPerOrderRepository.findById(rankingPerOrder.getId()).get();
        // Disconnect from session so that the updates on updatedRankingPerOrder are not directly saved in db
        em.detach(updatedRankingPerOrder);
        updatedRankingPerOrder
            .commentFromBuyer(UPDATED_COMMENT_FROM_BUYER)
            .commentFromSeller(UPDATED_COMMENT_FROM_SELLER)
            .ranking(UPDATED_RANKING);

        restRankingPerOrderMockMvc.perform(put("/api/ranking-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRankingPerOrder)))
            .andExpect(status().isOk());

        // Validate the RankingPerOrder in the database
        List<RankingPerOrder> rankingPerOrderList = rankingPerOrderRepository.findAll();
        assertThat(rankingPerOrderList).hasSize(databaseSizeBeforeUpdate);
        RankingPerOrder testRankingPerOrder = rankingPerOrderList.get(rankingPerOrderList.size() - 1);
        assertThat(testRankingPerOrder.getCommentFromBuyer()).isEqualTo(UPDATED_COMMENT_FROM_BUYER);
        assertThat(testRankingPerOrder.getCommentFromSeller()).isEqualTo(UPDATED_COMMENT_FROM_SELLER);
        assertThat(testRankingPerOrder.getRanking()).isEqualTo(UPDATED_RANKING);
    }

    @Test
    @Transactional
    public void updateNonExistingRankingPerOrder() throws Exception {
        int databaseSizeBeforeUpdate = rankingPerOrderRepository.findAll().size();

        // Create the RankingPerOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRankingPerOrderMockMvc.perform(put("/api/ranking-per-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rankingPerOrder)))
            .andExpect(status().isBadRequest());

        // Validate the RankingPerOrder in the database
        List<RankingPerOrder> rankingPerOrderList = rankingPerOrderRepository.findAll();
        assertThat(rankingPerOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRankingPerOrder() throws Exception {
        // Initialize the database
        rankingPerOrderRepository.saveAndFlush(rankingPerOrder);

        int databaseSizeBeforeDelete = rankingPerOrderRepository.findAll().size();

        // Delete the rankingPerOrder
        restRankingPerOrderMockMvc.perform(delete("/api/ranking-per-orders/{id}", rankingPerOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<RankingPerOrder> rankingPerOrderList = rankingPerOrderRepository.findAll();
        assertThat(rankingPerOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RankingPerOrder.class);
        RankingPerOrder rankingPerOrder1 = new RankingPerOrder();
        rankingPerOrder1.setId(1L);
        RankingPerOrder rankingPerOrder2 = new RankingPerOrder();
        rankingPerOrder2.setId(rankingPerOrder1.getId());
        assertThat(rankingPerOrder1).isEqualTo(rankingPerOrder2);
        rankingPerOrder2.setId(2L);
        assertThat(rankingPerOrder1).isNotEqualTo(rankingPerOrder2);
        rankingPerOrder1.setId(null);
        assertThat(rankingPerOrder1).isNotEqualTo(rankingPerOrder2);
    }
}
