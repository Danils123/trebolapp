package com.cenfotec.trebol.web.websocket;

import static com.cenfotec.trebol.config.WebsocketConfiguration.IP_ADDRESS;

import com.cenfotec.trebol.domain.OrderItem;
import com.cenfotec.trebol.web.websocket.dto.ActivityDTO;

import java.security.Principal;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class OrderService implements ApplicationListener<SessionDisconnectEvent> {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final SimpMessageSendingOperations messagingTemplate;

    public OrderService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/topic/solicitude")
    @SendTo("/topic/order_queue")
    public OrderItem sendOrder(@Payload OrderItem order, StompHeaderAccessor stompHeaderAccessor, Principal principal) {
        log.debug("Sending order data {}", order);
        messagingTemplate.convertAndSend("/topic/order_counter", order);
        return order;
    }

    @MessageMapping("/topic/complete")
    @SendTo("/topic/delivery")
    public OrderItem completeOrder(@Payload OrderItem order, StompHeaderAccessor stompHeaderAccessor,
            Principal principal) {
        messagingTemplate.convertAndSend("/topic/order_counter_reduce", order);
        return order;
    }

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {

    }
}
