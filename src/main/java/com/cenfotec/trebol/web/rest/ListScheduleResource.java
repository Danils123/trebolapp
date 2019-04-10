package com.cenfotec.trebol.web.rest;
import com.cenfotec.trebol.domain.ListPurchase;
import com.cenfotec.trebol.domain.ListSchedule;
import com.cenfotec.trebol.domain.User;
import com.cenfotec.trebol.domain.UserExtra;
import com.cenfotec.trebol.repository.ListPurchaseRepository;
import com.cenfotec.trebol.repository.ListScheduleRepository;
import com.cenfotec.trebol.repository.UserRepository;
import com.cenfotec.trebol.service.MailService;
import com.cenfotec.trebol.web.rest.errors.BadRequestAlertException;
import com.cenfotec.trebol.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ListSchedule.
 */
@RestController
@RequestMapping("/api")
public class ListScheduleResource {

    private final Logger log = LoggerFactory.getLogger(ListScheduleResource.class);

    private static final String ENTITY_NAME = "listSchedule";

    private final ListScheduleRepository listScheduleRepository;

    private final MailService mailService;

    private final UserRepository userRepository;

    private final ListPurchaseRepository listPurchaseRepository;

    public ListScheduleResource(ListScheduleRepository listScheduleRepository, MailService mailService, UserRepository userRepository, ListPurchaseRepository listPurchaseRepository) {
        this.listScheduleRepository = listScheduleRepository;
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.listPurchaseRepository = listPurchaseRepository;
    }

    /**
     * POST  /list-schedules : Create a new listSchedule.
     *
     * @param listSchedule the listSchedule to create
     * @return the ResponseEntity with status 201 (Created) and with body the new listSchedule, or with status 400 (Bad Request) if the listSchedule has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/list-schedules")
    public ResponseEntity<ListSchedule> createListSchedule(@RequestBody ListSchedule listSchedule) throws URISyntaxException {
        log.debug("REST request to save ListSchedule : {}", listSchedule);
        if (listSchedule.getId() != null) {
            throw new BadRequestAlertException("A new listSchedule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ListSchedule result = listScheduleRepository.save(listSchedule);
        if(result.getId() != null){
            Optional<ListPurchase> temp = listPurchaseRepository.findById(result.getPurchaseid());
            ListPurchase purchase = temp.get();
            UserExtra userExtra = purchase.getSeller();
            Long userId = userExtra.getUserId();
            Optional<User> temp1 = userRepository.findById(userId);
            User user = temp1.get();
            mailService.sendEmailFromTemplate(user, "mail/scheduledPurchase", "email.scheduledPurchase.title");
        }
        return ResponseEntity.created(new URI("/api/list-schedules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /list-schedules : Updates an existing listSchedule.
     *
     * @param listSchedule the listSchedule to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated listSchedule,
     * or with status 400 (Bad Request) if the listSchedule is not valid,
     * or with status 500 (Internal Server Error) if the listSchedule couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/list-schedules")
    public ResponseEntity<ListSchedule> updateListSchedule(@RequestBody ListSchedule listSchedule) throws URISyntaxException {
        log.debug("REST request to update ListSchedule : {}", listSchedule);
        if (listSchedule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ListSchedule result = listScheduleRepository.save(listSchedule);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, listSchedule.getId().toString()))
            .body(result);
    }

    /**
     * GET  /list-schedules : get all the listSchedules.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of listSchedules in body
     */
    @GetMapping("/list-schedules")
    public List<ListSchedule> getAllListSchedules() {
        log.debug("REST request to get all ListSchedules");
        return listScheduleRepository.findAll();
    }

    /**
     * GET  /list-schedules/:id : get the "id" listSchedule.
     *
     * @param id the id of the listSchedule to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the listSchedule, or with status 404 (Not Found)
     */
    @GetMapping("/list-schedules/{id}")
    public ResponseEntity<ListSchedule> getListSchedule(@PathVariable Long id) {
        log.debug("REST request to get ListSchedule : {}", id);
        Optional<ListSchedule> listSchedule = listScheduleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(listSchedule);
    }

    /**
     * GET  /list-schedules-purchase/:purchaseid: get the "id" listSchedule.
     *
     * @param purchaseid the id of the listSchedule to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the listSchedule, or with status 404 (Not Found)
     */
    @GetMapping("/list-schedules-purchase/{purchaseid}")
    public ResponseEntity<ListSchedule> getPurchase(@PathVariable Long purchaseid) {
        log.debug("REST request to get getPurchase : {}", purchaseid);
        Optional<ListSchedule> schedule = listScheduleRepository.findBypurchaseid(purchaseid);
        return ResponseUtil.wrapOrNotFound(schedule);
    }

    /**
     * DELETE  /list-schedules/:id : delete the "id" listSchedule.
     *
     * @param id the id of the listSchedule to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/list-schedules/{id}")
    public ResponseEntity<Void> deleteListSchedule(@PathVariable Long id) {
        log.debug("REST request to delete ListSchedule : {}", id);
        listScheduleRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
