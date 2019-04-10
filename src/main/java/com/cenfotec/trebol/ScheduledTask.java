// information: https://www.callicoder.com/spring-boot-task-scheduling-with-scheduled-annotation/
package com.cenfotec.trebol;

import com.cenfotec.trebol.domain.ListPurchase;
import com.cenfotec.trebol.domain.ListSchedule;
import com.cenfotec.trebol.domain.User;
import com.cenfotec.trebol.domain.UserExtra;
import com.cenfotec.trebol.repository.ListPurchaseRepository;
import com.cenfotec.trebol.repository.ListScheduleRepository;
import com.cenfotec.trebol.repository.UserRepository;
import com.cenfotec.trebol.service.MailService;
import com.cenfotec.trebol.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Component
public class ScheduledTask {

    private static final Logger logger = LoggerFactory.getLogger(TrebolApp.class);

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final ListScheduleRepository listScheduleRepository;
    private final ListPurchaseRepository listPurchaseRepository;
    private final UserRepository userRepository;
    private final MailService mailService;

    public ScheduledTask(ListScheduleRepository listScheduleRepository, ListPurchaseRepository listPurchaseRepository,UserRepository userRepository, MailService mailService) {
        this.listScheduleRepository = listScheduleRepository;
        this.listPurchaseRepository = listPurchaseRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /* @Scheduled(fixedRate = 2000)
    public void scheduleTaskWithFixedRate() {
        logger.info("Fixed Rate Task :: Execution Time - {}", dateTimeFormatter.format(LocalDateTime.now()) );
    }

    @Scheduled(fixedDelay = 2000)
    public void scheduleTaskWithFixedDelay() {
        logger.info("Fixed Delay Task :: Execution Time - {}", dateTimeFormatter.format(LocalDateTime.now()));
        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException ex) {
            logger.error("Ran into an error {}", ex);
            throw new IllegalStateException(ex);
        }
    }

    @Scheduled(fixedRate = 2000, initialDelay = 5000)
    public void scheduleTaskWithInitialDelay() {
        logger.info("Fixed Rate Task with Initial Delay :: Execution Time - {}", dateTimeFormatter.format(LocalDateTime.now()));
    } */

    @Scheduled(cron = "1 0 * * * ?") // cada minuto cron = "0 * * * * ?"
    public void scheduleTaskWithCronExpression() {
        List<ListSchedule> schedules = listScheduleRepository.findAll();
        for (ListSchedule schedule: schedules) {
            Optional<ListPurchase> temp = listPurchaseRepository.findById(schedule.getPurchaseid());
            ListPurchase purchase = temp.get();
            UserExtra userExtra = purchase.getSeller();
            Long userId = userExtra.getUserId();
            Optional<User> temp1 = userRepository.findById(userId);
            User user = temp1.get();
            if(purchase.getState()) {
                mailService.sendEmailFromTemplate(user, "mail/recordatoryScheduleList", "email.recordatoryScheduleList.title");
            }
        }
        logger.info("Cron Task :: Execution Time - {}", dateTimeFormatter.format(LocalDateTime.now()));
    }
}
